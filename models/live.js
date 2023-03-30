const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    socketID: {
        type:String,
        required: true,
    }
  },
  { timestamps: true }
);

const Model = mongoose.model("Live", schema);

module.exports = Model;
