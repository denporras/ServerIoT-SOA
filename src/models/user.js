const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const StudentSchema = new Schema({
  name: String,
  username: String,
  password: String
});

module.exports = Mongoose.model("User", StudentSchema);
