const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "username and password required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "username already exist" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered" });
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
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});
// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      res.send(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
  });
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.send(book.review);
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});

module.exports.general = public_users;
