const express = require("express");
const router = express.Router();
const ads = require("../controllers/ads");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateAd } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(ads.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateAd,
    catchAsync(ads.createAd)
  );

router.get("/new", isLoggedIn, ads.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(ads.showAd))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateAd,
    catchAsync(ads.updateAd)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(ads.deleteAd));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(ads.renderEditForm));

module.exports = router;
