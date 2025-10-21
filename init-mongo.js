// MongoDB initialization script
// This script creates a user for the application database

db = db.getSiblingDB("classified");

db.createUser({
  user: "classifieduser",
  pwd: "userpassword123",
  roles: [
    {
      role: "readWrite",
      db: "classified",
    },
  ],
});
