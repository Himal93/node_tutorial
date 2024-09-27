const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define the person schema
const personSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    work:{
        type: String,
        enum:['chef', 'waiter', 'manager'], //takes input only availabe in option
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String
    },
    salary:{
        type: Number
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

personSchema.pre('save', async function(next){
    const person = this;

    // hash th password only if it has been modified(or new)
    if(!person.isModified('password')) return next();

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash passowrd
        const hashPassword = await bcrypt.hash(person.password, salt);
        // override the plain password with hashed one
        person.password = hashPassword;
        next();
    }catch(err){
        return next(err);
    }
});

personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // use bcrypt to compare provided password with hashed password 
        //concept is compare function extract salt from storedhashPassword and uses it to hash the entered password the compares it if they match or not
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

// Create Person model
const Person = mongoose.model('Person', personSchema);

module.exports = Person;