//allow us to use proccess.env to destructure the values from our .env file
require('dotenv').config()

//import necessary packages
const express = require('express'),
    session = require('express-session'),
    massive = require('massive'),
    app = express(),
    PORT = 4000,
    {CONNECTION_STRING, SESSION_SECRET}=process.env,
    authCtrl = require('./controllers/authController'),
    treasureCtrl = require('./controllers/treasureController'),
    auth = require('./middleware/authMiddleware');

//connect the server to the database and set db to our database
massive({
    connectionString: CONNECTION_STRING,
    ssl:{
        rejectUnauthorized: false
    }
}).then(dbInstance=>{
    app.set('db',dbInstance)
})

//Top level middleware before endpoints and using app.use

//create session and send back cookie to browser
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

//json parser
app.use(express.json());





//endpoints
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user',auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user',auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all',auth.usersOnly,auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(PORT, ()=>console.log(`app listening on port ${PORT}`));