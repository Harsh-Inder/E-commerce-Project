
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express= require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const seedDB= require('./seed');
const methodOverride = require('method-override');

const session = require('express-session')
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');




mongoose.connect(process.env.MONGO_URL)
.then(() => {console.log('DB Connection established')})
.catch(err => {console.log(err)})

// seedDB();



const sessionConfig = {
    secret: 'weneedsomebettersecret',
    resave: false,
    saveUninitialized: true,
}


app.use(session(sessionConfig));
app.use(flash());



// v3
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







app.use((req, res, next) => {

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser= req.user;
    next();
})



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended:false}));

const productRoutes = require('./routes/ProductRoutes')
const authRoutes = require('./routes/AuthRoutes');
const cartRoutes = require('./routes/CartRoutes')

app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);


app.get('/', (req, res) => {
    res.send("Home Page ")
})


app.get('/error', (req, res) => {

    res.render('error');
})



app.listen(process.env.PORT || 2323, function(){
    console.log('listening on port 2323');
})