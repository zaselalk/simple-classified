const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.AdSchema = Joi.object({
  Ad: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    status: Joi.string().valid("draft", "pending", "published"),
    category: Joi.string()
      .valid(
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
        "Other"
      )
      .required(),
  }).required(),
  deleteImages: Joi.array(),
});
