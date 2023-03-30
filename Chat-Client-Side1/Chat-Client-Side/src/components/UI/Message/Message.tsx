import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import classes from "./Message.module.scss";
import { IMessage } from "../../Main/Main";

TimeAgo.addDefaultLocale(en);

interface IProps {
  chat: IMessage;
  type: boolean;
}

const Message: React.FC<IProps> = ({ chat, type }) => {
  const timeAgo = new TimeAgo("en-US");
  return (
    <div
      className={`${classes.container} ${
        type ? classes.align_right : classes.align_left
      }`}
    >
      <div className={classes.chatArea}>
        <div
          className={`${classes.chatBox} ${
            type ? classes.chat_box_response : ""
          }`}
        >
          <span>{chat.text}</span>
        </div>
        <div
          className={`${classes.user_details} ${
            type ? classes.align_right : classes.align_left
          }`}
        >
          <span className={classes.name}>{chat.senderName}</span>
          <span className={classes.time}>{timeAgo.format(new Date(chat.createdAt))}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
