const jwt = require("jsonwebtoken");
const { buildException } = require("../utils/exceptions");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;

    if(authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                return res.status(403).send("Token is not valid");
            } 
            req.user = user;
            next();
        })
    } else {
        return res.status(403).send("Unauthorised");
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id == req.params.id || req.user.isAdmin) {
            next();
        } else {
            return req.status(403).send("You are not authorized to do that !")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next();
        } else {
            return res.status(403).send(buildException(403, "User Unauthorized"))
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }