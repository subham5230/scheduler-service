const jwt = require("jsonwebtoken");
const admin = require("../firebase/index");

exports.authCheck = (req, res, next) => {
    const token = req.headers["authorization"];
  
    jwt.verify(token, process.env.JWT_KEY, function (err, data) {
      if (err) {
        res.status(401).send({ error: "Not Authorized" });
        // res.status(401).send({ auth: false })
      } else {
        req.user = data;
        next();
      }
    });
  };

  exports.firebaseAuthCheck = async (req, res, next) => {
    // console.log(req.headers.authtoken); // token
    try {
      const firebaseUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken);
      // console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
      req.user = firebaseUser;
      next();
    } catch (err) {
      // console.log(err);
      res.status(401).json({
        err: "Invalid or expired token",
      });
    }
  };
