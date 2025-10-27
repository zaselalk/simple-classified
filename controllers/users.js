const User = require("../models/user");
const Ad = require("../models/ads");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Simple Classified!");
      res.redirect("/ads");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/ads";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// 
//modified logout function
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) { 
      return next(err); 
    }
    req.flash("success", "Goodbye!");
    res.redirect("/ads");
  });
};


module.exports.renderProfile = async (req, res) => {
  const draftAds = await Ad.find({ author: req.user._id, status: "draft" });
  const pendingAds = await Ad.find({ author: req.user._id, status: "pending" });
  const publishedAds = await Ad.find({ author: req.user._id, status: "published" });
  res.render("users/profile", { draftAds, pendingAds, publishedAds });
};

module.exports.renderChangePassword = (req, res) => {
  res.render("users/changePassword");
};

module.exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  
  if (newPassword !== confirmPassword) {
    req.flash("error", "New passwords do not match!");
    return res.redirect("/profile/change-password");
  }

  try {
    const user = await User.findById(req.user._id);
    await user.changePassword(currentPassword, newPassword);
    req.flash("success", "Password updated successfully!");
    res.redirect("/profile");
  } catch (e) {
    req.flash("error", "Failed to change password. Please check your current password.");
    res.redirect("/profile/change-password");
  }
};
