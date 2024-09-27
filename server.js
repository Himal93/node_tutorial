const express = require('express');
const app = express();
const db = require('./db');
const PORT = process.env.PORT || 3000;

//bodyParser.json() automatically parse JSON data and converts into JS object & store in req.body
const bodyParser = require('body-parser'); 
app.use(bodyParser.json());


// middleware function
const logRequest = (req, res, next) =>{
    console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
    next();  //move to next phase otherwise it will stay at sending request state
}

app.use(logRequest);
app.get('/', (req, res)=> {
  res.send('Welcome to my hotel.')
});

// import the router files
const personRoutes = require('./routes/personRoutes');
const menuItemsRoutes = require('./routes/menuItemsRoutes');

// use the routers
app.use('/person', personRoutes);
app.use('/menu', menuItemsRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});