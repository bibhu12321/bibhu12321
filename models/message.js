const mongoose = require('mongoose');

const schema = mongoose.Schema({
    conversationId: {
        type:String,
    },
    senderID:{
        type:String,
    },
    senderName:String,
    text: {
        type: String,
    },
    
}, {timestamps: true});

const Modal = mongoose.model("Message", schema);

module.exports =Modal;

