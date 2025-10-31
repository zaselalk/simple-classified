// MongoDB initialization script
// This script creates a user for the application database

db = db.getSiblingDB("classified");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME || "admin",
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD || "supersecretmongo",
  roles: [
    {
      role: "readWrite",
      db: "classified",
    },
  ],
});
