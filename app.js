import express from 'express';
import snapdealRoutes from './routes/snapdeal.js'; // Import the Snapdeal routes

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Use Snapdeal routes under /fetch/snapdeal
app.use('/fetch/snapdeal', snapdealRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
