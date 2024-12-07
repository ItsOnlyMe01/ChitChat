import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "purple",
        color: "white",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: 16,
        cursor: "pointer",
        margin: "4px",
        textTransform: "capitalize",
      }}
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon sx={{ marginLeft: "8px", cursor: "pointer" }} />
    </Box>
  );
};

export default UserBadgeItem;
