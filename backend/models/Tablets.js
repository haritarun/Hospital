const mongoose = require("mongoose");

const tabletSchema = new mongoose.Schema({
  tabletName: { type: String, required: true, unique: true },
  deskno: { type: Number, required: true },
  mfgDate: { type: Date, required: true },
  expDate: { type: Date, required: true },
  noOfSets: { type: Number, required: true },
});

const Tablet = mongoose.model("Tablet", tabletSchema);

module.exports = Tablet;
