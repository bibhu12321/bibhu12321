const ConversationModel = require("../models/Conversation");
const UserModel = require("../models/user");

exports.getUsers = async (req, res) => {
  try {
    UserModel.find({}).exec((err, users) => {
      if (err) {
        res.status(500).json(err);
      }
      res.status(200).json(users);
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getConversations = async (req, res) => {
  const { user_id } = req;

  try {
    ConversationModel.find({ members: { $in: [user_id] } }).exec(
      (err, result) => {
        if (err) {
          res.status(500).json(err);
        }
        res.status(200).json(result);
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.newConversion = async (req, res) => {
  const { user_id } = req;

  try {
    ConversationModel.findOne({
      members: { $all: [user_id, req.params.receiverId] },
    }).exec(async (err, conversation) => {
      if (err) res.status(200).json({ err });
      if (conversation) {
        return res.status(200).json(conversation);
      } else {
        const newConversation = new ConversationModel({
          members: [user_id, req.params.receiverId],
        });
        const savedConversation = await newConversation.save();
        return res.status(200).json(savedConversation);
      }
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.allConversation = async (req, res) => {
  try {
    const { user_id } = req;
    const conversation = await ConversationModel.findOne({
      members: { $all: [user_id, req.params.receiverId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

// if (!result) {
//     const newConversation = new ConversationModel({
//       members: [user_id, req.params.receiverId],
//     });
//     const savedConversation = await newConversation.save();
//     res.status(200).json(savedConversation);
//   }
