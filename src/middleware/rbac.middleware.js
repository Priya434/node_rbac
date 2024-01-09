import User from "../models/user.model.js";


const checkRole = (role) => async (req, res, next) => {
    const { username } = req.body;

    const user = await User.findOne({ where: { username: username } })

    if (user.role !== role) {
        res.status(401).json("Sorry you do not have access to this route")
    }

    else {
        console.log(`accessed via role: ${role}`);
        next();
    }
};

export default checkRole