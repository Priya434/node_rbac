import express from "express"
import { connectDB } from "./config/sequelizeDB.js"
import User from "./models/user.model.js"
import bcrypt from "bcrypt"
import Roles from "./config/roles.js"
import loginRoute from "./routes/login.route.js"
import userAuth from "./middleware/auth.middleware.js"
import checkRole from "./middleware/rbac.middleware.js"
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

app.get('/user', userAuth, checkRole(Roles.SuperAdmin), async (req, res) => {
    return res.json(`welcome ${req.body.username}`);
})

app.get('/create', async (req, res) => {
    const password = await bcrypt.hash("superadmin", 10);

    const superAdmin = await User.create({
        username: "superadmin",
        password: password,
        role: Roles.SuperAdmin,
    })

    res.json({
        message: superAdmin.toJSON()
    })

    console.log(superAdmin.toJSON())
})

app.get('/delete', async (req, res) => {
    await User.destroy({
        where: {
            username: "sam"
        }
    })
    res.send('deleted')
})


