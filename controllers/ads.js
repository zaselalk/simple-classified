const Ad = require("../models/ads");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const ads = await Ad.find({ status: "published" }).populate("popupText");
  res.render("ads/index", { ads });
};

module.exports.renderNewForm = (req, res) => {
  res.render("ads/new");
};

module.exports.createAd = async (req, res, next) => {
  const ad = new Ad(req.body.Ad);
  // Safely map uploaded files (guard if no files were uploaded)
  const files = Array.isArray(req.files) ? req.files : [];
  ad.images = files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  ad.author = req.user._id;
  if (!ad.status) {
    ad.status = "published";
  }
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
    $set: req.body.Ad,
  });
  const files = Array.isArray(req.files) ? req.files : [];
  const imgs = files.map((f) => ({ url: f.path, filename: f.filename }));
  if (!Array.isArray(ad.images)) ad.images = [];
  ad.images.push(...imgs);
  await ad.save();
  if (req.body.deleteImages) {
    // Attempt to delete each image from Cloudinary but don't fail the whole request if one fails
    for (const filename of req.body.deleteImages) {
      try {
        await cloudinary.uploader.destroy(filename);
      } catch (e) {
        console.error("Cloudinary deletion failed for", filename, e);
      }
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
