const express = require('express');
const router = express.Router();
const MenuItem = require('./../models/MenuItem');

// POST route to add a menuitem
router.post('/', async(req,res)=>{
    try{
        const data = req.body  //assuming request body conatins person data

        // Create a new Person document using Mongoose model
        const newItem = new MenuItem(data);

        //Save the new Person to the database
        const response = await newItem.save();
        console.log('data saved');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

//GEt method to get/retrive the item
router.get('/', async(req,res) =>{
    try{
        const data = await MenuItem.find();
        console.log('item fetched');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
})

// GET method to retrive data on basis of taste
router.get('/:tasteType', async(req,res) =>{
    try{
        const tasteType = req.params.tasteType;
        if(tasteType == "spicy" || tasteType == "sweet" || tasteType == "sour"  ){
            const response = await MenuItem.find({taste: tasteType});
            console.log('response fetched');
            res.status(200).json(response);
        }else{
            res.status(404).json({error: 'Invalid tasteType'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

// PUT method to update data in databases
router.put('/:id', async(req, res)=>{
    try{
        const itemId = req.params.id;
        const updatedItemData = req.body;
        const response = await MenuItem.findByIdAndUpdate(itemId, updatedItemData,{
            new: true,
            runValidators: true
        });
        if(!response){
            return res.status(404).json({error: "Item not found"});
        }
        console.log('data updated');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

// DELETE method
router.delete('/:id', async(req, res)=>{
    try{
        const itemId = req.params.id;
        
        const response = await MenuItem.findByIdAndDelete(itemId);
        if(!response){
            return res.status(404).json({error: "Item not found"});
        }
        console.log("Data deleted");
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
}) 

module.exports = router;