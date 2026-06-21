const API_BASE = "http://localhost:3000";

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function formatPrice(n) {
    return Number(n).toLocaleString("vi-VN");
}
function getToken() { return localStorage.getItem("auth_token"); }
function setToken(t) { localStorage.setItem("auth_token", t); }
function clearToken() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_username");
}
function getCurrentUsername() { return localStorage.getItem("auth_username"); }
function authHeaders() { return { Authorization: "Bearer " + getToken() }; }

let allFoods = [];      // toàn bộ món ăn lấy từ /api/foods
let favoriteIds = [];   // id các món user hiện tại đã yêu thích
let viTriCuon = 0;

async function loadInitialData() {
    try {
        const res = await fetch(`${API_BASE}/api/foods`);
        if (!res.ok) throw new Error("Lỗi tải món ăn");
        allFoods = await res.json();
    } catch (err) {
        console.error("Không tải được danh sách món ăn:", err);
        allFoods = [];
        const wrap = document.getElementById("foodList");
        if (wrap) {
            wrap.innerHTML = `<p style="text-align:center; grid-column:1/-1;">
                ⚠️ Không kết nối được tới backend (${API_BASE}).<br>
                Kiểm tra server Node.js đã chạy chưa (npm start trong thư mục backend).
            </p>`;
        }
        return;
    }
    await loadFavorites();
    renderFoods(allFoods);
}

async function loadFavorites() {
    if (!getToken()) { favoriteIds = []; return; }
    try {
        const res = await fetch(`${API_BASE}/api/favorites`, { headers: authHeaders() });
        if (res.ok) {
            const data = await res.json();
            favoriteIds = data.map(f => f.id);
        } else {
            favoriteIds = [];
        }
    } catch (err) {
        favoriteIds = [];
    }
}

function renderFoods(list) {
    const wrap = document.getElementById("foodList");
    if (!wrap) return;
    wrap.innerHTML = "";

    if (list.length === 0) {
        wrap.innerHTML = `<p style="text-align:center; grid-column:1/-1;">Không tìm thấy món ăn nào.</p>`;
        return;
    }

    list.forEach(mon => {
        const isFav = favoriteIds.includes(mon.id);
        const card = document.createElement("div");
        card.className = "card";
        card.style.position = "relative";
        card.dataset.region = mon.region;
        card.dataset.id = mon.id;

        const shortDesc = mon.description.length > 110
            ? mon.description.slice(0, 110) + "…"
            : mon.description;

        card.innerHTML = `
            <img src="${mon.image}" alt="${mon.name}">
            <button type="button" class="fav-btn ${isFav ? "active" : ""}">${isFav ? "❤️" : "🤍"}</button>
            <div class="card-content">
                <h2>${mon.name}</h2>
                <p>${shortDesc}</p>
                <p><b>Xuất xứ:</b> ${mon.origin}</p>
                <p><b>Giá:</b> ${formatPrice(mon.price_min)} - ${formatPrice(mon.price_max)} VNĐ</p>
                <a href="#" class="btn">Xem Chi Tiết</a>
            </div>
        `;

        card.querySelector(".fav-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(mon.id, e.currentTarget);
        });
        card.querySelector(".btn").addEventListener("click", (e) => {
            e.preventDefault();
            xemChiTiet(mon.id);
        });

        wrap.appendChild(card);
    });
}

function locMonAn(vung) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";
    const filtered = vung === "all" ? allFoods : allFoods.filter(f => f.region === vung);
    renderFoods(filtered);
}

function timKiemMonAn() {
    const tuKhoa = document.getElementById("searchInput").value.toLowerCase();
    const filtered = allFoods.filter(f => f.name.toLowerCase().includes(tuKhoa));
    renderFoods(filtered);
}

function xemYeuThich() {
    if (!getToken()) { openAuthModal("login"); return; }
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";
    const favFoods = allFoods.filter(f => favoriteIds.includes(f.id));
    renderFoods(favFoods);
}

