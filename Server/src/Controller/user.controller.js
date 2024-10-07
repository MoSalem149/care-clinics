const httpstatus = require("./utilities/httpStatusText");
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userProfile=require('../models/userProfileModel')
require('dotenv').config();

const getAllUsers = async (req, res) => {
    try {
        const query = req.query;
        const limit = parseInt(query.limit) || 10; // Default limit
        const page = parseInt(query.page) || 1; // Default page
        const skip = (page - 1) * limit;

        const users = await User.find({}, { "__v": false }).limit(limit).skip(skip);

        if (!users || users.length === 0) {
            return res.status(404).json({ status: httpstatus.FAIL, message: "No users found" });
        }

        res.json({ status: httpstatus.SUCCESS, data: { users } });
    } catch (error) {
        res.status(500).json({ status: httpstatus.ERROR, message: error.message });
    }
};

const register = async (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!password) {
        return res.status(400).json({ status: 'error', message: 'Password is required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role
        });

        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            process.env.JWT_SECRET || '72bdbb5bf2a6e022b0e1253ffe02f20cd25674c0eb673ccc7b1a66c44cd187f4',
            { expiresIn: "5d" }
        );

        newUser.token = token;

        await newUser.save();

        await newProfile.save();

        res.status(201).json({
            status: 'success',
            data: {
                fullName: newUser.fullName,
                email: newUser.email,
                token: newUser.token,
            },
            message: 'Registration successful'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: httpstatus.FAIL, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: httpstatus.FAIL, message: 'User not found' });
        }

        const matchedPassword = await bcrypt.compare(password, user.password);
        if (matchedPassword) {
            const token = jwt.sign(
                { email: user.email, id: user._id },
                process.env.JWT_SECRET || '72bdbb5bf2a6e022b0e1253ffe02f20cd25674c0eb673ccc7b1a66c44cd187f4',
                { expiresIn: "5d" }
            );

            user.token = token;

            return res.json({
                status: httpstatus.SUCCESS,
                message: 'User logged in successfully',
                token,
            });
        } else {
            return res.status(401).json({ status: httpstatus.FAIL, message: 'Incorrect email or password' });
        }
    } catch (err) {
        return next({ status: httpstatus.ERROR, message: 'An error occurred' });
    }
};

module.exports = {
    getAllUsers,
    register,
    login
};
