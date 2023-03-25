const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const booksArray = Object.values(books);

public_users.post("/register", (req,res) => {
  //Write your code here
/*
codigo edwin
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(booksArray,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
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
*/

const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add new user
  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});


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
  
  /*
  const author = req.params.author;
  let filtered_author = booksArray.filter((book) => book.author === author);
  res.send(filtered_author);}
*/

  /*
este tambien se puede usar, crea un nuevo objeto y pasa el isbn y el nombre
  const author = req.params.author;

  const matchingBooks = Object.values(books).filter(book => book.author === author);
  if (matchingBooks.length === 0) {
    return res.status(404).json({message: "No books found for this author"});
  }

  const bookDetails = matchingBooks.map(book => {
    return {
      title: book.title,
      isbn: Object.keys(books).find(key => books[key] === book)
    }
  });

  return res.status(200).json({books: bookDetails});

  */
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  
  /*
  solucion de edwiin
  const title = req.params.title;
  let filtered_title = booksArray.filter((book) => book.title === title);
  res.send(filtered_title);
  */

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


  
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
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