function xemChiTiet(id) {
    viTriCuon = window.scrollY;
    const mon = allFoods.find(f => f.id === id);
    if (!mon) return;

    document.querySelector("header").style.display = "none";
    document.querySelector("nav").style.display = "none";
    document.querySelector(".container").style.display = "none";
    document.querySelector("footer").style.display = "none";
    document.getElementById("chiTietPage").style.display = "block";

    document.getElementById("detailTitle").innerText = mon.name;
    document.getElementById("detailImage").src = mon.image;
    document.getElementById("detailRating").innerText = mon.rating + "/5 ⭐";
    document.getElementById("detailOrigin").innerText = mon.origin;
    document.getElementById("detailPrice").innerText =
        formatPrice(mon.price_min) + " - " + formatPrice(mon.price_max) + " VNĐ";
    document.getElementById("detailIngredient").innerText = mon.ingredients;
    document.getElementById("detailContent").innerText = mon.description;
    document.getElementById("detailHistory").innerText = mon.history;
    window.scrollTo(0, 0);
}

function quayLai() {
    document.querySelector("header").style.display = "flex";
    document.querySelector("nav").style.display = "block";
    document.querySelector(".container").style.display = "block";
    document.querySelector("footer").style.display = "block";
    document.getElementById("chiTietPage").style.display = "none";
    setTimeout(() => window.scrollTo(0, viTriCuon), 0);
}

async function toggleFavorite(foodId, btnEl) {
    if (!getToken()) { openAuthModal("login"); return; }

    const isFav = favoriteIds.includes(foodId);
    try {
        if (isFav) {
            await fetch(`${API_BASE}/api/favorites/${foodId}`, {
                method: "DELETE",
                headers: authHeaders()
            });
            favoriteIds = favoriteIds.filter(id => id !== foodId);
            btnEl.classList.remove("active");
            btnEl.textContent = "🤍";
        } else {
            await fetch(`${API_BASE}/api/favorites`, {
                method: "POST",
                headers: { ...authHeaders(), "Content-Type": "application/json" },
                body: JSON.stringify({ foodId })
            });
            favoriteIds.push(foodId);
            btnEl.classList.add("active");
            btnEl.textContent = "❤️";
        }
    } catch (err) {
        alert("⚠️ Không thể cập nhật yêu thích. Kiểm tra backend đã chạy chưa.");
    }
}
let geminiApiKey = localStorage.getItem("gemini_api_key") || "";
let chatHistory = [];

const chatToggle = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const chatMessages = document.getElementById("chatMessages");

chatToggle.addEventListener("click", () => {
    const isOpen = chatBox.style.display === "flex";
    chatBox.style.display = isOpen ? "none" : "flex";
    if (!isOpen) {
        updateApiKeyUI();
    }
});

function updateApiKeyUI() {
    const keySection = document.getElementById("apiKeySection");
    const chatInputArea = document.getElementById("chatInputArea");
    if (geminiApiKey) {
        keySection.style.display = "none";
        chatInputArea.style.display = "flex";
    } else {
        keySection.style.display = "flex";
        chatInputArea.style.display = "none";
    }
}

function saveApiKey() {
    const input = document.getElementById("geminiKeyInput").value.trim();
    if (!input) {
        alert("Vui lòng nhập API key!");
        return;
    }
    geminiApiKey = input;
    localStorage.setItem("gemini_api_key", geminiApiKey);
    updateApiKeyUI();
    themTinNhan("🎉 Đã kết nối Gemini AI! Hỏi tôi bất cứ điều gì về ẩm thực Việt Nam nhé.", "bot-message");
}

function resetApiKey() {
    geminiApiKey = "";
    localStorage.removeItem("gemini_api_key");
    chatHistory = [];
    updateApiKeyUI();
}

function toggleShowKey() {
    const inp = document.getElementById("geminiKeyInput");
    const btn = document.getElementById("toggleKeyBtn");
    if (inp.type === "password") {
        inp.type = "text";
        btn.textContent = "🙈";
    } else {
        inp.type = "password";
        btn.textContent = "👁️";
    }
}

function handleEnter(event) {
    if (event.key === "Enter") guiTinNhan();
}

