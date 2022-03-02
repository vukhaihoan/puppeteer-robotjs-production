const detail = require("./details.json");
const fs = require("fs");
// merge girl and gril_one_word

function removeAccents(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

// example string
const str =
    "Giữa không gian im lìm của sân khấu, ánh đèn dần bật sáng. Nữ ca sĩ xuất hiện tựa như một tiên nữ giáng trần giữa làn khói mơ màng, đứng cạnh một cây đàn piano. Khuôn mặt được chăm chút kĩ càng, bộ váy xòe màu sữa bồng bềnh được đính cầu kì lấp lánh. Những nốt nhạc đầu tiên vang lên và cô ấy đã sẵn sàng cất cao giọng hát. Đó là một bài hát nhẹ nhàng, da diết, kể về câu chuyện tình yêu buồn. Cô ấy có một giọng hát trong trẻo, vang, cao và rộng- giọng hát đầy nội lực. Những lúc cô ấy lên nốt cao, cả khán đài như vỡ òa, tiếng vỗ tay không ngớt và gia đình em ngồi xem thì cũng xuýt xoa. Em có thể cảm nhận Am My đã đặt tất cả trái tim, tình cảm, những trải nghiệm của mình vào trong một màn trình diễn này. Biểu cảm gương mặt của cô ấy cũng rất đa dạng, khi u buồn, khi suy tư. Những đoạn quay cận mặt, ánh mắt cô ấy lấp lánh như một vì sao, một tiểu vũ trụ chất chứa nỗi lòng. Cô ấy có những đoạn luyến, độ rung và cả những chỗ bỏ ngỏ như khơi lên ở người xem người nghe một cái gì đó day dứt, băn khoăn, đặc biệt là những người có sự đồng cảm sâu sắc với bài hát. Cô ấy cũng đi chuyển nhẹ nhàng trên sân khấu, đung đưa theo nhịp điệu, bàn tay phóng khoáng, nâng lên hạ xuống nhịp nhàng. Phần trình diễn của Am My còn cộng hưởng với hiệu ứng mã nhãn với tông ấm nóng. Màn hình LED đằng sau chuyển cảnh liên tục, đầy lung linh huyền ảo. Ánh đèn khi tỏ khi mờ, đan xen vào nhau. Hòa cùng với đó là tiếng đàn piano khi trầm khi bổng, những ngón tay điêu luyện trên phím đàn. Khán giả ở dưới ru mình vào bài hát, ngân nga theo giai điệu. Có người còn không kìm nổi niềm xúc động. Những cây gậy cổ vũ sáng lấp lánh tạo nên một khung cảnh như bầu trời đầy sao. Khi tiếng đàn vừa dứt, tiếng vỗ tay vang lên giòn giã và kéo dài một lúc lâu. Gia đình em cũng tấm tắc khen ngợi màn trình diễn còn em vẫn như đang chìm trong thế giới nghệ thuật của Am My.Ca sĩ Hari Won xuất hiện thật xinh đẹp và trẻ trung và cô không quên gửi tới tất cả khán giả với một nụ cười làm cho nhiều người say đắm. Sự xuất hiện nhận được sự hoan nghênh nhiệt tình và nồng nhiệt từ các khán giả. Cô ấy mặc một chiếc váy theo phong cách một quý cô thanh lịch là hình tượng mà khiến cho bao nhiêu chàng trai đổ gục vì cô. Những bài hát của cô trình diễn vô cùng quen thuộc như: Hương đêm bay xa, Anh cứ đi đi và những bài hát rung động lòng người. Những bài hát kết thúc là lúc khán giả giao lưu với ca sĩ. Nhiều bạn trẻ xin chữ ký và chụp hình chung với thần tượng. Ca sĩ vui vẻ kí tặng nhiều fan hâm mộ và những người yêu mến. Đã đến lúc tiết mục khác ca sĩ rời đi trong sự tiếc nuối trong đó có em";
const strremove = removeAccents(str);
const result = strremove.split(",").join("").split(".").join("").split(" ");
const full = result.concat(detail);
fs.writeFileSync("../detail.json", JSON.stringify(full));
