require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const md5 = require('md5');

// Initialize the application
const app = express();
app.use(bodyParser.json());

/// Connect to MySQL database using environment variables
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

// Define the Users model
const Users = sequelize.define('Users', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users'
});

// Define the UsersProfile model
const UsersProfile = sequelize.define('UsersProfile', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Users,
            key: 'id'
        }
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: false
    },
    mobile_no: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users_profiles'
});

// Sync models
sequelize.sync({ force: true }).then(async () => {
    console.log('Tables created!');

    // Dummy data
    const usersData = [
        { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: md5('password1') },
        { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', password: md5('password2') },
        { firstName: 'Bob', lastName: 'Brown', email: 'bob.brown@example.com', password: md5('password3') },
        { firstName: 'Alice', lastName: 'White', email: 'alice.white@example.com', password: md5('password4') },
        { firstName: 'Charlie', lastName: 'Black', email: 'charlie.black@example.com', password: md5('password5') }
    ];

    const userProfilesData = [
        { dob: '1990-01-01', mobile_no: '1234567890' },
        { dob: '1992-02-02', mobile_no: '2345678901' },
        { dob: '1994-03-03', mobile_no: '3456789012' },
        { dob: '1996-04-04', mobile_no: '4567890123' },
        { dob: '1998-05-05', mobile_no: '5678901234' }
    ];

    // Insert users and user profiles
    for (let i = 0; i < usersData.length; i++) {
        const user = await Users.create(usersData[i]);
        const userProfile = {
            ...userProfilesData[i],
            user_id: user.id
        };
        await UsersProfile.create(userProfile);
    }

    console.log('Dummy data inserted!');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