function themTinNhan(noiDung, className) {
    const div = document.createElement("div");
    div.className = className;
    div.innerHTML = noiDung.replace(/\n/g, "<br>");
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function themTinNhanDangGo() {
    const div = document.createElement("div");
    div.className = "bot-message typing-indicator";
    div.id = "typingMsg";
    div.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function xoaTinNhanDangGo() {
    const el = document.getElementById("typingMsg");
    if (el) el.remove();
}

async function guiTinNhan() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    themTinNhan(message, "user-message");
    input.value = "";

    chatHistory.push({ role: "user", parts: [{ text: message }] });

    themTinNhanDangGo();

    try {
        const systemContext = `Bạn là trợ lý ẩm thực Việt Nam thân thiện và am hiểu. 
Hãy trả lời bằng tiếng Việt, ngắn gọn súc tích, dùng emoji phù hợp để sinh động. 
Tập trung vào các món ăn Việt Nam: cách làm, nguyên liệu, lịch sử, vùng miền, gợi ý quán ăn.
Nếu câu hỏi không liên quan đến ẩm thực, hãy lịch sự hướng về chủ đề ẩm thực Việt Nam.`;

        const payload = {
            system_instruction: { parts: [{ text: systemContext }] },
            contents: chatHistory,
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 512,
            }
        };

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        const data = await res.json();

        xoaTinNhanDangGo();

        if (data.error) {
            if (data.error.code === 400 || data.error.code === 403) {
                themTinNhan("❌ API key không hợp lệ. Vui lòng kiểm tra lại key của bạn.", "bot-message");
                resetApiKey();
            } else {
                themTinNhan("⚠️ Lỗi: " + data.error.message, "bot-message");
            }
            chatHistory.pop();
            return;
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi không hiểu câu hỏi này.";
        chatHistory.push({ role: "model", parts: [{ text: reply }] });
        themTinNhan(reply, "bot-message");

    } catch (err) {
        xoaTinNhanDangGo();
        themTinNhan("⚠️ Không thể kết nối. Kiểm tra internet và API key.", "bot-message");
        chatHistory.pop();
    }
}

function openAuthModal(tab = "login") {
    document.getElementById("authOverlay").style.display = "flex";
    switchAuthTab(tab);
}

function closeAuthModal() {
    document.getElementById("authOverlay").style.display = "none";
    document.getElementById("loginError").textContent = "";
    document.getElementById("registerError").textContent = "";
}

function switchAuthTab(tab) {
    const isLogin = tab === "login";
    document.getElementById("loginForm").style.display = isLogin ? "flex" : "none";
    document.getElementById("registerForm").style.display = isLogin ? "none" : "flex";
    document.getElementById("tabLogin").classList.toggle("active", isLogin);
    document.getElementById("tabRegister").classList.toggle("active", !isLogin);
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("registerConfirm").value;
    const errorEl = document.getElementById("registerError");
    errorEl.textContent = "";

    if (username.length < 3) { errorEl.textContent = "Tên đăng nhập phải có ít nhất 3 ký tự."; return; }
    if (password.length < 6) { errorEl.textContent = "Mật khẩu phải có ít nhất 6 ký tự."; return; }
    if (password !== confirm) { errorEl.textContent = "Mật khẩu xác nhận không khớp."; return; }

    try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) { errorEl.textContent = data.error || "Đăng ký thất bại."; return; }

        setToken(data.token);
        localStorage.setItem("auth_username", data.username);
        document.getElementById("registerForm").reset();
        closeAuthModal();
        updateAuthUI();
        await loadFavorites();
        renderFoods(allFoods);
    } catch (err) {
        errorEl.textContent = "Không thể kết nối tới server. Kiểm tra backend đã chạy chưa.";
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";

    try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) { errorEl.textContent = data.error || "Đăng nhập thất bại."; return; }

        setToken(data.token);
        localStorage.setItem("auth_username", data.username);
        document.getElementById("loginForm").reset();
        closeAuthModal();
        updateAuthUI();
        await loadFavorites();
        renderFoods(allFoods);
    } catch (err) {
        errorEl.textContent = "Không thể kết nối tới server. Kiểm tra backend đã chạy chưa.";
    }
}

function handleLogout() {
    clearToken();
    favoriteIds = [];
    updateAuthUI();
    locMonAn("all");
}

function updateAuthUI() {
    const username = getToken() ? getCurrentUsername() : null;
    const guestBox = document.getElementById("authGuestBox");
    const userBox = document.getElementById("authUserBox");
    if (username) {
        guestBox.style.display = "none";
        userBox.style.display = "flex";
        document.getElementById("authUsername").textContent = "👤 " + username;
    } else {
        guestBox.style.display = "flex";
        userBox.style.display = "none";
    }
}
// khởi động
document.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    loadInitialData();
    updateApiKeyUI();
});