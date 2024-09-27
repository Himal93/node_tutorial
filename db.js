const mongoose = require('mongoose');

//Define mongoDB connection URL
const mongoURL = 'mongodb://localhost:27017/DemoDB' //here DemoDB is a database name

//setup MongoDB connection
mongoose.connect(mongoURL)
    .then(() => {
        console.log("Connected to MongoDB server");
    })
    .catch((err) => {
        console.error("MongoDB connection Error", err);
    });

// Get the default connection
const db = mongoose.connection; //handle events and interacts with database

db.on('disconnected', ()=>{
    console.log("MongoDB Disonnected");
});

// Export the database connection
module.exports = db;