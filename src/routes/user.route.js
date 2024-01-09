import express from "express";
import userLogin from "../controllers/login.controller.js";

const router = express.Router();

router.post('/', userLogin);

router.get('/self');
router.get('/list');
router.post('/create');
router.delete('/delete/:userId');

export default router