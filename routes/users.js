const express = require("express");
const passport = require("passport");
const crypto = require("crypto");
const LocalStrategy = require("passport-local");
const router = express.Router();
const User = require("../models/User.js");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err);
      if (!user)
        return done(null, false, {
          message: "Неверное имя пользователя или пароль",
        });

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        (err, hashedPassword) => {
          if (err) return done(err);
          if (!crypto.timingSafeEqual(user.hashedPassword, hashedPassword)) {
            return done(null, false, { message: "Неверный пароль" });
          }
          return done(null, user);
        }
      );
    });
  })
);

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, { id: user.id, email: user.email });
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

router.get("/register", (req, res) =>
  res.render("user-register", { title: "Регистрация" })
);

router.get("/login", (req, res) => res.render("user-login", { title: "Вход" }));

router.post("/register", async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    req.session.messages.push("Пользователь с таким email уже зарегистррован");
    return res.redirect("/users/register");
  }

  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
    if (err) return next(err);

    const user = new User({ firstname, lastname, email, hashedPassword, salt });
    user
      .save()
      .then((user) => {
        req.login(user, (err) => {
          if (err) return next(err);
          res.redirect("/");
        });
      })
      .catch((err) => console.log(err));
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureMessage: true,
  })
);

router.post("/logout", (req, res) => {
  req.logout(() => console.log("logout"));
  res.redirect("/");
});

module.exports = router;
