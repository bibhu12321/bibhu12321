const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    members: {
        type:Array,
    },

}, {timestamps:true});

const Modal = mongoose.model("Conversation", schema);

module.exports = Modal;