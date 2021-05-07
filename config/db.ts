import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(colors.cyan.bold(`MongoDB Connected: ${conn.connection.host}`));
}

export { connectDB }