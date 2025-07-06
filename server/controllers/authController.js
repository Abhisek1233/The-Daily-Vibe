import {
  registerUser,
  verifyEmail,
  loginUser,
  getUserById,
  forgotPassword,
  resetPassword,
} from '../services/authService.js';

// Register
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: 'Registered. Check your email.',
      userId: user._id,
      verificationToken:user.verificationToken,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Verify Email
export const verify = async (req, res) => {
  try {
    // await verifyEmail(req.query.token);
    await verifyEmail(req.body.token);
    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
};

// Get Me
export const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Forgot Password
export const forgot = async (req, res) => {
  try {
   const verificationToken = await forgotPassword(req.body.email);
    res.status(200).json({
      message: 'Reset email sent.',
      verificationToken,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Reset Password
export const reset = async (req, res) => {
  try {
    // await resetPassword(req.query.token, req.query.id, req.body.password);
    await resetPassword(req.body.token, req.body.id, req.body.password);
    res.status(200).json({
      message: 'Password reset successfully.'
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
