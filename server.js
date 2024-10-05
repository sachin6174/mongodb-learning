const express = require('express');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // Updated import

const app = express();
const PORT = 3000;
const BATCH_SIZE = 10; // Batch size for inserts

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    address: String,
    phoneNumber: String,
    skills: [String],
    photo: String,   // Hardcoded path for the image
    website: String
});

const User = mongoose.model('User', userSchema);

// Function to generate random user data
const generateRandomUserData = () => {
    return {
        name: faker.person.fullName(), // Updated to use faker.person
        dob: faker.date.past(30, new Date()),
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
        phoneNumber: faker.phone.number(),
        skills: faker.helpers.arrayElements(
            [
                'JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'Swift', 'C++', 'Java', 'Express', 'Ruby'
            ],
            faker.number.int({ min: 2, max: 5 }) // Updated to use faker.number.int()
        ),
        photo: '/path/to/your/photo.jpg', // Hardcoded image path
        website: faker.internet.url()
    };
};

// API to insert 10,000 users into MongoDB in batches of 1,000
app.get('/insertUsers', async (req, res) => {
    let totalUsers = 100;

    for (let i = 0; i < totalUsers; i += BATCH_SIZE) {
        let users = [];
        for (let j = 0; j < BATCH_SIZE; j++) {
            users.push(generateRandomUserData());
        }

        try {
            await User.insertMany(users);
            console.log(`Inserted batch ${i + BATCH_SIZE} users`);
        } catch (error) {
            console.error('Batch insertion error:', error);
            return res.status(500).send('Error inserting users');
        }
    }

    res.send('10,00 users inserted successfully!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
