// package imports
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const connectDB = require('./db');


const app = express();
connectDB();

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }))

app.use(cors({
    origin : (process.env.ALLOWED_ORIGINS || '').split(',').map(str => str.trim()).filter(Boolean) || '*',
    credentials : true
}))

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('Server is Listening 🤖')
})
