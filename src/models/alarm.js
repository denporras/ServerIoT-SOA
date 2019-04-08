const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const AlarmSchema = new Schema({
    window: Number,
    state: Number,
    active: Boolean,
    hour: Number,
    minutes: Number,
    days: [Number]
});

module.exports = Mongoose.model('Alarm', AlarmSchema);
