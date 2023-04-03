import { Avatar } from "@material-ui/core";
import React from "react";
import { useAuthStore } from '../store/store';
import "../styles/InquireBox.css";

function InquireBox() {
  const { username } = useAuthStore(state => state.auth);
  return (
    <div className="inquireBox">
      <div className="inquireBox">
        <Avatar src={username?.photo} />
      </div>
      <div className="inquireBox__quora">
        <h5>What is your question or link?</h5>
      </div>
    </div>
  );
}

export default InquireBox;