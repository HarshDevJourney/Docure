// package imports
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const connectDB = require('./db');
const responseMiddleware = require("./middlewares/response");
const authRouter = require('./routes/auth')

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

app.use(responseMiddleware);

app.get('/health',(req, res, next) => {
    res.status(200).json({
        status : 'ok'
    })
})


app.use('/api/auth', authRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('Server is Listening 🤖')
})
