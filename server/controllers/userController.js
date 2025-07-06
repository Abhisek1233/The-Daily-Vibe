import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (userId, role) => {
    return jwt.sign({userId, role}, process.env.JWT_SECERET,{
        expiresIn: '7d',
    });
};

export const registerUser = async (req, res) => {
    try {
        const {name, email, password, preferences} = req.body;

        const handelPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: handelPassword,
            preferences,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
           _id: user._id,
           name: user.name,
           email: user.email,
           role: user.role,
           token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.log("Error logging in user:", error);
        res.status(500).json({
            success: false,
            message: 'User not found',
            error: error.message
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if(!user) return res.status(404).json({
            success: false,
            message: 'User not found',
        });

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
            error: error.message
        });
    }
}

export const updateUserProfile = async (req, res) => {
    try{
        const {name, preferences} = req.body;

        const user = await User.findById(req.user.userId);
        if(!user) return res.status(404).json({
            success: false,
            message: 'User not found',
        });

        user.name = name || user.name;
        user.preferences = preferences || user.preferences;

        const updatedUser = await user.save();

        res.json({
            success: true,
            message: 'User profile updated successfully',
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user profile',
            error: error.message
        });
    }
    
};

export const bookmarkArticle = async (req, res) => {
    try{

        const {articledId} = req.body;

        const user = await User.findById(req.user.userId);
        if(!user) return res.status(404).json({
            success: false,
            message: 'User not found',
        });

        if(user.bookmarks.includes(articledId))
            return res.status(400).json({
                success: false,
                message: 'Article already bookmarked',
            });

        user.bookmarks.push(articledId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Article bookmarked successfully',
            bookmarks: user.bookmarks,
        });
    } catch (error) {
        console.error('Error bookmarking article:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to bookmark article',
            error: error.message
        });
    }
};

export const removeBookmark = async (req, res) => {
    try {
        const  {articledId} = req.body;

        const user = await User.findById(req.user.userId);
        if(!user) return res.status(404).json({
            success: false,
            message: 'User not found',
        });

       user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== articledId
       );
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Bookmark removed successfully',
            bookmarks: user.bookmarks,
        });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove bookmark',
            error: error.message
        });
    }
}

export const getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('bookmarks');
        if(!user) return res.status(404).json({
            success: false,
            message: 'User not found',
        });
        res.status(200).json({
            success: true,
            bookmarks: user.bookmarks,
        });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookmarks',
            error: error.message
        });
    }
};

