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
        height: "calc(100vh - 16px)",
        borderRadius: "1rem",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "grey.300",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          paddingBottom: 3,
          px: 3,
          fontSize: { xs: "28px", md: "30px" },
          fontFamily: "Work sans",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My Chats
        <Button
          onClick={handleOpenModal}
          sx={{
            display: "flex",
            fontSize: { xs: "13px", md: "10px", lg: "17px" },
            backgroundColor: "grey.400",
            color: "white",
          }}
          endIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        <GroupChatModal open={openModal} onClose={handleCloseModal} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 3,
          background: "#F8F8F8",
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {chats ? (
          <Stack
            sx={{
              overflowY: "scroll",
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
                    selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                  color: selectedChat === chat ? "white" : "black",
                  px: 3,
                  py: 2,
                  borderRadius: "8px",
                  marginBottom: 1,
                }}
              >
                <Typography sx={{ textTransform: "capitalize" }}>
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
