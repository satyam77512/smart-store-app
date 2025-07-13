const bcrypt = require("bcrypt");
const user = require("../models/user.model")

const SALT_ROUNDS = 10;

const signup = async (req, res) => {

    try {
        const { name, username, email, password } = req.body;

        // Check for missing fields
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if username or email already exists
        const existingUser = await user.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already in use.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create new user
        const newUser = new user({
            name,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Return success
        return res.status(201).json({
            message: 'User created successfully',
            name:name,
            username:username,
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const host = req.headers.host;
    const fullHost = req.protocol + '://' + req.get('host');
    console.log(fullHost);

    try {
        const { Loginid, Password } = req.body;
        // Check if fields are provided
        if (!Loginid || !Password) {
            return res.status(400).json({ message: 'Login ID and password are required.' });
        }

        // Find user by username or email
        const existingUser = await user.findOne({username:Loginid});

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(Password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Login successful
        return res.status(200).json({
            message: 'Login successful',
            name: existingUser.name, // For frontend use
            username:Loginid,
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const userDetails = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: "Username is required." });
        }

        // Populate bills and each bill's items.product
        const foundUser = await user.findOne({ username })
            .populate({
                path: 'bills',
                populate: {
                    path: 'items.product',
                    model: 'product'
                }
            });

        if (!foundUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Prepare user details for response
        const userData = {
            name: foundUser.name,
            username: foundUser.username,
            email: foundUser.email,
            address: foundUser.address,
            phone: foundUser.Phone,
            profile: foundUser.profileimage,
            bills: foundUser.bills
        };

        return res.status(200).json({ user: userData });
    } catch (err) {
        console.error('userDetails error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { signup, login, userDetails };

// http://192.168.250.154:3000