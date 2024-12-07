import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ChatState } from "../context/chatProvider";

import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useSnackbar } from "../context/SnackBar";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { useState } from "react";

export default function GroupChatModal({ open, onClose }) {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();

  const { user, chats, setChats } = ChatState();
  const showSnackbar = useSnackbar();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const resposne = await fetch(`api/user?search=${search}`, config);
      const data = await resposne.json();
      console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      showSnackbar("Failed to Load the Search Results!", "error");
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      showSnackbar("Please fill all fields!", "error");
      return;
    }

    try {
      const body = JSON.stringify({
        name: groupChatName,
        users: selectedUsers.map((u) => u._id),
      });
      console.log(body);
      const response = await fetch("/api/chat/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body,
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to create the group chat");
      }

      const data = await response.json();

      setChats([data, ...chats]);

      showSnackbar("Group chat created successfully!", "success");

      setGroupChatName("");
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Error creating group chat:", error);
      showSnackbar(error.message || "An error occurred", "error");
    }
  };

  const handleGroup = (usertoadd) => {
    if (selectedUsers.some((u) => u._id === usertoadd._id)) {
      showSnackbar("User already added!");
      return;
    }

    setSelectedUsers([...selectedUsers, usertoadd]);
    setSearch("");
    setSearchResult([]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle
        sx={{
          fontSize: "35px",
          marginRight: "10px",
          marginLeft: "10px",
          fontFamily: "Work sans",
          display: "flex",
          color: "#38B2AC",
          justifyContent: "center",
        }}
      >
        Create Group Chat
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "gray",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <FormControl variant="outlined" fullWidth required sx={{ marginY: 1 }}>
          <InputLabel htmlFor="chatName">Chat Name</InputLabel>
          <OutlinedInput
            id="chatName"
            label="Chat Name"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth required sx={{ marginY: 1 }}>
          <InputLabel htmlFor="chat-name-input">Add Users</InputLabel>
          <OutlinedInput
            id="chat-name-input"
            label="Add Users"
            placeholder="e.g., Priyanshu, Joe, Monu"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </FormControl>
        <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {selectedUsers.map((u) => (
            <UserBadgeItem
              key={user._id}
              user={u}
              handleFunction={() => handleDelete(u)}
            />
          ))}
        </Box>
        {loading ? (
          <CircularProgress sx={{ alignSelf: "center" }} />
        ) : (
          searchResult
            ?.slice(0, 4)
            .map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handlefunction={() => handleGroup(user)}
              />
            ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Create Chat</Button>
      </DialogActions>
    </Dialog>
  );
}
