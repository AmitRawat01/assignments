import dotenv from 'dotenv';
dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const sendGridApiKey = process.env.SENDGRID_API_KEY;
