import {
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Badge,
  Input,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { ChatState } from "../context/chatProvider";
import ProfileModal from "./profileModal";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { useSnackbar } from "../context/SnackBar";
import LangSelect from "./LangSelect";
import { getSender } from "../../config/chatLogics";
const SlideDrawer = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);

  const showSnackbar = useSnackbar();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();

  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);

  const handleNotificationClick = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorElNotification(null);
  };

  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorElProfile(null);
  };

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSearch = async () => {
    if (!search) {
      showSnackbar("Please enter user to search", "warning");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await fetch(`/api/user?search=${search}`, {
        method: "GET",
        headers: config.headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users. Please try again.");
      }
      const data = await response.json();

      setSearchResult(data);
      console.log(searchResult);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showSnackbar("Failed to search results!", "error");
    }
  };

  const accesChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chat  data: ${response.statusText}`);
      }

      const data = await response.json();
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      showSnackbar("Error fetching the chat!", "error");
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          width: "100%",
          padding: "5px 10px 5px 10px",
          borderWidth: "5px",
        }}
      >
        <Tooltip
          title="Search User!"
          onClick={toggleDrawer(true)}
          sx={{
            gap: "10px",
            padding: "4px 15px 4px 15px",
            borderRadius: "3px",
          }}
        >
          <IconButton>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Typography>Search User</Typography>
          </IconButton>
        </Tooltip>
        <Typography fontSize="2rem" fontFamily="Work Sans, sans-serif">
          Talk-A-tive
        </Typography>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <LangSelect style={{ marginRight: "30px" }} />
          <Button onClick={handleNotificationClick}>
            <Badge badgeContent={notification.length} color="primary">
              <CircleNotificationsIcon sx={{ fontSize: 35 }} />
            </Badge>
          </Button>
          <Menu
            anchorEl={anchorElNotification}
            open={Boolean(anchorElNotification)}
            onClose={handleNotificationClose}
          >
            {notification.length === 0 ? (
              <MenuItem onClick={handleNotificationClose}>
                No new messages!
              </MenuItem>
            ) : (
              notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                    handleNotificationClose();
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))
            )}
          </Menu>

          <Button onClick={handleProfileClick}>
            <Avatar
              src={user.pic}
              name={user.name}
              sx={{
                width: 35,
                height: 35,
                border: "2px solid #fff",
              }}
            />
          </Button>

          <Menu
            anchorEl={anchorElProfile}
            open={Boolean(anchorElProfile)}
            onClose={handleProfileClose}
          >
            <ProfileModal user={user}>
              <MenuItem onClose={handleProfileClose}>My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClose={handleProfileClose} onClick={logOutHandler}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Box>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ padding: 2 }}>
          <Typography
            variant="h5"
            sx={{ paddingBottom: "10px", fontWeight: "bold" }}
          >
            Search Users
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "30px",
              padding: "5px 15px",
            }}
          >
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "16px",
                paddingLeft: "10px",
                borderRadius: "20px",
              }}
            />
            <IconButton
              onClick={handleSearch}
              sx={{
                backgroundColor: "#4caf50",
                color: "#fff",
                borderRadius: "50%",
                padding: "7px",
                marginLeft: "8px",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
            >
              Go
            </IconButton>
          </Box>
        </Box>
        <Box>
          {loading ? (
            <ChatLoading />
          ) : search && searchResult ? (
            searchResult.length === 0 ? (
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                No results found
              </Typography>
            ) : (
              searchResult.map((user1) => (
                <UserListItem
                  key={user1._id}
                  user={user1}
                  handlefunction={() => accesChat(user1._id)}
                />
              ))
            )
          ) : null}
        </Box>
      </Drawer>
    </>
  );
};

export default SlideDrawer;
