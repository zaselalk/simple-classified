const Ad = require("../models/ads");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const ads = await Ad.find({}).populate("popupText");
  res.render("ads/index", { ads });
};

module.exports.renderNewForm = (req, res) => {
  res.render("ads/new");
};

module.exports.createAd = async (req, res, next) => {
  const ad = new Ad(req.body.Ad);
  ad.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  ad.author = req.user._id;
  await ad.save();
  req.flash("success", "Successfully made a new ad!");
  res.redirect(`/ads/${ad._id}`);
};

// module.exports.createAd = async (req, res, next) => {
//   req.flash(
//     "error",
//     "Posting New Ad disabled on demo version. contact infoaselalk@gmail.com for your own installation."
//   );
//   res.redirect(`/ads`);
// };

module.exports.showAd = async (req, res) => {
  const ad = await Ad.findById(req.params.id).populate("author");
  if (!ad) {
    req.flash("error", "Cannot find that ad!");
    return res.redirect("/ads");
  }
  res.render("ads/show", { ad });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const ad = await Ad.findById(id);
  if (!ad) {
    req.flash("error", "Cannot find that Ad!");
    return res.redirect("/ads");
  }
  res.render("ads/edit", { ad });
};

module.exports.updateAd = async (req, res) => {
  const { id } = req.params;
  const ad = await Ad.findByIdAndUpdate(id, {
    ...req.body.Ad,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  ad.images.push(...imgs);
  await ad.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await ad.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated Ad!");
  res.redirect(`/ads/${ad._id}`);
};

module.exports.deleteAd = async (req, res) => {
  const { id } = req.params;
  await Ad.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted Ad");
  res.redirect("/ads");
};
