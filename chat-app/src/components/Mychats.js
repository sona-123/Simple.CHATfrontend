import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";
import AddIcon from "@mui/icons-material/Add";
import ChatLoading from "./ChatLoading";
import { getOtherUser } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { API } from "../API";
const MyChats = ({ fetchAgain }) => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    removeNotification,
  } = ChatState();

  const [loggedUser, setLoggedUser] = useState(user);

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${API}/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const selectChat = (chat) => {
    setSelectedChat(chat);
    removeNotification(chat._id);
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems={"center"}
      p={3}
      bg="#3E103F"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth={"1px"}
      h="100%"
    >
      <Box
        pb={3}
        px={3}
        color={"white"}
        fontSize={{ base: "large", md: "2xl" }}
        fontFamily="QuickSand"
        display={"flex"}
        w="100%"
        justifyContent={"space-between"}
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "12px", md: "10px", lg: "14px" }}
            rightIcon={<AddIcon />}
            
          >
            New Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir="column"
        p={3}
        bg="#3E103F"
        w="100%"
        h="100%"
        borderRadius={"lg"}
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => selectChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#944F9A":"#3E103F"}
                color={selectedChat === chat ? "white" : "white"}
                px={3}
                py={2}
                borderRadius={"lg"}
               
                border={"1px"}
                key={chat._id}
              >
                <Text fontWeight={"medium"}>
                  {!chat.isGroupChat
                    ? getOtherUser(loggedUser, chat.users).name
                    : chat.chatName}
                </Text>
                {chat.latestMessage ? (
                  <Text color={selectedChat === chat ? "white" : "white"}>
                    {!chat.isGroupChat
                      ? chat.latestMessage.content
                      : chat.latestMessage.sender._id === loggedUser._id
                      ? `You: ${chat.latestMessage.content}`
                      : `${chat.latestMessage.sender.name}: ${chat.latestMessage.content}`}
                  </Text>
                ) : (
                  <></>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
