import express from 'express';
import { bookmarkArticle, getBookmarks, getUserProfile, loginUser, registerUser, removeBookmark, updateUserProfile } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/bookmarks", protect, bookmarkArticle);
router.delete("/bookmarks", protect, removeBookmark);
router.get("/bookmarks", protect, getBookmarks);
