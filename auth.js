// setup passport with a local authentication strategy using a Person model for use
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person');


passport.use(new LocalStrategy(async (username, password, done) =>{
    //authentication logic here
    try{
      const user = await Person.findOne({username});
      if(!user)
        return done(null, false, {message: "Incorrect username"});
  
      const isPasswordMatch = await user.comparePassword(password);
      if(isPasswordMatch){
        return done(null, user);
      }else{
        return done(null, false, {message: "Incorrect password"});
      }
  
    }catch(err){
      return done(err);
    }
  }));


  module.exports = passport; //export configured passport