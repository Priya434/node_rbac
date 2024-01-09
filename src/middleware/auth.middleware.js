import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {

    const token = req.cookies.authcookie

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log("verifying");
        if (err) return res.sendStatus(403); //invalid token

        console.log(decoded); //for correct token
        next();
    });
};

export default userAuth