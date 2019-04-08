const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const WindowSchema = new Schema({
	window: Number,
	state: Number
});

module.exports = Mongoose.model('Window', WindowSchema);
