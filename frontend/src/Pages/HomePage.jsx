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
    { size: 90, left: "8%", delay: "0s", duration: "18s", floatAnim: "floatUpSlow", wobbleAnim: "wobble", wobbleTime: "5s" },
    { size: 45, left: "22%", delay: "2s", duration: "12s", floatAnim: "floatUpFast", wobbleAnim: "wobbleReverse", wobbleTime: "3s" },
    { size: 120, left: "38%", delay: "4s", duration: "22s", floatAnim: "floatUpWobbly", wobbleAnim: "wobble", wobbleTime: "6s" },
    { size: 30, left: "55%", delay: "1s", duration: "10s", floatAnim: "floatUpFast", wobbleAnim: "wobble", wobbleTime: "2.5s" },
    { size: 75, left: "70%", delay: "5s", duration: "15s", floatAnim: "floatUpSlow", wobbleAnim: "wobbleReverse", wobbleTime: "4s" },
    { size: 110, left: "88%", delay: "3s", duration: "19s", floatAnim: "floatUpWobbly", wobbleAnim: "wobble", wobbleTime: "5.5s" },
    { size: 55, left: "14%", delay: "6s", duration: "13s", floatAnim: "floatUpSlow", wobbleAnim: "wobble", wobbleTime: "3.5s" },
    { size: 85, left: "30%", delay: "1s", duration: "16s", floatAnim: "floatUpFast", wobbleAnim: "wobbleReverse", wobbleTime: "4.5s" },
    { size: 65, left: "62%", delay: "7s", duration: "14s", floatAnim: "floatUpWobbly", wobbleAnim: "wobble", wobbleTime: "3.8s" },
    { size: 100, left: "78%", delay: "2s", duration: "21s", floatAnim: "floatUpSlow", wobbleAnim: "wobble", wobbleTime: "5.2s" },
    { size: 28, left: "93%", delay: "4s", duration: "9s", floatAnim: "floatUpFast", wobbleAnim: "wobbleReverse", wobbleTime: "2s" },
    { size: 50, left: "48%", delay: "8s", duration: "11s", floatAnim: "floatUpWobbly", wobbleAnim: "wobble", wobbleTime: "3.2s" },
  ];

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 50%, #EBF8FF 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <style>{`
        @keyframes floatUpSlow {
          0% {
            transform: translateY(110vh) translateX(0px) scale(0.6);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(-20vh) translateX(-80px) scale(1.1);
            opacity: 0;
          }
        }
        @keyframes floatUpFast {
          0% {
            transform: translateY(110vh) translateX(0px) scale(0.5);
            opacity: 0;
          }
          15% { opacity: 0.7; }
          85% { opacity: 0.7; }
          100% {
            transform: translateY(-20vh) translateX(60px) scale(1.3);
            opacity: 0;
          }
        }
        @keyframes floatUpWobbly {
          0% {
            transform: translateY(110vh) translateX(0px) scale(0.7);
            opacity: 0;
          }
          12% { opacity: 0.65; }
          88% { opacity: 0.65; }
          100% {
            transform: translateY(-20vh) translateX(-40px) scale(1.0);
            opacity: 0;
          }
        }
        @keyframes wobble {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(25px);
          }
        }
        @keyframes wobbleReverse {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(-25px);
          }
        }
        .bubble {
          position: absolute;
          bottom: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.15) 70%, rgba(255, 255, 255, 0.45) 100%);
          box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.25), inset 0px 2px 10px rgba(255, 255, 255, 0.45);
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
            animation: `${b.floatAnim} ${b.duration} infinite linear, ${b.wobbleAnim} ${b.wobbleTime} infinite ease-in-out`,
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
