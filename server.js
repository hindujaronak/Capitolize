const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const user = require('./routes/api/user');
const fundraiser = require('./routes/api/fundraiser');

const transaction = require('./routes/api/transaction');
var cors = require('cors');

const app = express();

//BodyParser Middleware
app.use(bodyParser.json());
app.use(cors());
// app.use(express.static(./uploads, 'public'));
 
// DB config
const db = require('./config/keys.js').mongoURI;

mongoose.set('useCreateIndex', true);
// Connect to mongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected..'))
    .catch(err => console.log); 

    

app.use('/api/user', user);
app.use('/api/fundraiser', fundraiser);

app.use('/api/transaction', transaction);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

