require('dotenv').config();

const mongoose = require('mongoose');

function connectDB() {
    // database connection

    // a template / snippet for the database connection used before connection
    // mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});

    // url is a connection string for making connection
    // url -> we will get from the cloud where we are going to store our data
    // also one more important thing about the url is that we can't give it here directly as it is not good for the security as our main credentials will be leaked as deploy it to github or anywhere
    // so for that we will create a secret file and store all these things there.....
    // & the other part is configuration which we have to provide

    // mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});
    mongoose.connect(process.env.MONGO_CONNECTION_URL);

    const connection = mongoose.connection;        // we store the connection in a variable also named as connection

    connection.once('open', () => {
      console.log('MongoDB running, Database Connected!');
    }).on('error', function (err) {
      console.log('Failed to connect to database!');
    });
    // it's like an event listener
    // connection.once('open', () => {             // this is for informing that the connection has been established
    //     console.log('Database connected.');
    // }).catch(err => {                           // this part is incase we fetch any error
    //     console.log('Connection failed.');
    // })
}

module.exports = connectDB;