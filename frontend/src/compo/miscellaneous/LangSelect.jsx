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
    <Box>
      <Button
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<LanguageIcon sx={{ fontSize: 18, color: "#4A5568" }} />}
        sx={{
          textTransform: "uppercase",
          color: "#4A5568",
          fontWeight: "600",
          fontSize: { xs: "0.75rem", sm: "0.85rem" },
          padding: "4px 8px",
          borderRadius: "8px",
          minWidth: "auto",
          "&:hover": {
            backgroundColor: "#EDF2F7",
          },
        }}
      >
        {selectedLanguage === "Off" || selectedLanguage === "off" ? "Translate" : selectedLanguage}
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
