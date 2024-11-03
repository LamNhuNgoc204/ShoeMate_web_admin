import React, { useEffect, useState, useRef } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button, Paper, Divider } from '@mui/material';
import AxiosInstance from 'helper/AxiosInstance';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SOCKET_SERVER_URL = "http://192.168.1.32:3000"

const Customer = () => {
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const userState = useSelector(state => state.users);
  
  const conversationsRef = useRef(conversations);
  const selectedConversationRef = useRef({
    _id: 0,
    userId: {
      name: "Loading..."
    }
  });

  const [selectedConversation, setSelectedConversations] = useState(selectedConversationRef.current);

  const sortConversation = () => {
    return conversations.sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        const aDate = new Date(a.lastMessage.createdAt);
        const bDate = new Date(b.lastMessage.createdAt);
        return bDate.getTime() - aDate.getTime();
      }
      return 0; 
    });
  };

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    const sortedConversations = sortConversation();
    setConversations(sortedConversations);
  }, [conversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await AxiosInstance().post('/messages/send-message', {
        conversationId: selectedConversation._id,
        text: newMessage.trim(),
        senderId: userState.users.user._id
      });
      setNewMessage("");
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn: ', error);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    if (diffDays === 1) return "Hôm qua";
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const getConversations = async () => {
    try {
      const response = await AxiosInstance().get('/messages/get-all-conversations');
      if (response.status && response.data.length > 0) {
        setConversations(response.data);
        setSelectedConversations(response.data[0]);
        getMessages(response.data[0]._id);
      }
    } catch (error) {
      console.error('Lỗi: ', error);
    }
  };

  const getMessages = async (conversationId) => {
    try {
      const response = await AxiosInstance().get(`/messages/get-messages/${conversationId}`);
      if (response.status) {
        setMessages(response.data.reverse());
      }
    } catch (error) {
      console.error('Lỗi: ', error);
    }
  };

  const getConversation = async (conversationId) => {
    try {
      const response = await AxiosInstance().get(`/messages/get-conversation/${conversationId}`);
      setConversations((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Lỗi: ', error);
    }
  };

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('sendMessage', (data) => {
      const currentConversations = conversationsRef.current;
      const existId = currentConversations.findIndex((conversation) => conversation._id === data.message.conversationId);

      if (existId === -1) {
        getConversation(data.message.conversationId);
      } else {
        setConversations((prevConversations) => {
          const updatedConversations = [...prevConversations];
          updatedConversations[existId].lastMessage = data.message;
          return updatedConversations;
        });

        if (data.message.conversationId === selectedConversationRef.current._id) {
          setMessages((prevMessages) => [...prevMessages, data.message]);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getConversations();
  }, []);

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
                key={conversation._id}
                onClick={() => {
                  getMessages(conversation._id);
                  setSelectedConversations(conversation);
                }}
                selected={selectedConversation._id === conversation._id}
              >
                <ListItemAvatar>
                  <Avatar>{conversation.userId.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={conversation.userId.name} secondary={`${conversation.lastMessage ? conversation.lastMessage.text : ''} - ${formatDate(conversation.lastMessage ? conversation.lastMessage.createdAt : '')}`} />
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
            {messages.map((message) => (message.type == 'order' && message.order)? OrderItem(message.order) : (
              <Box key={message._id} display="flex" justifyContent={message.senderId._id !== selectedConversation.userId._id ? 'flex-end' : 'flex-start'}>
                <Box
                  bgcolor={message.senderId._id !== selectedConversation.userId._id ? 'primary.main' : 'grey.300'}
                  color={message.senderId._id !== selectedConversation.userId._id ? 'white' : 'black'}
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


function OrderItem(order) {
  const countItems = () => {
    var count = 0;
    order.orderDetails.forEach(e => {
      count += e.product.pd_quantity
    });
    return count;
  }
  return (
      <div style={styles.container}>
          <div style={styles.imageContainer}>
              <img 
                  src="https://w7.pngwing.com/pngs/423/632/png-transparent-computer-icons-purchase-order-order-fulfillment-purchasing-order-icon-blue-angle-text-thumbnail.png" 
                  alt="Order Icon" 
                  style={styles.image} 
              />
          </div>
          <div style={styles.content}>
              <div style={styles.header}>
                  <span style={styles.orderId}>Order #{order.order._id}</span>
                  <span style={styles.itemsBadge}>{countItems()} items</span>
              </div>
              <div style={styles.status}>{order.status}</div>
              <div style={styles.total}>
                  Total: <span style={styles.totalAmount}>${order.order.total_price}</span>
              </div>
          </div>
      </div>
  );
}

const styles = {
  container: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #007AFF',
      borderRadius: '8px',
      padding: '10px',
      maxWidth: '400px',
      margin: '10px 0'
  },
  imageContainer: {
      marginRight: '10px',
  },
  image: {
      width: '50px',
      height: '50px',
  },
  content: {
      flex: 1,
  },
  header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  orderId: {
      fontWeight: 'bold',
      color: '#000',
  },
  itemsBadge: {
      backgroundColor: '#E0E0E0',
      borderRadius: '12px',
      padding: '2px 8px',
      fontSize: '12px',
      color: '#6e6e6e',
  },
  status: {
      fontSize: '14px',
      color: '#757575',
  },
  total: {
      marginTop: '4px',
      fontWeight: 'bold',
  },
  totalAmount: {
      color: '#007AFF',
  }
};


export default Customer;