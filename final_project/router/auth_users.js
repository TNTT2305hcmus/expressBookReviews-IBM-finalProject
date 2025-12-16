const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check user tồn tại
  // Có thể dùng vòng lặp for để duyệt qua mảng users rồi check
  // Ở đây dùng hàm .some() trong js cho nhanh
  const doesExist = users.some(user => user.username === username);
  return doesExist;
}

// Check tài khoản user 
const authenticatedUser = (username,password)=>{ //returns boolean
  // Lọc validusers bằng hàm .filter()
  const validusers = users.filter(user => {
    return user.username === username && user.password === password;
  });

  // Nghĩa là tồn tại tài khoản này
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // Lấy username và password từ body của URL
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  } 

  if(authenticatedUser(username, password)){
    // Nếu tài khoản đã đăng ký
    // Tạo JWT Token
    let accessToken = jwt.sign({
      data : password
    }, 'access', {expiresIn: 60 * 60});

    // Lưu token và username vào session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Lấy nội dung review sau query (?) và gắn nó với username đang đăng nhập trong session

  // Lấy isbn từ URL
  const isbn = req.params.isbn;

  // 
  const review = req.query.review;

  // Lấy username từ session để đảm bảo đúng người đăng nhập
  const username = req.session.authorization['username'];

  if(books[isbn]){
    // Nếu book tồn tại
    // reviews trong book là 1 object
    // Ở đây ta sẽ thêm nội dung review vào với key là username (người đưa ra review)
    // Nếu user này chưa review -> Tạo review mới
    // Nếu user này đã review -> Update lại review cũ
    
    books[isbn].reviews[username] = review;
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
    return res.status(404).json({message: "Book not found"});
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];

  if(books[isbn]){
    // Check xem user đã có review cuốn sách này chưa
    if(books[isbn].reviews[username]){
      // Dùng lệnh delete để xóa thuộc tính trong object
      delete books[isbn].reviews[username];
      return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
    } else {
        return res.status(404).json({message: "Review not found for this user"});
    }
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
