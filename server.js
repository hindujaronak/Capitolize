const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const user = require('./routes/api/user');
const app = express();

//BodyParser Middleware
app.use(bodyParser.json());
 
// DB config
const db = require('./config/keys.js').mongoURI;

// Connect to mongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected..'))
    .catch(err => console.log); 

app.use('/api/user', user);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

