import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../../../.env" });

const { JWTKEY } = process.env;

export const verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  jwt.verify(token, JWTKEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res
        .status(403)
        .json({ message: "Failed to authenticate token!!!!" });
    }
    req.userId = decoded.userid;
    next();
  });
};
