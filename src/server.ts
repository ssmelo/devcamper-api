import express  from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import errorHandler  from './middleware/error';
import { connectDB } from '../config/db';

// Load env vars
dotenv.config({ path: './config/config.env' });

// Route files
import bootcamps from './routes/bootcamps';
import courses from './routes/courses';

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if(process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    () => console.log(colors.yellow.bold(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any, promise) => {
    console.log(colors.red(`Erro: ${err.message}`));
    // Close server & exit process
    server.close(() => process.exit(1));
});