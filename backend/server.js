// package imports
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const connectDB = require('./db');
const passportLib = require('./passport')
const responseMiddleware = require("./middlewares/response");
const authRouter = require('./routes/auth')
const docRouter = require('./routes/doctorRoute');
const patientRouter = require('./routes/patientRoute');
const appointmentRouter = require('./routes/appointmentRoute')

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

app.use(express.json())


// routes
app.use(responseMiddleware);
app.use(passportLib.initialize());
app.get('/health',(req, res, next) => res.ok('Api is Running, no need to worry Bro'));
app.use('/api/auth', authRouter);
app.use('/api/doctor', docRouter);
app.use('/api/patient', patientRouter);
app.use('/api/appointment', appointmentRouter);


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('Server is Listening 🤖')
})
