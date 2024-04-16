const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret_Key = process.env.SECRET_KEY;
const verifyToken = (ctx, next) => {
  try {
    const token = ctx.headers.authorization.split[1] || ctx.headers.token;
    if (!token) {
      throw Error("Token is not found");
    }
    const decode = jwt.verify(token, secret_Key);
    const currentTime = Date.now() / 1000;
    if (decode.exp && currentTime > decode.exp) {
      (ctx.status = 404), (ctx.body = "Token has been expired!");
    }
    ctx.state.user = decode;
  } catch (error) {
    ctx.throw = "Authentication failed";
    console.log(error);
  }
  return next();
};

module.exports = verifyToken;
