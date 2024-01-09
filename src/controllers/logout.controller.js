const userLogout = async (req, res) => {
    res.cookie('authcookie', {
        httpOnly: true,
        expires: new Date(0)
    })

    return res.json("Logged out successfully.")
}

export default userLogout