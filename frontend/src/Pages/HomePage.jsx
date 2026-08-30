import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container, TextField, Button, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import Login from "../compo/authentication/Login";
import Signup from "../compo/authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  const [value, setValue] = useState("login");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px 24px",
          marginBottom: 3,
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          backgroundColor: "white",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        }}
      >
        <Typography variant="h4" fontFamily="Work Sans" fontWeight="600" color="text.primary">
          ChitChat
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          width: "100%",
          maxWidth: 400,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="signup" label="SignUp" />

          <Tab value="login" label="LogIn" />
        </Tabs>
        {value == "signup" ? <Signup /> : <Login />}
      </Box>
    </Container>
  );
};

export default HomePage;
