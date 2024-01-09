import express from "express"
import { connectDB } from "./config/sequelizeDB.js"
import User from "./models/user.model.js"
import bcrypt from "bcrypt"
import Roles from "./config/roles.js"
import loginRoute from "./routes/login.route.js"
import userRoute from "./routes/user.route.js"
import userAuth from "./middleware/auth.middleware.js"
import cookieParser from "cookie-parser"

const PORT = 3000

const app = express();

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/login', loginRoute)
app.use('/user', userAuth, userRoute)

app.post('/createsuperadmin', async (req, res) => {
    const { username, password } = req.body
    const hashPass = await bcrypt.hash(password, 10);

    const superAdmin = await User.create({
        username: username,
        password: hashPass,
        role: Roles.SuperAdmin,
    })

    res.json({
        message: superAdmin.toJSON()
    })

    console.log(superAdmin.toJSON())
})


