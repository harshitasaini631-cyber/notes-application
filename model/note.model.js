const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
    title: {type: String, default:""},
    description: {type: String, default:""},
    userID: {type: String,required: true},
    image: { type: String, default: "" }
});

const noteModel = mongoose.model("note", noteSchema);

module.exports = { noteModel };