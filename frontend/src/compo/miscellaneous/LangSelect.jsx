import React, { useEffect, useState } from "react";
import { Button, Menu, MenuItem, Typography, Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { ChatState } from "../context/chatProvider";

export default function LangSelect() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { selectedLanguage, setSelectedLanguage } = ChatState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (language) => {
    if (language) {
      setSelectedLanguage(language);
    }
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        borderRadius: "25px",
        boxShadow: 2,
        bgcolor: "#f0f0f0",
        padding: "2px 5px",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "#e0e0e0",
        },
      }}
    >
      <Button
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          backgroundColor: "transparent",
          borderRadius: "25px",
          padding: "5px 10px",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <LanguageIcon sx={{ fontSize: 20, color: "#555" }} />
        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#555" }}>
          {selectedLanguage}
        </Typography>
      </Button>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
      >
        <MenuItem onClick={() => handleClose("off")}>Off</MenuItem>
        <MenuItem onClick={() => handleClose("en")}>English </MenuItem>
        <MenuItem onClick={() => handleClose("hi")}>Hindi </MenuItem>
        <MenuItem onClick={() => handleClose("ta")}>Tamil </MenuItem>
        <MenuItem onClick={() => handleClose("te")}>Telugu</MenuItem>
        <MenuItem onClick={() => handleClose("bn")}>Bengali </MenuItem>
        <MenuItem onClick={() => handleClose("gu")}>Gujarati</MenuItem>
        <MenuItem onClick={() => handleClose("mr")}>Marathi </MenuItem>
        <MenuItem onClick={() => handleClose("pa")}>Punjabi</MenuItem>
        <MenuItem onClick={() => handleClose("kn")}>Kannada </MenuItem>
        <MenuItem onClick={() => handleClose("ml")}>Malayalam </MenuItem>
        <MenuItem onClick={() => handleClose("ur")}>Urdu</MenuItem>
        <MenuItem onClick={() => handleClose("bho")}>Bhojpuri</MenuItem>
        <MenuItem onClick={() => handleClose("es")}>Spanish </MenuItem>
        <MenuItem onClick={() => handleClose("fr")}>French </MenuItem>
      </Menu>
    </Box>
  );
}
