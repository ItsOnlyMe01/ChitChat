import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { useSnackbar } from "../context/SnackBar";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/chatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChat = ({ fetchAgain }) => {
  const showSnackbar = useSnackbar();

  const [loggedUser, setLoggedUser] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await fetch("/api/chat", {
        method: "GET",
        headers: config.headers,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch Chats. Please try again.");
      }
      const data = await response.json();
      setChats(data);
    } catch (error) {
      showSnackbar("Failed to Load the Chats", "error");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "none" : "flex", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        margin: "12px",
        padding: 3,
        backgroundColor: "white",
        width: { xs: "100%", md: "31%" },
        height: "calc(100% - 24px)",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
      }}
    >
      <Box
        sx={{
          paddingBottom: 2,
          px: 1,
          fontSize: { xs: "24px", md: "26px" },
          fontFamily: "Work sans",
          fontWeight: "600",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          color: "text.primary",
        }}
      >
        My Chats
        <Button
          onClick={handleOpenModal}
          variant="contained"
          sx={{
            display: "flex",
            fontSize: { xs: "12px", md: "10px", lg: "13px" },
            backgroundColor: "#3182CE",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            padding: "6px 12px",
            fontWeight: "medium",
            "&:hover": { backgroundColor: "#2B6CB0" },
          }}
          endIcon={<AddIcon />}
        >
          New Group
        </Button>
        <GroupChatModal open={openModal} onClose={handleCloseModal} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          background: "#F7FAFC",
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        {chats ? (
          <Stack
            sx={{
              overflowY: "auto",
              height: "100%",
            }}
          >
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedChat === chat ? "#3182CE" : "#EDF2F7",
                  color: selectedChat === chat ? "white" : "#2D3748",
                  px: 3,
                  py: 2,
                  borderRadius: "8px",
                  marginBottom: 1.5,
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: selectedChat === chat ? "#3182CE" : "#E2E8F0",
                  },
                }}
              >
                <Typography sx={{ textTransform: "capitalize", fontWeight: selectedChat === chat ? "600" : "500" }}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChat;
