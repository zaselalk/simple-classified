const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const AdsSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    category: {
      type: String,
      enum: [
        "Electronics",
        "Vehicles",
        "Real Estate",
        "Furniture",
        "Clothing",
        "Books",
        "Sports & Recreation",
        "Home & Garden",
        "Services",
        "Jobs",
        "Other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published"],
      default: "published",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { ...opts, timestamps: true }
);

module.exports = mongoose.model("Ads", AdsSchema);
