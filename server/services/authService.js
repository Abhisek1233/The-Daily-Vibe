import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from './emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const BASE_URL = process.env.BASE_URL || 'http://localhost:2000';

// 🔹 Register
export const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('User already exists.');

  const hashed = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || 'user',
    verificationToken: token,
    verificationExpire:Date.now() + 10 * 60 * 1000,
  });

  const link = `${BASE_URL}/auth/verify-email?token=${token}`;
  await sendEmail(email, 'Verify Your Email', `<p>Click here to verify: <a href="${link}">${link}</a></p>`);

  return user;
};

// 🔹 Verify Email
export const verifyEmail = async (token) => {
  const user = await User.findOne({ verificationToken: token });
  if (!user) throw new Error('Invalid or expired verification token.');

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
};

// 🔹 Login
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials.');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials.');

  if (!user.isVerified) throw new Error('Email not verified.');

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  return { user, token };
};

// 🔹 Get Me
export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw new Error('User not found.');
  return user;
};

// 🔹 Forgot Password
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found.');

  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  user.resetPasswordToken = hashed;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  const resetLink = `${BASE_URL}/reset-password?token=${token}&id=${user._id}`;
  await sendEmail(email, 'Reset Password', `<p>Reset your password: <a href="${resetLink}">${resetLink}</a></p>`);
  return token;
};

// 🔹 Reset Password
export const resetPassword = async (token, id, newPassword) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    _id: id,
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });


  if (!user) throw new Error('Token expired or invalid.');

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};
