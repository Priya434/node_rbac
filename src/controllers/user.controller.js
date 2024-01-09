import Roles from "../config/roles.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"

const fetchInfo = async (req, res) => {

    const self = await User.findOne(
        {
            attributes: ['userId', 'username', 'role', 'supervisorId'],
            where: { username: req.user.username }
        })

    return res.json(self);
}

const fetchSubordinates = async (req, res) => {

    if (req.user.role === Roles.Salesperson) {
        return res.status(403).json("Unauthorized request")
    }

    // superadmin
    if (req.user.role === Roles.SuperAdmin) {
        // get all users
        const users = await User.findAll({
            attributes: ['userId', 'username', 'role', 'supervisorId']
        });
        return res.json(users);
    }

    // branchmanager
    else if (req.user.role === Roles.BranchManager) {
        // get branch manager
        const branchmanagerid = await User.findOne(
            {
                attributes: ['userId'],
                where: { username: req.user.username }
            })

        // get subordinates
        const subordinates = await User.findAll(
            {
                attributes: ['userId', 'username', 'role', 'supervisorId'],
                where: { supervisorId: branchmanagerid.userId }
            }
        );

        return res.json(subordinates);
    }
}

const createSubordinate = async (req, res) => {

    const role = req.body.role;

    if (req.user.role === Roles.Salesperson) {
        return res.status(403).json("Unauthorized request")
    }

    if (!(Object.values(Roles).indexOf(role) > -1)) {
        return res.status(400).json("Invalid role type")
    }

    // superadmin
    if (req.user.role === Roles.SuperAdmin) {
        if (role === Roles.SuperAdmin) {
            return res.status(403).json("Sorry you cannot create user with this role")
        }
    }

    // branchmanager
    else if (req.user.role === Roles.BranchManager) {
        if (role === Roles.SuperAdmin || role === Roles.BranchManager) {
            return res.status(403).json("Sorry you cannot create user with this role")
        }
    }

    // check if user exists
    const userExists = await User.findOne({ where: { username: req.body.username } })
    if (userExists) {
        return res.status(403).json({
            message: "User already exists",
            success: false,
        });
    }

    // create user
    const { username, password } = req.body
    const hashPass = await bcrypt.hash(password, 10);

    const supervisorId = await User.findOne(
        {
            attributes: ['userId'],
            where: { username: req.user.username }
        })

    console.log(supervisorId);
    console.log(supervisorId.userId);

    const newUser = await User.create({
        username: username,
        password: hashPass,
        role: role,
        supervisorId: supervisorId.userId
    })

    return res.json({
        userId: newUser.userId,
        username: newUser.username,
        role: newUser.role,
        supervisorId: newUser.supervisorId,
    })
}

const deleteSubordinate = async (req, res) => {

    if (req.user.role === Roles.Salesperson) {
        return res.status(403).json("Unauthorized request from ", req.user.role)
    }

    const userToDelete = await User.findOne(
        {
            where: { userId: req.params.userId }
        }
    )

    // superadmin
    if (userToDelete.role === Roles.SuperAdmin) {
        return res.status(403).json("Unauthorized request. Cannot delete superadmin")
    }

    // branchmanager
    if (req.user.role === Roles.BranchManager && userToDelete.role === Roles.BranchManager) {
        return res.status(403).json("Unauthorized request. BM cannot delete BM")
    }

    console.log(req.user);

    const branchmanagerid = await User.findOne(
        {
            attributes: ['userId'],
            where: { username: req.user.username }
        })


    if (req.user.role === Roles.BranchManager && branchmanagerid.userId !== userToDelete.supervisorId) {
        return res.status(403).json("Unauthorized request")
    }

    await userToDelete.destroy();

    return res.json({
        message: "User deleted successfully",
        success: true,
        user: {
            userId: userToDelete.userId,
            username: userToDelete.username,
            role: userToDelete.role,
            supervisorId: userToDelete.supervisorId,
        }
    })
}

export {
    fetchInfo,
    fetchSubordinates,
    createSubordinate,
    deleteSubordinate
}