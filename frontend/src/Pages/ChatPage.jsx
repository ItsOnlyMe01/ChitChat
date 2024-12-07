import React, { useEffect, useState } from "react";
import { ChatState } from "../compo/context/chatProvider";
import SlideDrawer from "../compo/miscellaneous/SlideDrawer";
import MyChat from "../compo/miscellaneous/MyChat";
import Inbox from "../compo/miscellaneous/Inbox";
import Box from "@mui/material/Box";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SlideDrawer />}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <Inbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
