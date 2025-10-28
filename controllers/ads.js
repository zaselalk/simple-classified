const Ad = require("../models/ads");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let query = { status: "published" };

  if (category && category !== "all") {
    query.category = category;
  }

  const ads = await Ad.find(query).populate("author");
  res.render("ads/index", { ads, selectedCategory: category || "all" });
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

  try {
    // Find the ad first
    const ad = await Ad.findById(id);
    if (!ad) {
      req.flash("error", "Cannot find that Ad!");
      return res.redirect("/ads");
    }

    // Update the ad with new data
    Object.assign(ad, req.body.Ad);

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imgs = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));
      ad.images.push(...imgs);
    }

    // Handle image deletions
    if (req.body.deleteImages) {
      for (const filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      ad.images = ad.images.filter(
        (img) => !req.body.deleteImages.includes(img.filename)
      );
    }

    // Save the updated ad
    await ad.save();

    req.flash("success", "Successfully updated Ad!");
    res.redirect(`/ads/${id}`);
  } catch (error) {
    console.error("Error updating ad:", error);
    req.flash("error", "Error updating ad. Please try again.");
    res.redirect(`/ads/${id}/edit`);
  }
};

module.exports.deleteAd = async (req, res) => {
  const { id } = req.params;
  await Ad.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted Ad");
  res.redirect("/ads");
};
