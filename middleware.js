const { AdSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Ad = require("./models/ads");
const { UserSchema } = require("./schemas.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateAd = (req, res, next) => {
  // Validate only the expected shape; exclude meta fields like _csrf, _method
  const payloadToValidate = {
    Ad: req.body && req.body.Ad,
    deleteImages: req.body && req.body.deleteImages,
  };
  const { error } = AdSchema.validate(payloadToValidate);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const ad = await Ad.findById(id);
  if (!ad) {
    req.flash("error", "Cannot find that ad!");
    return res.redirect("/ads");
  }
  // Ensure author exists and matches
  if (!ad.author || !ad.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/ads/${id}`);
  }
  next();
};
