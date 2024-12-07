import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [showPassword, setShowPssword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const postImagePicture = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      setMessage("Image is not defined!");
      setOpen(true);
      setLoading(false);

      return;
    }
    if (
      pics.type === "image/Jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "djvdftp31");
      fetch("https://api.cloudinary.com/v1_1/djvdftp31/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setMessage("Select JPEG or PNG file type!");
      setOpen(true);

      setLoading(false);
      return;
    }
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const submitSinupForm = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill all  fields");
      setOpen(true);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Password Do Not Match");
      setLoading(false);
      setOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ name, email, password, pic }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error Occurred: ${data.message}`);
        setOpen(true);
        setLoading(false);
        return;
      }

      setMessage("Registration is Successfull!");
      setOpen(true);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      setMessage(`Error Occured ${error.message}`);
      setOpen(true);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* FullName */}

      <TextField
        label="Full Name"
        type="text"
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />

      {/* email */}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        type="email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* password */}

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

      {/* //ConfirmPassword */}

      <FormControl variant="outlined" fullWidth required>
        <InputLabel htmlFor="outlined-adornment-password">
          Confirm Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showConfirmPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showConfirmPassword
                    ? "hide the password"
                    : "display the password"
                }
                edge="end"
                onClick={handleClickShowConfirmPassword}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="ConfirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>

      {/* Image */}

      <Input
        type="file"
        accept="image/*"
        required
        onChange={(e) => postImagePicture(e.target.files[0])}
      />

      {pic && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={pic}
            alt="ProfilePicture"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </Box>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={submitSinupForm}
      >
        {loading ? <CircularProgress size={24} /> : "Sign Up"}
      </Button>

      {/* snackbar */}

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

export default Signup;
