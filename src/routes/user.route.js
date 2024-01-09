import express from "express";
import { createSubordinate, deleteSubordinate, fetchInfo, fetchSubordinates } from "../controllers/user.controller.js";
import checkRole from "../middleware/rbac.middleware.js";
import Roles from "../config/roles.js";

const router = express.Router();

router.get('/self', fetchInfo);
router.get('/list', checkRole([Roles.SuperAdmin, Roles.BranchManager]), fetchSubordinates);
router.post('/create', checkRole([Roles.SuperAdmin, Roles.BranchManager]), createSubordinate);
router.delete('/delete/:userId', checkRole([Roles.SuperAdmin, Roles.BranchManager]), deleteSubordinate);

export default router