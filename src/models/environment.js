const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const EnvironmentSchema = new Schema({
	humidity: Number,
	temperature: Number,
	date: Date
});

module.exports = Mongoose.model('Environment', EnvironmentSchema);
