import express from "express";
import userLogout from "../controllers/logout.controller.js";

const router = express.Router();

router.post('/', userLogout);

export default router