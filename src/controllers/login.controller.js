import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import bcrypt from "bcrypt"

const userLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json("Please provide username and password");
    }

    const userExists = await User.findOne({ where: { username: username } })
    if (!userExists) {
        return res.status(404).json({
            message: "username is not found. Invalid login credentials.",
            success: false,
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userExists.password);

    if (!isPasswordCorrect) {
        return res.status(403).json({
            message: "Incorrect password.",
        });
    }

    const token = jwt.sign({
        id: userExists.userid,
        username: userExists.username,
        role: userExists.role,
    },
        process.env.JWT_SECRET,
        { expiresIn: '3 days' }
    );

    const result = {
        token: `Bearer ${token}`,
        expiresIn: 3 * 24 * 60 * 60 * 1000,
        user: {
            id: userExists.userid,
            username: userExists.username,
            role: userExists.role,
        }
    }

    res.cookie('authcookie', token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true
    })

    return res.status(200).json({
        message: "Login successful.",
        success: true,
        result: result,
    });
}

export default userLogin