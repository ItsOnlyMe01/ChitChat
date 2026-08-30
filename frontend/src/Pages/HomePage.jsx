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

  const bubbles = [
    { size: 90, left: "8%", duration: "16s", delay: "0s", wobble: "5s" },
    { size: 45, left: "22%", duration: "11s", delay: "2s", wobble: "3s" },
    { size: 120, left: "38%", duration: "20s", delay: "4s", wobble: "6s" },
    { size: 30, left: "55%", duration: "9s", delay: "1s", wobble: "2.5s" },
    { size: 75, left: "70%", duration: "14s", delay: "5s", wobble: "4s" },
    { size: 110, left: "88%", duration: "18s", delay: "3s", wobble: "5.5s" },
    { size: 55, left: "14%", duration: "12s", delay: "6s", wobble: "3.5s" },
    { size: 85, left: "30%", duration: "15s", delay: "1s", wobble: "4.5s" },
    { size: 65, left: "62%", duration: "13s", delay: "7s", wobble: "3.8s" },
    { size: 100, left: "78%", duration: "19s", delay: "2s", wobble: "5.2s" },
    { size: 28, left: "93%", duration: "8s", delay: "4s", wobble: "2s" },
    { size: 50, left: "48%", duration: "10s", delay: "8s", wobble: "3.2s" },
  ];

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #E2E8F0 0%, #EBF8FF 50%, #EDF2F7 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(110vh) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-20vh) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes wobble {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(35px);
          }
        }
        .bubble {
          position: absolute;
          bottom: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.4) 100%);
          box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2), inset 0px 2px 10px rgba(255, 255, 255, 0.4);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {/* Floating animated bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: b.left,
            animation: `floatUp ${b.duration} infinite linear, wobble ${b.wobble} infinite ease-in-out`,
            animationDelay: b.delay,
          }}
        />
      ))}

      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
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
    </Box>
  );
};

export default HomePage;
