const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
}

const signUp = async (req, res) =>{
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const isUserExists = await User.findOne({ email });
    if(isUserExists){
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
        message: "user created successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({
            message: "No such user exists"
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({
            message: "Incorrect Email or Password"
        })
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
        message: `Welcome back, ${user.name}`,
        user: {
            id: user._id, 
            name: user.name,
            email: user.email
        }
    })
}

const signOut = async (req, res) => {
    if(!req.cookies.token){
        return res.status(400).json({ message: 'No user is currently signed in' });
    }

    res.clearCookie('token', cookieOptions);
    return res.status(200).json({ message: 'You have been signed out successfully' });
}

const getloggedInUser = async (req, res) => {
    
    if(!req.user) return;

    const user = await User.findById(req.user.id).select('-password -__v');

    return res.status(200).json({
        message: "User fetched successfully",
        user
    })
}

module.exports = { signUp, signIn, signOut, getloggedInUser };