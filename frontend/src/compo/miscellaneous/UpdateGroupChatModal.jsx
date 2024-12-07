import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ChatState } from "../context/chatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { useSnackbar } from "../context/SnackBar";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const [open, setOpen] = React.useState(false);
  const showSnackbar = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {};
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("/api/chat/rename", {
        method: "PUT",
        headers: config.headers,
        body: JSON.stringify({
          chatId: selectedChat._id,
          chatName: groupChatName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename the chat.");
      }

      const data = await response.json();
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      showSnackbar("Chat renamed successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      showSnackbar("Error occurred while renaming the chat.");
      setRenameLoading(false);
    }
    setGroupChatName("");
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showSnackbar("Failed to search results!", "error");
    }
  };

  const addUser = async (usertoadd) => {
    if (selectedChat.users.find((u) => u._id === usertoadd._id)) {
      showSnackbar("User already added!");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      showSnackbar("Only admins can add someone!", "error");
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await fetch("/api/chat/groupadd", {
        method: "PUT",
        headers: config.headers,
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: usertoadd._id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add in group. Please try again.");
      }
      const data = await response.json();
      setSelectedChat(data);
      setSearchResult("");
      setSearch("");
      setFetchAgain(!fetchAgain);
      showSnackbar("User added Successfully", "error");
      setRenameLoading(false);
    } catch (error) {
      showSnackbar("Failed to add User", "error");
      setRenameLoading(false);
    }
  };

  const userRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      showSnackbar("Only admins can Remove someone!", "error");
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await fetch("/api/chat/groupremove", {
        method: "PUT",
        headers: config.headers,
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: userToRemove._id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove from group. Please try again.");
      }
      const data = await response.json();

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      showSnackbar("User removed!", "sucess");
      setRenameLoading(false);
    } catch (error) {
      showSnackbar("Failed to add User", "error");
      setRenameLoading(false);
    }
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <VisibilityIcon sx={{ color: "#1976d2" }} />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: "center",
            textTransform: "capitalize",
            fontFamily: "work sans",
            fontSize: "26px",
            color: "#2C8C7A",
          }}
        >
          {selectedChat.chatName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={user._id}
                user={u}
                handleFunction={() => userRemove(u)}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginY: 2,
            }}
          >
            <TextField
              placeholder="Rename Group Name"
              onChange={(e) => setGroupChatName(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleRename}
              sx={{
                backgroundColor: "#007bff",
                color: "white",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              Update
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginY: 2,
            }}
          >
            <TextField
              placeholder="Search User to add.."
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                },
              }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#28a745",
                color: "white",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#1c7430",
                },
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
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
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handlefunction={() => addUser(user)}
                  />
                ))
              )
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              userRemove(user);
            }}
            variant="contained"
            sx={{
              backgroundColor: "#dc3545",
              color: "white",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#b02a37",
              },
            }}
          >
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UpdateGroupChatModal;
