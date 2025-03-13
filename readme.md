# My App

A sample app using JWT and Passport.js for authentication.

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables in a `.env` file
4. Start the server: `npm start`

## API Endpoints

- **POST /auth/login**: Login user
- **POST /auth/register**: Register user
- **POST /auth/forgot-password**: Generate password reset token
- **PUT /auth/verify-reset-password/:token**: Verify password reset token and reset password
- **DELETE /user/address**: Delete user addresses
- **PUT /user/profile-image**: Upload user profile image
