const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "username and password required"});
  }

  if (isValid(username)) {
    return res.status(409).json({message:"username already exist"});
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered"});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    axios.get('http://localhost:5000/')
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(500).json({ message: "Error fetching book list" });
      });
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(book);
  } else {
    res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = [];

  const bookKeys = Object.keys(books);

  bookKeys.forEach((key) => {
    if (books[key].author === author) {
        booksByAuthor.push(books[key]);
    }
  });
  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor);
  } else {
    res.status(404).send({message: "No books by author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = [];
  const bookKeys = Object.keys(books);

  bookKeys.forEach((key) => {
    if (books[key].title === title) {
        booksByTitle.push(books[key]);
    }
  });
  if (booksByTitle.length > 0) {
    res.send(booksByTitle);
  } else {
    res.status(404).send({message: "No book on this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book) {
    res.send(book.review);
  } else {
    res.status(404).send({ message: "Book not found" });
  }
});

module.exports.general = public_users;
