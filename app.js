require('dotenv').config();
require('custom-env').env('staging');

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongoose = require('mongoose');
const mongoDBStore = require('connect-mongodb-session')(session);

const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000

const MONGO_USER = process.env.DB_USER;
const MONGO_PASS = process.env.DB_PASS;
const MONGODB_URL = "mongodb+srv://" + MONGO_USER + ":" + MONGO_PASS + "@cluster0.fic12.mongodb.net/chatapp"

const store = new mongoDBStore({
    uri: MONGODB_URL,
    collection: 'session'
});

const app = express()

const liveChat = require('./routes/liveChat')

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(liveChat)
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);


const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

mongoose.connect(MONGODB_URL)
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

const io = require('socket.io')(server)

io.on('connection', socket => {
    console.log('Client connected!')

    socket
        .on('disconnect', () => {
            console.log('A client disconnected!')
        })
        .on('newUser', (username, time) => {
            // A new user logs in.
            const message = `${username} has joined the channel, act natural!`
            socket.broadcast.emit('userJoin', {
                    /** CONTENT for the emit **/
                    message,
                    time,
                    from: 'admin',
                }) // <-----TODO-----
        })
        .on('message', data => {
            // Receive a new message
            console.log('Message received')
            socket.broadcast.emit('newMessage', {
                ...data,
            }); // <-----TODO----- Note, only emits to all OTHER clients, not sender.
        });
});