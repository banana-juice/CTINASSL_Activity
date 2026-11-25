const router = require('express').Router();
const User = require('../model/userModel');

//Get all users
router.get('/', async (request, response) => {
    try {
        const users = await User.find();
        response.status(200).json(users);
    } catch (error) {
        response.status(500).json({
            message: error.message,
            error: error.message
        });
    }
});

// Create a new user
router.post('/create', async (request, response) => {
    try {
        const { email, name, password } = request.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(409).json({
                message: "User with this email already exists",
                success: false
            });
        }

        const newUser = new User({
            email: email,
            name: name,
            password: password
        });

        await newUser.save();
        response.status(201).json({
            message: "User created successfully",
            success: true,
            user: newUser
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to create user",
            error: error.message
        });
    }
});

router.put('/update/:id', async (request, response) => {
    try{
        const user = await User.findById(request.params.id);
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                success: false
            });
        }
        const {email, name, password} = request.body;
        user.email = email;
        user.name = name;
        user.password = password;
        await user.save();
        response.status(200).json({
            message: "User updated successfully",
            success: true,
            user: user
        });

    } catch (error) {
        response.status(500).json({
            message: "Unable to update user",
            error: error.message
        });
    }
});

router.delete('/:id', async (request, response) => {
    try {
        await User.findByIdAndDelete(request.params.id);
        response.status(200).json({
            message: "User deleted successfully",
            success: true
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to delete user",
            error: error.message
        });
    }
});

module.exports = router;