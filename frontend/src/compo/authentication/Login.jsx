import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPssword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleClickShowPassword = () => {
    setShowPssword(!showPassword);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setMessage("");
  };

  const submitLogInForm = async () => {
    setLoading(true);
    if (!email || !password) {
      setOpen(true);
      setMessage("Kindly enter email and passsword!");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(` ${data.message || "Unknown Error"}`);
        setOpen(true);
        setLoading(false);
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      setMessage("Login Successfull!");
      navigate("/chats");
    } catch (error) {
      setMessage(`Error Occured ${error.message}`);
      setOpen(true);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        type="email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormControl variant="outlined" fullWidth required>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                edge="end"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={submitLogInForm}
      >
        {loading ? <CircularProgress size={24} /> : "LoGIn"}
      </Button>
      <Button
        type="submit"
        variant="contained"
        sx={{ background: "gray", color: "white" }}
        onClick={async () => {
          setEmail("guest@email.com"), setPassword("123456");
          setTimeout(submitLogInForm(), 100);
        }}
      >
        Login With Guest
      </Button>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </Box>
  );
};

export default Login;
