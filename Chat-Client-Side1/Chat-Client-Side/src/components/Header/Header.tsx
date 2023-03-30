import React from "react";
import classes from "./Header.module.scss";
import { Layout } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
type IProps = {
  socket:any,
}

const HeaderComponent:React.FC<IProps> = ({socket}) => {
  const navigate = useNavigate();
  const chatUser = sessionStorage.getItem("chat_user");
  const Logout = () => {
    sessionStorage.clear();
    // socket.disconnect();
    // socket.emit("getUsers");
    navigate("/login")
  };

  return (
    <Header
      className={classes.site_layout_background}
      style={{ padding: 0, display: "flex", justifyContent: "space-between", backgroundColor:"#fff" }}
    >
      <span className={classes.username}>{chatUser}</span>
      <span className={classes.logout} onClick={Logout}>
        Logout
      </span>
    </Header>
  );
};

export default HeaderComponent;
