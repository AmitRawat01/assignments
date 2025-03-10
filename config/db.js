import express from 'express';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());

connectDB();

app.use('/user', userRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
