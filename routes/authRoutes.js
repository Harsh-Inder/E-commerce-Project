
const express= require('express');
const router= express.Router();
const User = require('../models/user');
const passport= require('passport');


// router.get('/fakeuser', async function(req, res){

//     const user1 = new User({
//         username: 'Harsh1',
//         email: 'harsh1@example.com'
//     });
//     const newUser= await User.register(user1, 'harsh112') //register function accepts user and password
// // encrypts password by sha  method and converts to hash and random salt is added and stores in db..(this all is dont by password-local-mongoose)
//     res.send(newUser);

// })



//1- Get the signup form
router.get('/register', (req, res) => {
    res.render('auth/signup');
});


//2- register the new user in the db
router.post('/register', async(req, res) => {
    
    try {
        const { username, email, password } = req.body;

        const user = new User({
            username: username,
            email: email
        });
    
        await User.register(user, password);
    
        req.flash('success', `Welcome ${username},Please login to continue!`);
        res.redirect('/products');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

});


// 3-get the login page
router.get('/login', function (req, res) {
    res.render('auth/login');
})



// 4-login the user
router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }),
    (req, res) => {
        
        const { username } = req.user;
        req.flash('success', `Welcome Come Back ${username} Again!!`);
        res.redirect('/products');
});



// 5-log out the user
router.get('/logout', (req, res) => {

    req.logout();

    req.flash('success','Logged Out Successfully')
    res.redirect('/login');
})


module.exports= router;


