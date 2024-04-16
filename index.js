const dotenv = require("dotenv");
const koa = require("koa");
const Router = require("koa-router");
const verifyToken = require("./verifyToken");
const jwt = require("jsonwebtoken");

dotenv.config();
const secret_Key = process.env.SECRET_KEY;

const app = new koa();

dotenv.config();

const router = new Router();

const port = process.env.PORT || 3002;

router.post("/login", async (ctx) => {
  const user = {
    userId: ctx.request.userId,
    aud: ctx.request.aud,
  };

  if (!user.aud && !user.userId) {
    ctx.status = 404;
    ctx.body = { message: "Aud & userId is not valid" };
  } else if (!user.aud) {
    ctx.status = 404;
    ctx.body = { message: "Aud  is not valid" };
  } else if (!user.userId) {
    ctx.status = 404;
    ctx.body = { message: "userId  is not valid" };
  }

  const token = jwt.sign({ userId: user.userId, aud: user.aud }, secret_Key, {
    expiresIn: 60 * 60,
  });
  ctx.body = { token: token };
});

router.get("/user", verifyToken, async (ctx, next) => {
  ctx.body = "You are authorised! ";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
