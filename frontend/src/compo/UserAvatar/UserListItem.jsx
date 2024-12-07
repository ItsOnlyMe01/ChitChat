import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ user, handlefunction }) => {
  return (
    <Box
      onClick={handlefunction}
      sx={{
        background: "#E8E8E8",
        cursor: "pointer",
        width: "100%",
        display: "flex",
        alignItems: "center",
        color: "black",
        px: 3,
        py: 2,
        mb: 2,
        borderRadius: "lg",
        "&:hover": {
          background: "#38B2AC",
          color: "white",
        },
      }}
    >
      <Avatar
        sx={{
          margin: 2,
          cursor: "pointer",
        }}
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ textTransform: "capitalize" }}
        >
          {user.name}
        </Typography>
        <Typography fontSize="14px">
          <b>Email:</b>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
