// auth.js/middlewares
const jwt = require("jsonwebtoken");
const { verifyToken, getUser, setUser, userTokenMap } = require("../service/auth");

function refreshTokenMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const decoded = verifyToken(token);

    if (decoded) {
      const user = getUser(token);

      if (user) {
        const expirationTime = userTokenMap.get(token);
        const currentTimeUTC = Math.floor(Date.now() / 1000);
        const refreshThreshold = 300;

        if (expirationTime - currentTimeUTC < refreshThreshold) {
          console.log("Token needs refreshing");
       
          const newToken = jwt.sign(
             { user_id: user._id, email: user.email, role: user.role },
             process.env.TOKEN_KEY,
             { expiresIn: "2h" }
          );
       
          userTokenMap.delete(token);
          setUser(newToken, user);
          const newExpirationTime = jwt.decode(newToken).exp;
          setUser(newToken, user, newExpirationTime);
          
          res.set('Authorization', `Bearer ${newToken}`);
          console.log("Token refreshed");
       }
       
      }
    }
  }

  next();
}

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided." });
  }

  const expirationTime = userTokenMap.get(token);

  if (!expirationTime || expirationTime < currentTimeUTC) {
    userTokenMap.delete(token);  // Clear the expired token
    return res.status(401).json({ error: "Unauthorized - Token expired or invalid." });
 }
  next();
}

module.exports = {
  refreshTokenMiddleware,
  authenticateToken,
};
