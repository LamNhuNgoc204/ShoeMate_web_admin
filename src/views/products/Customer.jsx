import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Button, Paper, Divider } from '@mui/material';

const Customer = () => {
  // Danh sách khách hàng giả lập
  const customers = [
    { id: 1, name: 'Khách hàng A', lastMessage: 'Sản phẩm này còn không?', time: '10:30 AM' },
    { id: 2, name: 'Khách hàng B', lastMessage: 'Tôi cần tư vấn về giày.', time: '9:15 AM' },
    { id: 3, name: 'Khách hàng C', lastMessage: 'Cảm ơn shop!', time: '8:45 AM' }
  ];

  // Tin nhắn giả lập của cuộc hội thoại
  const messages = [
    { id: 1, sender: 'customer', text: 'Sản phẩm này còn không?', time: '10:30 AM' },
    { id: 2, sender: 'admin', text: 'Dạ còn ạ!', time: '10:32 AM' }
  ];

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [chatMessages, setChatMessages] = useState(messages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newChatMessage = {
        id: chatMessages.length + 1,
        sender: 'admin',
        text: newMessage,
        time: new Date().toLocaleTimeString()
      };
      setChatMessages([...chatMessages, newChatMessage]);
      setNewMessage('');
    }
  };
  return (
    <MainCard title="HỖ TRỢ KHÁCH HÀNG">
      <Box display="flex" height="100vh" p={2}>
        {/* Danh sách cuộc trò chuyện */}
        <Box width="25%" borderRight="1px solid #ccc" pr={2}>
          <Typography variant="h6" gutterBottom>
            Danh sách cuộc trò chuyện
          </Typography>
          <List>
            {customers.map((customer) => (
              <ListItem
                button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                selected={selectedCustomer.id === customer.id}
              >
                <ListItemAvatar>
                  <Avatar>{customer.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={customer.name} secondary={`${customer.lastMessage} - ${customer.time}`} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Khung chat chính */}
        <Box width="75%" pl={2} display="flex" flexDirection="column">
          <Typography variant="h6" gutterBottom>
            Hỗ trợ khách hàng: {selectedCustomer.name}
          </Typography>
          <Paper style={{ flex: 1, padding: '16px', marginBottom: '16px', overflowY: 'auto' }}>
            {chatMessages.map((message) => (
              <Box key={message.id} display="flex" justifyContent={message.sender === 'admin' ? 'flex-end' : 'flex-start'}>
                <Box
                  bgcolor={message.sender === 'admin' ? 'primary.main' : 'grey.300'}
                  color={message.sender === 'admin' ? 'white' : 'black'}
                  p={1}
                  m={1}
                  borderRadius={2}
                >
                  <Typography>{message.text}</Typography>
                  <Typography variant="caption" display="block" textAlign="right">
                    {message.time}
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
