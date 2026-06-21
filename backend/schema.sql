-- DATABASE: am_thuc_vn
CREATE DATABASE IF NOT EXISTS am_thuc_vn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE am_thuc_vn;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  region ENUM('bac','trung','nam') NOT NULL,
  image VARCHAR(500) NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.5,
  origin VARCHAR(100) NOT NULL,
  price_min INT NOT NULL,
  price_max INT NOT NULL,
  ingredients VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  history TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  food_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_food (user_id, food_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
) ENGINE=InnoDB;
INSERT INTO foods (name, slug, region, image, rating, origin, price_min, price_max, ingredients, description, history) VALUES
('Phở Hà Nội', 'pho-ha-noi', 'bac', 'https://upload.wikimedia.org/wikipedia/commons/5/53/Pho-Beef-Noodles-2008.jpg', 4.9, 'Hà Nội', 40000, 70000, 'Bánh phở, thịt bò, rau thơm', 'Phở Hà Nội là món ăn truyền thống nổi tiếng và được xem là biểu tượng của ẩm thực Việt Nam. Nước dùng được ninh từ xương bò trong nhiều giờ kết hợp với các loại gia vị như quế, hồi, thảo quả tạo nên hương vị đậm đà đặc trưng.', 'Phở có nguồn gốc từ miền Bắc Việt Nam, được cho là ra đời vào đầu thế kỷ 20 tại Nam Định rồi phổ biến ở Hà Nội.'),
('Bún Bò Huế', 'bun-bo-hue', 'trung', 'https://upload.wikimedia.org/wikipedia/commons/0/00/Bun-Bo-Hue-from-Huong-Giang-2011.jpg', 4.8, 'Huế', 35000, 60000, 'Bún, thịt bò, giò heo, sả', 'Bún bò Huế có vị cay nhẹ và thơm mùi sả đặc trưng.', 'Bún bò Huế là món ăn đặc sản của tỉnh Huế.'),
('Bánh Mì Việt Nam', 'banh-mi-viet-nam', 'nam', 'https://cdn-i2.congthuong.vn/stores/news_dataimages/2024/032024/16/09/top-1-mon-sandwich-ngon-nhat-the-gioi-goi-ten-banh-my-viet-nam1710498007-182420240316092132.jpg', 4.9, 'TP.HCM', 15000, 30000, 'Bánh mì, pate, thịt, rau', 'Bánh mì Việt Nam là món ăn đường phố nổi tiếng thế giới.', 'Bánh mì Việt Nam có nguồn gốc từ sự kết hợp giữa ẩm thực Pháp và nguyên liệu địa phương.'),
('Cao Lầu Hội An', 'cao-lau-hoi-an', 'trung', 'https://cdn.netspace.edu.vn/images/2018/10/28/cach-lam-cao-lau-hoi-an-thanh-dam-dam-da-net-truyen-thong-1-540.jpg', 4.7, 'Quảng Nam', 30000, 50000, 'Mì cao lầu, thịt xá xíu, rau sống', 'Cao lầu là đặc sản nổi tiếng của Hội An.', 'Cao lầu là món ăn đặc sản của Hội An, kết hợp ảnh hưởng từ ẩm thực Nhật Bản và Trung Quốc.'),
('Gỏi cuốn', 'goi-cuon', 'nam', 'https://cafefcdn.com/2019/2/25/photo-2-155108219724574880618.jpg', 4.6, 'Miền Nam', 20000, 40000, 'Tôm, thịt, rau sống, bánh tráng', 'Gỏi cuốn là món ăn thanh mát và bổ dưỡng.', 'Gỏi cuốn là món ăn truyền thống của Việt Nam.'),
('Bánh xèo', 'banh-xeo', 'trung', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1uT3a5Xt8GdH82yQy4NmWDwVPp7ah39x9Qw&s', 4.8, 'Miền Trung', 20000, 40000, 'Bột gạo, tôm, thịt, giá đỗ', 'Bánh xèo nổi tiếng với lớp vỏ vàng giòn.', 'Bánh xèo là món ăn truyền thống của miền Trung Việt Nam.'),
('Xôi ngũ sắc', 'xoi-ngu-sac', 'bac', 'https://cly.1cdn.vn/2022/07/12/bvcl.1cdn.vn-2022-07-12-_s1.media.ngoisao.vn-resize_580-news-2022-07-09-_xoi-ngu-sac-6-ngoisaovn-w1536-h2048.jpg', 4.5, 'Miền Bắc', 25000, 45000, 'Gạo nếp và màu tự nhiên', 'Xôi ngũ sắc là món ăn truyền thống của đồng bào vùng cao.', 'Xôi ngũ sắc sử dụng các loại lá cây tự nhiên để tạo màu.'),
('Bún chả', 'bun-cha', 'bac', 'https://daiductai.vn/upload/filemanager/B%C3%BAn%20ch%E1%BA%A3/bun-cha.jpg', 4.8, 'Hà Nội', 30000, 50000, 'Bún, thịt nướng, nước chấm', 'Bún chả là món ăn đặc trưng của Hà Nội.', 'Bún chả là món ăn truyền thống nổi tiếng của Hà Nội.'),
('Cà phê trứng', 'ca-phe-trung', 'bac', 'https://saodieu.vn/media/Bai%20Viet%20-%20T62016/Saodieu%20-%2010%20mon%20an%2010.jpg', 4.7, 'Hà Nội', 25000, 40000, 'Cà phê, lòng đỏ trứng, sữa', 'Cà phê trứng là thức uống độc đáo của Việt Nam.', 'Cà phê trứng được sáng tạo tại Hà Nội vào thập niên 1940.'),
('Cao lầu Hội An', 'cao-lau-hoi-an-2', 'trung', 'https://moodhoian.vn/storage/photos/B%C3%A0i%20seo/dac-san-hoi-an-1-1.jpg', 4.7, 'Hội An', 40000, 60000, 'Mì cao lầu, thịt, rau', 'Cao lầu là món ăn đặc sản của Hội An.', 'Cao lầu chỉ có thể làm đúng điệu bằng nước giếng Bá Lễ ở Hội An.'),
('Chè', 'che', 'nam', 'https://static.vinwonders.com/production/che-da-lat-1.jpg', 4.6, 'Toàn quốc', 20000, 35000, 'Đậu, thạch, nước cốt dừa', 'Chè là món tráng miệng quen thuộc của người Việt.', 'Chè có lịch sử lâu đời trong ẩm thực Việt Nam.'),
('Nem lụi', 'nem-lui', 'trung', 'https://i-giadinh.vnecdn.net/2022/02/18/Buoc-6-5410-1645174529.jpg', 4.7, 'Miền Trung', 25000, 45000, 'Thịt lụi, bánh tráng, rau sống', 'Nem lụi là món ăn đặc sản của miền Trung.', 'Nem lụi phổ biến nhất tại Huế và Đà Nẵng.'),
('Bánh bột lọc Huế', 'banh-bot-loc-hue', 'trung', 'https://statics.vinpearl.com/banh-bot-loc-hue-1_1628661597.png', 4.6, 'Miền Trung', 20000, 35000, 'Bột gạo, thịt, rau sống', 'Bánh bột lọc Huế là món ăn đặc sản của tỉnh Huế.', 'Bánh bột lọc là món ăn cung đình Huế xưa.'),
('Cơm tấm Sài Gòn', 'com-tam-sai-gon', 'nam', 'https://sakos.vn/wp-content/uploads/2024/09/bia.jpg', 4.8, 'Miền Nam', 25000, 40000, 'Cơm, thịt nướng, rau sống', 'Cơm tấm Sài Gòn là món ăn đặc sản của thành phố Hồ Chí Minh.', 'Cơm tấm xuất phát từ người lao động ở Sài Gòn đầu thế kỷ 20.'),
('Chả cá Lã Vọng', 'cha-ca-la-vong', 'bac', 'https://cdn.eva.vn/upload/1-2024/images/2024-01-19/cach-lam-cha-ca-la-vong-thom-nuc-mui-an-suong-mieng-cho-dip-tat-nien-420016090_3319731778317987_4285851838373962216_n-1705637382-942-width780height681.jpg', 4.7, 'Hà Nội', 80000, 150000, 'Cá lăng, thì là, hành lá, bún', 'Chả cá Lã Vọng là đặc sản nổi tiếng của Hà Nội với hương vị thơm ngon đặc trưng.', 'Món ăn xuất hiện từ cuối thế kỷ XIX tại Hà Nội và gắn liền với phố Chả Cá.'),
('Mì Quảng', 'mi-quang', 'trung', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm6xtZ7ANjSwjXwGY3JbozFBJe9ORRKBNtsW9CZ5QI0W4AgSbBF9gSc7o&s=10', 4.8, 'Quảng Nam', 30000, 50000, 'Mì gạo, tôm, thịt, rau sống', 'Mì Quảng nổi bật với phần nước dùng đậm đà và sợi mì vàng đặc trưng.', 'Mì Quảng có nguồn gốc từ Quảng Nam và là niềm tự hào của ẩm thực miền Trung.'),
('Bánh cuốn', 'banh-cuon', 'bac', 'https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/banh-cuon-nong-thit-bam-thumbnail.jpg', 4.6, 'Miền Bắc', 20000, 40000, 'Bột gạo, thịt băm, mộc nhĩ', 'Bánh cuốn có lớp bánh mỏng mềm ăn kèm chả lụa và nước mắm pha.', 'Bánh cuốn là món ăn sáng phổ biến tại các tỉnh miền Bắc Việt Nam.'),
('Bánh canh cua', 'banh-canh-cua', 'nam', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzpJBQx_13tThnjXRDowWKobAlgiPAiBadzJq10TAX9w&s=10', 4.7, 'Miền Nam', 35000, 60000, 'Sợi bánh canh, cua, tôm, chả cua', 'Bánh canh cua có nước dùng sánh đậm vị hải sản.', 'Món ăn phát triển mạnh ở Nam Bộ và trở thành lựa chọn quen thuộc của người dân.'),
('Hủ tiếu Nam Vang', 'hu-tieu-nam-vang', 'nam', 'https://vietair.com.vn/Media/Images/vietair/Tin-tuc/2024/3/hu-tieu-nam-vang-1.jpg?p=1&w=412', 4.8, 'TP.HCM', 35000, 60000, 'Hủ tiếu, tôm, thịt băm, trứng cút', 'Hủ tiếu Nam Vang có thể ăn khô hoặc nước với hương vị đậm đà.', 'Món ăn có nguồn gốc từ Campuchia và được biến tấu phù hợp với khẩu vị người Việt.'),
('Bánh bèo Huế', 'banh-beo-hue', 'trung', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVksfEmu6L9xYJu6rKgRqtLPsALE3EfNjEFtzODkJOs2bxi2IxP92opxuV&s=10', 4.6, 'Huế', 20000, 35000, 'Bột gạo, tôm cháy, mỡ hành', 'Bánh bèo Huế được đựng trong chén nhỏ với hương vị thanh nhẹ.', 'Đây là món ăn cung đình nổi tiếng của cố đô Huế.'),
('Bún mắm', 'bun-mam', 'nam', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVksfEmu6L9xYJu6rKgRqtLPsALE3EfNjEFtzODkJOs2bxi2IxP92opxuV&s=10', 4.7, 'Miền Tây', 35000, 60000, 'Bún, mắm cá, tôm, mực, rau sống', 'Bún mắm có hương vị đậm đà đặc trưng của miền Tây Nam Bộ.', 'Món ăn được phát triển từ văn hóa ẩm thực của người Khmer Nam Bộ.'),
('Bánh khọt', 'banh-khot', 'nam', 'https://cdn.hstatic.net/files/200000700229/article/cach-lam-banh-khot-1_06187869db3b4e878857e0587f3a1c09.jpg', 4.7, 'Vũng Tàu', 25000, 45000, 'Bột gạo, tôm, hành lá', 'Bánh khọt có lớp vỏ giòn, ăn kèm rau sống và nước chấm chua ngọt.', 'Bánh khọt là món ăn nổi tiếng của vùng biển Vũng Tàu.'),
('Ốc len xào dừa', 'oc-len-xao-dua', 'nam', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPF32Vn5hxKbe40wP9GUGNrv9znaOVT64d2UFzBuTlfkb_H3GUrO1_Q99w&s=10', 4.8, 'TP.HCM', 40000, 80000, 'Ốc len, nước cốt dừa, sả, ớt', 'Ốc len xào dừa là món ăn vặt hấp dẫn với vị béo ngậy của nước cốt dừa.', 'Món ăn phổ biến tại các quán ốc ở TP.HCM từ nhiều thập kỷ qua.'),
('Lẩu mắm', 'lau-mam', 'nam', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd347MZuS3FxuspcLqyaw7z5VgSzQwgJGRDm_mH6HeIChHA8ctK0k_yug&s=10', 4.8, 'Miền Tây', 150000, 300000, 'Mắm cá, hải sản, thịt, rau đồng', 'Lẩu mắm là món ăn đặc trưng của miền Tây với hương vị đậm đà.', 'Lẩu mắm được hình thành từ thói quen sử dụng mắm trong đời sống người dân Nam Bộ.');