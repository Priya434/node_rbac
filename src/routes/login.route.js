import express from "express";
import userLogin from "../controllers/login.controller.js";

const router = express.Router();

router.post('/', userLogin);

export default router