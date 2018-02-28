const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;

module.exports.register = async (req, res, next) => {
  const user = new User();

  user.name = req.body.name;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  try {
    await user.save();
    const token = user.generateJwt();
    res.json({
      userInfo: user,
      token: token
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.login = function(req, res) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      res.status(404).json(err);
      return;
    }

    if (user) {
      const token = user.generateJwt();
      res.status(200);
      res.json({
        userInfo: user,
        token: token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports.fbAuth = passport.authenticate("facebook");

module.exports.fbAuthCB = function(req, res, next) {
  passport.authenticate("facebook", (err, user, info) =>
    generateTokenAndRedirect(err, user, info, req, res, next)
  )(req, res);
};

module.exports.goAuth = passport.authenticate("google", {
  scope: ["profile", "email"]
});

module.exports.goAuthCB = function(req, res, next) {
  passport.authenticate("google", (err, user, info) =>
    generateTokenAndRedirect(err, user, info, req, res, next)
  )(req, res);
};

function generateTokenAndRedirect(err, user, info, req, res, next) {
  if (err) {
    return next(err);
  }
  if (user) {
    const token = user.generateJwt();
    res.cookie("auth", token);
    return res.redirect(`http://localhost:3000/socialauthredirect`);
  } else {
    return res.redirect("http://localhost:3000");
  }
}
