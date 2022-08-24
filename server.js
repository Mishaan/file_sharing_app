require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// this is for running the server ...
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.static(__dirname));
app.use(express.json());                   // this is for enabling that we are sending json data, as the server doesn't accept it by default

// this is for building the database
const connectDB = require('./config/db');
connectDB();

// template engine
// this will create the path for the views folder
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})










