import React, { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button, Paper, Divider } from '@mui/material';
import AxiosInstance from 'helper/AxiosInstance';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SOCKET_SERVER_URL = "http://192.168.1.28:3000"

const Customer = () => {

  const [selectedConversation, setSelectedConversations] = useState({
    _id: 0,
    userId: {
      name: "Loading..."
    }
  });
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMesssages] = useState([])
  const userState = useSelector(state => state.users)

  const sortConversation = () => {
    const sortedConversations = conversations.sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        const aDate = new Date(a.lastMessage.createdAt);
        const bDate = new Date(b.lastMessage.createdAt);
        return bDate.getTime() - aDate.getTime();
      }
    })
    return sortedConversations;
  }



  useEffect(() => {
    sortConversation()
  }, [conversations])


  const handleSendMessage = async () => {
    try {
      if (!newMessage.trim()) {
        return
      }
      const response = await AxiosInstance().post('/messages/send-message', {
        conversationId: selectedConversation._id,
        text: newMessage.trim(),
        senderId: userState.users.user._id
      })
      setNewMessage("")
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  }

  function formatDate(isoString) {
    if (!isoString) {
      return "";
    }
    const date = new Date(isoString);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      return `${formattedHours}:${formattedMinutes}${period}`;
    }

    if (diffDays === 1) {
      return "hôm qua";
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}`;
  }



  const getConversations = async () => {
    try {
      const response = await AxiosInstance().get('/messages/get-all-conversations');
      if (response.status) {
        if (response.data.length > 0) {
          getMessages(response.data[0]._id)
          setSelectedConversations(response.data[0])
        }
        setConversations(response.data);
      } else {
        console.error('L��i: ', error);
      }
    } catch (error) {
      console.error('L��i: ', error);

    }
  }

  const getMessages = async (conversationId) => {
    try {
      const response = await AxiosInstance().get('/messages/get-messages/' + conversationId);
      console.log(response);
      if (response.status) {
        setMesssages(response.data);
      } else {
        console.error('L��i: ', error);
      }
    } catch (error) {
      console.error('L��i: ', error);
    }

  }

  const getConversation = async (conversationId) => {
    try {
      const conversation = await AxiosInstance().get('/messages/get-conversation/' + conversationId);
      setConversations(pre => [...pre, conversation]);
    } catch (error) {
      console.error('L��i: ', error);

    }
  }

  useEffect(() => {
    // Kết nối tới server
    const socket = io(SOCKET_SERVER_URL);

    // Lắng nghe sự kiện 'connect' khi kết nối thành công
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('sendMessage', (data) => {
      console.log('Received message:', data.message);
      if (data.message.conversationId == selectedConversation._id) {
        setMesssages((prevMessages) => [...prevMessages, data.message]);
      }
      const existId = conversations.findIndex((conversation) => conversation._id == data.message.conversationId);
      console.log('index: ',existId);
      if (existId == -1) {
        getConversation(data.message.conversationId);
      } else {
        setConversations((preConversations) => {
          const updatedConversations = [...preConversations];
          updatedConversations[existId].lastMessage = data.message;
          return updatedConversations;
        })
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Cleanup function khi component bị unmount
    return () => {
      socket.disconnect();
      console.log('Socket disconnected on cleanup');
    };
  }, []);


  useEffect(() => {
    getConversations()
  }, [])
  return (
    <MainCard title="HỖ TRỢ KHÁCH HÀNG">
      <Box display="flex" height="100vh" p={2}>
        {/* Danh sách cuộc trò chuyện */}
        <Box width="25%" borderRight="1px solid #ccc" pr={2}>
          <Typography variant="h6" gutterBottom>
            Danh sách cuộc trò chuyện
          </Typography>
          <List>
            {conversations.map((conversation) => (
              <ListItem
                button
                key={conversations.id}
                onClick={() => {

                  getMessages(conversation._id);
                  setSelectedConversations(conversation);
                }}
                selected={selectedConversation._id === conversation._id}
              >
                <ListItemAvatar>
                  <Avatar>{conversation.userId.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={conversation.userId.name} secondary={`${conversation.lastMessage.text} - ${formatDate(conversation.lastMessage.createdAt)}`} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Khung chat chính */}
        <Box width="75%" pl={2} display="flex" flexDirection="column">
          <Typography variant="h6" gutterBottom>
            Hỗ trợ khách hàng: {selectedConversation.userId.name}
          </Typography>
          <Paper style={{ flex: 1, padding: '16px', marginBottom: '16px', overflowY: 'auto' }}>
            {messages.map((message) => (
              <Box key={message._id} display="flex" justifyContent={message.senderId._id != selectedConversation.userId._id ? 'flex-end' : 'flex-start'}>
                <Box
                  bgcolor={message.senderId._id != selectedConversation.userId._id ? 'primary.main' : 'grey.300'}
                  color={message.senderId._id != selectedConversation.userId._id ? 'white' : 'black'}
                  p={1}
                  m={1}
                  borderRadius={2}
                >
                  <Typography>{message.text}</Typography>
                  <Typography variant="caption" display="block" textAlign="right">
                    {formatDate(message.createdAt)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>

          {/* Khu vực nhập tin nhắn */}
          <Divider />
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginLeft: '8px' }}>
              Gửi
            </Button>
          </Box>
        </Box>
      </Box>
    </MainCard>
  );
};

export default Customer;
