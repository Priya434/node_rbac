import User from "../models/user.model.js";


const checkRole = (roles) => async (req, res, next) => {
    const { username } = req.user;

    const user = await User.findOne({ where: { username: username } })

    if (!roles.includes(user.role)) {
        res.status(401).json("Sorry you do not have access to this route")
    }

    else {
        console.log(`accessed via role: ${user.role}`);
        next();
    }
};

export default checkRole