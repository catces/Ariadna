import express, { Application } from 'express';
import router from './routes/auth';
// import { router } from './routes'
// const routes = require('./routes/auth')
const cors = require('cors')
const morgan = require('morgan')
const app: Application = express();

app.use(express.json());
app.use(morgan('dev'))
app.use(
    cors({
        origin: "*",
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'authorization'],
    }),
);

app.use('/', router);

export default app;