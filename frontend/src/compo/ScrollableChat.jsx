import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogics";
import { Avatar, Tooltip } from "@mui/material";
import { ChatState } from "./context/chatProvider";

const ScrollableChat = ({ messages = [] }) => {
  const { user } = ChatState();
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", overflowY: "auto" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                title={m.sender.name}
                sx={{
                  gap: "10px",
                  padding: "4px 15px 4px 15px",
                  borderRadius: "3px",
                }}
              >
                <Avatar
                  sx={{
                    margin: 2,
                    cursor: "pointer",
                    width: 30, // Custom width for smaller size
                    height: 30, // Custom height for smaller size
                  }}
                  size="small"
                  alt={m.sender.name}
                  src={m.sender.pic}
                  onClick={toggleDrawer(true)}
                />
              </Tooltip>
            )}
            <span
              style={{
                color: "#FFFFFF",
                background: `${
                  m.sender._id === user._id ? "#008080" : "#9c27b0"
                }`,
                borderRadius: "20px",
                padding: "8px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
