import React, { useEffect, useState } from "react";
import { ChatState } from "./context/chatProvider";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { getSender, getSenderFull } from "../config/chatLogics";
import ProfileModal from "./miscellaneous/profileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../aniamtions/typing.json";

const ENDPOINT =
  window.location.hostname === "localhost"
    ? "http://localhost:5000" // Local development ke liye
    : window.location.origin;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    selectedLanguage,
    notification,
    setNotification,
  } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setnewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [buffer, setBuffer] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYmid slice",
    },
  };

  useEffect(() => {
    if (selectedLanguage) {
      console.log(`Language selected: ${selectedLanguage}`);
    }
  }, [selectedLanguage]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const resposne = await fetch(`/api/message/${selectedChat._id}`, {
        method: "GET",
        headers: config.headers,
      });
      const data = await resposne.json();
      setMessages(data);
      setLoading(false);
      socket.emit("join room", selectedChat._id);
    } catch (error) {
      showSnackbar("Failed to load messages!", "error");
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("Stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const translatedMessage = async (message, language) => {
    try {
      if (language !== "Off") {
        console.log(`Translating to: ${language}`);
        const response = await fetch("api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            text: message.content,
            selectedLanguage: language,
          }),
        });
        const data = await response.json();
        message.content = data.translatedText;

        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    } catch (error) {
      console.error("transaltion failed!", "error");
    }
  };

  useEffect(() => {
    const handleMessageReceived = async (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setBuffer((prevBuffer) => [...prevBuffer, newMessageReceived]);
        await translatedMessage(newMessageReceived, selectedLanguage);
      }
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [selectedChatCompare, selectedLanguage, socket]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("Stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const resposne = await fetch("/api/message", {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat._id,
          }),
        });
        setnewMessage("");
        const data = await resposne.json();
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        showSnackbar("Failed to send message", "error");
      }
    }
  };

  const typingHandler = (e) => {
    setnewMessage(e.target.value);
    //typing indicator
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    const lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing)
        socket.emit("Stop typing", selectedChat._id);
      setTyping(false);
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            sx={{
              fontSize: { xs: "28px", md: "30px" },
              paddingBottom: 3,
              px: 2,
              width: "100%",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: { xs: "space-between" },
              alignItems: "center",
              textTransform: "capitalize",
            }}
          >
            <IconButton
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={() => setSelectedChat("")}
            >
              <ArrowBackIcon />
            </IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                  open={open}
                  onClose={handleClose}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 3,
              background: "#e8e8e8",
              width: "100%",
              height: "100%",
              borderRadius: 2,
              overflow: "hidden",
              "@media (max-width: 600px)": {
                background: "white",
                padding: 0,
              },
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress size={50} />
              </Box>
            ) : (
              <div
                className="messages"
                style={{
                  height: "100%",
                  overflowY: "auto",
                  padding: "10px",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <>
              {isTyping && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginLeft: 0,
                    height: "50px",
                    marginBottom: "10px",
                  }}
                >
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{
                      marginBottom: 0,
                      marginLeft: 0,
                    }}
                  />
                </Box>
              )}
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Type a message..."
                sx={{
                  backgroundColor: "#fff",
                  "@media (max-width: 600px)": {
                    backgroundColor: "#e0f7ff",
                  },
                  "::placeholder": {
                    color: "black", // Light gray color for placeholder text
                    opacity: 4,
                  },
                }}
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" onClick={sendMessage}>
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </>
          </Box>
        </>
      ) : (
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Work sans",
            height: "100%",
            fontSize: "30px",
          }}
        >
          Click on a user to start chatting
        </Typography>
      )}
    </>
  );
};

export default SingleChat;
