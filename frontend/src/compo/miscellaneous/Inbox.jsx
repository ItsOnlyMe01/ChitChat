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
        height: "calc(100vh - 16px)",
        borderRadius: "1rem",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "grey.300",
        overflowY: "auto",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Inbox;
