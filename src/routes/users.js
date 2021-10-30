const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/Users/Signin',(req,res)=>{
    res.render('users/signin')
})

router.post('/users/signin',passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/Users/Signup',(req,res)=>{
    res.render('users/signup')
})
router.post('/users/signup', async (req,res)=>{
    const {name,email, password, confirm_password} = req.body
    const errors = [];
    if (name.length <= 0){
        errors.push({text: "Please type a name"})
    }
    if (password != confirm_password){
        errors.push({text: "Password don't match"})
    }
    if (password.length < 4){
        if(password.length <= 0){
            errors.push({text: "Please type a password"})
        }
        if(password.length > 1 && password.length < 4){
            errors.push({text: "Password must be at least 4 characters"})
        }
    }
    if (errors.length > 0){
        res.render('users/signup',{errors, name, email, password, confirm_password})
    } else{
        const emailUser = await User.findOne({email: email})
        if(emailUser){
            const msg = "The email is already in use"
            res.render('users/signup', {msg})
        }
        const newUser = new User({name, email, password})
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()

        const msg = "You are registered"

        res.render('users/signin',{ msg })
    }
})

module.exports = router