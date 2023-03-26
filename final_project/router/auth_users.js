const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const { username, password } = req.body;

  req.session.user = {
    username: username,
    bookReviews: []
  };

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({
    message: "User successfully logged in",
    accessToken: accessToken
  });
} else {
  return res.status(208).json({ message: "Invalid Login. Check username and password" });
}
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const { username } = req.session.user;
  const { isbn } = req.params;
  const { review } = req.body;

  // find the user in the array by username
  const userIndex = users.findIndex((user) => user.username === username);

  // if user exists in the array, find the book review by ISBN and modify if it exists or add if it doesn't
  if (userIndex !== -1) {
    const bookReviewIndex = users[userIndex].bookReviews.findIndex(
      (book) => book.isbn === isbn
    );
    if (bookReviewIndex !== -1) {
      users[userIndex].bookReviews[bookReviewIndex].review = review;
      res.status(200).json({
        message: "Review modified successfully",
        review: users[userIndex].bookReviews[bookReviewIndex],
      });
    } else {
      users[userIndex].bookReviews.push({ isbn, review });
      res.status(200).json({
        message: "Review added successfully",
        review: users[userIndex].bookReviews[
          users[userIndex].bookReviews.length - 1
        ],
      });
    }
  } else {
    res.status(401).json({
      message: "User not logged in",
    });
  }

//  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.get("/users", (req, res) => {
    res.status(200).json({ users: users });
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.session.user;
    const { isbn } = req.params;
  
    // find the user in the array by username
    const userIndex = users.findIndex((user) => user.username === username);
  
    // if user exists in the array, find the book review by ISBN and delete it
    if (userIndex !== -1) {
      const bookReviewIndex = users[userIndex].bookReviews.findIndex(
        (book) => book.isbn === isbn
      );
      if (bookReviewIndex !== -1) {
        users[userIndex].bookReviews.splice(bookReviewIndex, 1);
        res.status(200).json({
          message: "Review deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "Book review not found",
        });
      }
    } else {
      res.status(401).json({
        message: "User not logged in",
      });
    }
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
