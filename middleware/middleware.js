const jwt = require("jsonwebtoken")
const SECRET_KEY = "SECRET_KEY"

const auth = (req, res, next) => {
    try {
        let token = req.headers["authorization"]

        if (token) {
            token = token.split(" ")[1]

            let user = jwt.verify(token, SECRET_KEY)

            req.user = user
        } else {
            return res.send({
                success: false,
                status: 401
            })
        }
    } catch (error) {
        return res.send({
            success: false,
            status: 401,
            message: "unauthorized user"
        })
    }
    next()
}

module.exports = { auth }