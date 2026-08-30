import React from "react";
import { ChatState } from "../context/chatProvider";
import { Box } from "@mui/material";
import SingleChat from "../SingleChat";

const Inbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "flex" : "none", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        margin: "12px",
        padding: 3,
        backgroundColor: "white",
        width: { xs: "100%", md: "68%" },
        height: "calc(100% - 24px)",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
        overflowY: "auto",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Inbox;
