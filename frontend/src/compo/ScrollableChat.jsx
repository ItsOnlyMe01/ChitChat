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
                color: `${m.sender._id === user._id ? "#FFFFFF" : "#2D3748"}`,
                background: `${
                  m.sender._id === user._id ? "#3182CE" : "#EDF2F7"
                }`,
                borderRadius: "16px",
                padding: "8px 16px",
                maxWidth: "75%",
                fontSize: "15px",
                fontFamily: "Work sans, sans-serif",
                lineHeight: "1.4",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
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
