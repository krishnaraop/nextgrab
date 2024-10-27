
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js'; // Note the '.js' extension
import errorMiddleware from './middlewares/errorMiddleware.js';


const app = express();

// Middleware Setup
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
