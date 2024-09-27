const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');

// POST route to add a person
router.post('/signup', async(req,res)=>{
    try{
        const data = req.body  //assuming request body conatins person data

        // Create a new Person document using Mongoose model
        const newPerson = new Person(data);

        //Save the new Person to the database
        const response = await newPerson.save();
        console.log('data saved');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

//GEt method to get/retrive the person
router.get('/', async(req,res) =>{
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
        console.log('data delete');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
})

// commment to verify changes

module.exports = router;