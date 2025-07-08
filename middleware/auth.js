
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
     const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "Access denied" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //req.user.id can acess from this
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Invalid token" });
    }
}
