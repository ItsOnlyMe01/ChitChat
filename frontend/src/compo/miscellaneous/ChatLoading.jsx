import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const ChatLoading = () => {
  return (
    <div>
      <Box sx={{ width: 300 }}>
        <Skeleton animation="wave" sx={{ height: 60 }} />
        <Skeleton animation="wave" sx={{ height: 60 }} />
        <Skeleton animation="wave" sx={{ height: 60 }} />
        <Skeleton animation="wave" sx={{ height: 60 }} />
        <Skeleton animation="wave" sx={{ height: 60 }} />
        <Skeleton animation="wave" sx={{ height: 60 }} />
        <Skeleton animation="wave" sx={{ height: 60 }} />
        <Skeleton animation="wave" sx={{ height: 60 }} />
      </Box>
    </div>
  );
};

export default ChatLoading;
