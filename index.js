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
    ctx.status = 401;
    ctx.body = { error: "Aud & userId is not valid" };
  } else if (!user.aud) {
    ctx.status = 401;
    ctx.body = { error: "Aud  is not valid" };
  } else if (!user.userId) {
    ctx.status = 401;
    ctx.body = { error: "userId  is not valid" };
  }

  const token = jwt.sign({ userId: user.userId, aud: user.aud }, secret_Key, {
    expiresIn: 60 * 60,
  });
  ctx.body = { token: token };
});

router.get("/user", verifyToken, async (ctx) => {
  ctx.body = "User is Authorized";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
