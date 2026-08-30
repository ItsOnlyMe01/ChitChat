import React, { useEffect, useState } from "react";
import { ChatState } from "./context/chatProvider";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import PaletteIcon from "@mui/icons-material/Palette";
import { getSender, getSenderFull } from "../config/chatLogics";
import ProfileModal from "./miscellaneous/profileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../aniamtions/typing.json";
import { useSnackbar } from "./context/SnackBar";

const ENDPOINT = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://chitchat-hsxm.onrender.com";
var socket, selectedChatCompare;

const backgroundsList = [
  { name: "Default", value: "#FAFBFB", label: "Default" },
  { name: "Love", value: "linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)", label: "❤️ Love" },
  { name: "Funny", value: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)", label: "🎭 Funny" },
  { name: "Calm", value: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)", label: "🧘 Calm" },
  { name: "Cozy", value: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)", label: "🍑 Cozy" },
  { name: "Nature", value: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)", label: "🌱 Nature" },
  { name: "Creative", value: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)", label: "🔮 Creative" },
  { name: "Classic Dots", value: "radial-gradient(#CBD5E0 1.2px, #FAFBFB 1.2px)", label: "💬 Dots" },
  { name: "Blueprint Grid", value: "linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)", label: "📐 Grid" },
];

const getBackgroundStyle = (bgValue) => {
  if (!bgValue || bgValue === "#FAFBFB") {
    return { background: "#FAFBFB" };
  }
  if (bgValue.includes("radial-gradient")) {
    return {
      backgroundImage: bgValue,
      backgroundColor: "#FAFBFB",
      backgroundSize: "16px 16px",
    };
  }
  if (bgValue.includes("linear-gradient(#E2E8F0")) {
    return {
      backgroundImage: bgValue,
      backgroundColor: "#FAFBFB",
      backgroundSize: "20px 20px",
    };
  }
  return { background: bgValue };
};

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  
  const showSnackbar = useSnackbar();

  const {
    user,
    selectedChat,
    setSelectedChat,
    selectedLanguage,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setnewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [buffer, setBuffer] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [anchorElBg, setAnchorElBg] = useState(null);
  const handleBgClick = (event) => setAnchorElBg(event.currentTarget);
  const handleBgClose = () => setAnchorElBg(null);

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

      if (selectedLanguage && selectedLanguage !== "Off" && selectedLanguage !== "off") {
        const textsToTranslate = data.map((msg) => msg.content);
        const translateRes = await fetch("api/translate", {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify({
            text: textsToTranslate,
            selectedLanguage: selectedLanguage,
          }),
        });
        const transData = await translateRes.json();

        if (transData && Array.isArray(transData.translatedText)) {
          const translatedData = data.map((msg, index) => ({
            ...msg,
            content: transData.translatedText[index] || msg.content,
          }));
          setMessages(translatedData);
        } else {
          setMessages(data);
        }
      } else {
        setMessages(data);
      }

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
        if (data && data.translatedText) {
          message.content = data.translatedText;
        }
      }
    } catch (error) {
      console.error("translation failed!", error);
    } finally {
      setMessages((prevMessages) => [...prevMessages, message]);
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

    const handleBackgroundUpdated = ({ chatId, background }) => {
      if (selectedChatCompare && selectedChatCompare._id === chatId) {
        setSelectedChat((prevChat) => ({ ...prevChat, chatBackground: background }));
        if (setChats) {
          setChats((prevChats) =>
            prevChats.map((c) => (c._id === chatId ? { ...c, chatBackground: background } : c))
          );
        }
      }
    };

    socket.on("message received", handleMessageReceived);
    socket.on("background updated", handleBackgroundUpdated);

    return () => {
      socket.off("message received", handleMessageReceived);
      socket.off("background updated", handleBackgroundUpdated);
    };
  }, [selectedChatCompare, selectedLanguage, socket]);

  const changeChatBackground = async (bgValue) => {
    handleBgClose();
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await fetch("/api/chat/background", {
        method: "PUT",
        headers: config.headers,
        body: JSON.stringify({
          chatId: selectedChat._id,
          background: bgValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update background");
      }

      setSelectedChat((prevChat) => ({ ...prevChat, chatBackground: bgValue }));
      
      if (setChats && chats) {
        setChats(
          chats.map((c) =>
            c._id === selectedChat._id ? { ...c, chatBackground: bgValue } : c
          )
        );
      }

      socket.emit("change background", {
        chatId: selectedChat._id,
        background: bgValue,
      });
    } catch (error) {
      showSnackbar("Failed to update chat background", "error");
    }
  };

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
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
              justifyContent: "space-between",
              alignItems: "center",
              textTransform: "capitalize",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                sx={{ display: { xs: "flex", md: "none" } }}
                onClick={() => setSelectedChat("")}
              >
                <ArrowBackIcon />
              </IconButton>
              {!selectedChat.isGroupChat ? (
                <>{getSender(user, selectedChat.users)}</>
              ) : (
                <>{selectedChat.chatName.toLowerCase()}</>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={handleBgClick}>
                <PaletteIcon sx={{ color: "#718096" }} />
              </IconButton>

              {!selectedChat.isGroupChat ? (
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              ) : (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              )}
            </Box>
          </Typography>

          <Menu
            id="bg-menu"
            anchorEl={anchorElBg}
            open={Boolean(anchorElBg)}
            onClose={handleBgClose}
            PaperProps={{
              sx: {
                padding: 2,
                width: "280px",
                maxHeight: "350px",
                borderRadius: "12px",
                boxShadow: "0px 10px 20px rgba(0,0,0,0.08)",
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5, color: "text.primary" }}>
              Choose Chat Theme
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.2 }}>
              {backgroundsList.map((bg) => (
                <Button
                  key={bg.name}
                  onClick={() => changeChatBackground(bg.value)}
                  sx={{
                    height: "55px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: (selectedChat.chatBackground === bg.value || (!selectedChat.chatBackground && bg.value === "#FAFBFB")) ? "2px solid #3182CE" : "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "4px",
                    cursor: "pointer",
                    background: bg.value.includes("gradient") ? bg.value : bg.value,
                    backgroundColor: bg.value.includes("gradient") ? "transparent" : bg.value,
                    "&:hover": {
                      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: "9px", fontWeight: "bold", color: bg.name === "Default" || bg.value === "#FAFBFB" ? "text.primary" : "#1A202C", textShadow: (bg.name !== "Default" && !bg.value.includes("radial")) ? "0px 1px 2px white" : "none" }}>
                    {bg.label}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Menu>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 2,
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
              ...getBackgroundStyle(selectedChat.chatBackground),
              "@media (max-width: 600px)": {
                background: "white",
                padding: 0,
                border: "none",
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
                    height: "40px",
                    marginBottom: "5px",
                  }}
                >
                  <Lottie
                    options={defaultOptions}
                    width={50}
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
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#F7FAFC",
                    "& fieldset": {
                      borderColor: "#E2E8F0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#CBD5E0",
                    },
                  },
                  "@media (max-width: 600px)": {
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#EDF2F7",
                    },
                  },
                }}
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" onClick={sendMessage}>
                        <SendIcon sx={{ color: "#3182CE" }} />
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "text.secondary",
            textAlign: "center",
            padding: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Work sans",
              fontWeight: "600",
              color: "text.primary",
              marginBottom: 1,
            }}
          >
            ChitChat Workspace
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Work sans",
              color: "text.secondary",
            }}
          >
            Select a contact on the left to start messaging
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
