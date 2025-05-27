// src/services/socketService.ts
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import Message from '../models/Message';
import Match from '../models/Match';
import { sendNewMessageEmail } from './emailService';

interface AuthSocket extends Socket {
  userId: string;
  userType: string;
}

export const handleSocketConnection = (socket: AuthSocket, io: Server) => {
  console.log(`User ${socket.userId} connected`);
  
  // Join user's personal room
  socket.join(`user_${socket.userId}`);
  
  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { recipientId, matchId, content, type = 'text' } = data;
      
      // Verify match exists
      const match = await Match.findById(matchId);
      if (!match) {
        socket.emit('error', { message: 'Match not found' });
        return;
      }
      
      // Create message
      const message = new Message({
        sender: socket.userId,
        recipient: recipientId,
        match: matchId,
        content,
        type
      });
      
      await message.save();
      
      // Fixed populate syntax - separate calls
      await message.populate('sender', 'firstName lastName');
      await message.populate('recipient', 'firstName lastName');
      
      // Send to recipient
      io.to(`user_${recipientId}`).emit('new_message', message);
      
      // Send email notification
      try {
        await sendNewMessageEmail(recipientId, socket.userId, content);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }
      
      // Send confirmation to sender
      socket.emit('message_sent', { messageId: message._id });
      
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Handle message read status
  socket.on('mark_messages_read', async (data) => {
    try {
      const { matchId } = data;
      
      await Message.updateMany(
        { match: matchId, recipient: socket.userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      
      socket.emit('messages_marked_read', { matchId });
    } catch (error) {
      console.error('Mark messages read error:', error);
    }
  });
  
  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(`user_${data.recipientId}`).emit('user_typing', {
      userId: socket.userId,
      isTyping: data.isTyping
    });
  });
  
  // Handle user going online/offline
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
};