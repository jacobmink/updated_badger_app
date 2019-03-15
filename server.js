// REQUIREMENTS
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI, collection: 'mySessions'
});

store.on('error', (err)=>{
    console.log(err);
})
require('./db/db');
require('dotenv').config();
// MIDDLEWARE

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(session({
    secret: "THIS IS A RANDOM STRING SECRET",
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public/react-badger/build')));
app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(methodOverride('_method'));

const usersController = require('./controllers/usersController');
const authsController = require('./controllers/authController');
const badgesController = require('./controllers/badgesController');

app.use('/users', usersController);
app.use('/auth', authsController);
app.use('/users/:id/badges', (req,res,next)=>{
    req.userId = req.params.id;
    next();
}, badgesController);

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname+'/public/react-badger/build/index.html'));
});



app.get('/', (req,res)=>{
    res.render('index.ejs', {
        message: req.session.message
    });
});


app.listen(process.env.PORT, ()=>{
    console.log('SERVER RUNNING...');
});