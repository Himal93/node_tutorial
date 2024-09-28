const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// POST route to add a person
router.post('/signup', async(req,res)=>{
    try{
        const data = req.body  //assuming request body conatins person data

        // Create a new Person document using Mongoose model
        const newPerson = new Person(data);

        //Save the new Person to the database
        const response = await newPerson.save();
        console.log('data saved');

        const payload = {
            id: response.id, //here response.id use object id i.e _id from data
            username: response.username
        }
        const token = generateToken(payload);
        console.log('Token is:', token);

        res.status(200).json({response: response, token: token});

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

// Login route
router.post('/login', async(req, res) =>{
    try{
        // extract username and password from request body
        const{username, password} = req.body;

        // find user by username
        const user = await Person.findOne({username: username});
        
        // if user doesnt exist or password doesnt match, return err
        if(!user || !(await user.comparePassword(password))){
            return res.status(404).json({error: 'Invalid username or password'});
        }

        //generate token after expire
        const payload ={
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);

        //return token as response
        res.json({token: token});

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
})

// profile route
router.get('/profile',jwtAuthMiddleware ,async(req, res) =>{
    try{
        // Extract user data from JWT payload in jwt.js
        const userData = req.jwtPayload;
        // console.log("user data", userData);

        // get user id from payload
        const userID = userData.id;
        // fetch user details from db using user id
        const user = await Person.findById(userID);

        // if no user found
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        // send back the user data as a response
        res.status(200).json({user});

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');  
    }
})

//GEt method to get/retrive the person
router.get('/', jwtAuthMiddleware, async(req,res) =>{
    try{
        const data = await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

// GET method to get person data on basis of worktype
router.get('/:workType', async(req,res) =>{
    try{
        const workType = req.params.workType;
        if(workType == 'chef' || workType == 'waiter' || workType == 'manager'){
            const response = await Person.find({work: workType});
            console.log('response fetched');
            res.status(200).json(response);
        }else{
        res.status(404).json({error: 'Invalid workType'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

// PUT method to update the data in databases
router.put('/:id', async(req,res)=>{
    try{
        const personId = req.params.id; //extract the id from url parameter
        const updatedPersonData = req.body; //updated data for the person

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true,   //returns updated documnet
            runValidators: true  //run mongoose validation
        });
        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }

        console.log('data updated');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

// DELETE method to delete tha data from database
router.delete('/:id', async(req, res)=>{
    try{
        const personId = req.params.id;//extract the id from url parameter

        // assuming you have a person model
        const response = await Person.findByIdAndDelete(personId);
        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }
        console.log('data deleted');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
})

module.exports = router;