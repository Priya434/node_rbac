import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const userAuth = async (req, res, next) => {

    const token = req.cookies.authcookie

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {

        console.log("verifying");

        if (err) return res.sendStatus(403); //invalid token

        const user = await User.findOne({ where: { username: decoded.username } });

        req.user = {
            username: user.username,
            role: user.role,
            supervisorId: user.supervisorId
        }

        console.log("decoded ", decoded); //for correct token
        next();
    });
};

export default userAuth