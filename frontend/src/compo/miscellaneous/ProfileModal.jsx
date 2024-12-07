import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Avatar, IconButton, MenuItem } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProfileModal({ user, children }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen}>
          <VisibilityIcon sx={{ color: "#1976d2" }} />
        </IconButton>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              textAlign: "center",
              color: "#1976d2",
              marginBottom: 3,
              borderBottom: "2px solid #1976d2",
              width: "100%",
              paddingBottom: 1,
              textTransform: "capitalize",
            }}
          >
            {user.name}
          </Typography>
          <Avatar
            alt="User Name"
            src={user.pic}
            sx={{
              width: 120,
              height: 120,
              marginBottom: 2,
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#f0f0f0",
              padding: "5px 10px",
              borderRadius: "5px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <EmailIcon sx={{ color: "#1976d2" }} />{" "}
            <Typography
              id="modal-modal-footer"
              variant="body1"
              sx={{
                fontFamily: "Arial, sans-serif",
                fontSize: "0.9rem",
                color: "#555",
              }}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
