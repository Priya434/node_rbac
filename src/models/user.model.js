import { DataTypes } from "sequelize"
import { sequelize } from "../config/sequelizeDB.js"

const User = sequelize.define("users", {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    supervisorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
})

sequelize.sync().then(() => {
    console.log('User table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default User