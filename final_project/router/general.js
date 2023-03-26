const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({
    username,
    password,
    bookReviews: [],
  });

  return res.status(200).json({ message: "User registered successfully" });

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    return res.status(200).json(book);
  }else{
    return res.status(404).json({message: "Book not found"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const author = req.params.author;
  const booksArr = Object.keys(books);
  const result = [];
  for (let i = 0; i < booksArr.length; i++) {
    const book = books[booksArr[i]];
    if (book.author.toLowerCase() === author.toLowerCase()) {
      result.push(book);
    }
  }
  if (result.length > 0) {
    return res.status(200).json({books: result});
  } else {
    return res.status(404).json({message: "No books found for the author"});
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title


public_users.get('/title/:title', function(req, res) {
    const title = req.params.title;
    let matchingBooks = [];
    const booksArr = Object.values(books);
    for (let book of booksArr) {
      if (book.title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push(book);
      }
    }
    if (matchingBooks.length === 0) {
      return res.status(404).json({message: "Book not found"});
    } else {
      return res.status(200).json({books: matchingBooks});
    }
});


console.log(users)
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  console.log(users)
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    if (reviews && reviews.length > 0) {
      return res.status(200).json({reviews: reviews});
    } else {
      return res.status(404).json({message: "No reviews found for the book"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
