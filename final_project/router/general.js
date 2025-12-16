const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  // Lấy username và password từ body của req
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){ 

    if(isValid){
      res.status(404).json({message: "User already exists"});
    } else {
      // Nếu user chưa tồn tại thì thêm vào mảng và thông báo đăng ký thành công
      users.push({"username" : username, "password" : password});
      res.status(200).json({message : "User successfully registered. Now you can login"})
    }
  }
  // Nếu thiếu username hoặc password
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Trả về danh sách tất cả sách dưới dạng string (đã được định dạng cho đẹp)
  // Thụt đầu dòng 4 ô
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Lấy giá trị isbn từ tham số (params) của URL
  const isbn = req.params.isbn;

  // Check nếu book tồn tại thì trả về, không thì gửi tin nhắn
  if(books[isbn]){
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Lấy giá trị author từ params của URL
  const authorName = req.params.author;

  // Books là object, cần tạo mảng các book có cùng tác giả
  const matchingBooks = [];

  // Lấy danh sách key trong books và duyệt từng key để kiểm tra author
  const keys = Object.keys(books);
  keys.forEach(key => {
    if(books[key].author === authorName){
      matchingBooks.push(books[key]);
    }
  })
  
  // Trả về
  if(matchingBooks.length > 0){
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "Author not found"});
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Lấy giá trị title từ params của URL
  const title = req.params.title;

  // Books là object, cần tạo mảng các book có cùng tác giả
  const matchingBooks = [];

  // Lấy danh sách key trong books và duyệt từng key để kiểm tra author
  const keys = Object.keys(books);
  keys.forEach(key => {
    if(books[key].title === title){
      matchingBooks.push(books[key]);
    }
  })
  
  // Trả về
  if(matchingBooks.length > 0){
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "Title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Lấy giá trị isbn từ params của URL
  const isbn = req.params.isbn;

  if(books[isbn]){
    return res.status(200).json(books[isbn].review)
  } else {
    return res.status(404).json({message: "Book not found"});
  }

});

// Task 10: 
// Add the code for getting the list of books available in the shop (done in Task 1) 
// using Promise callbacks or async-await with Axios.

const getAllBooks = async () => {
  try{
    // Gọi đường dẫn lấy tất cả sách
    const response = await axios.get("http://localhost:5000/");
    console.log(response.data);
  } catch{
    console.error("Error fetching books:", error);
  }
}

// Task 11: 
// Add the code for getting the book details based on ISBN (done in Task 2)
// using Promise callbacks or async-await with Axios.

const getBookOnISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching book by ISBN:", error.message);
  }
}

// Task 12: 
// Add the code for getting the book details based on Author (done in Task 3)
// using Promise callbacks or async-await with Axios.

const getBookOnAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching book by Author:", error.message);
  }
}

// Task 13: 
// Add the code for getting the book details based on Title (done in Task 4)
// using Promise callbacks or async-await with Axios.

const getBookOnTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching book by Title:", error.message);
  }
}







module.exports.general = public_users;
