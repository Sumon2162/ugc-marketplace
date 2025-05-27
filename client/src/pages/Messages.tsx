import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../config/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Match {
  _id: string;
  creator: User;
  brand: User;
  status: string;
  createdAt: string;
}

interface Message {
  _id: string;
  matchId: string;
  sender: User;
  content: string;
  timestamp: string;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch._id);
    }
  }, [selectedMatch]);

  const fetchMatches = async () => {
    try {
      console.log('📨 FETCHING: Matches for user');
      const response = await apiService.get('/matches');
      console.log('✅ MATCHES SUCCESS:', response.data);
      setMatches(response.data || []);
      
      // Auto-select first match if available
      if (response.data && response.data.length > 0) {
        setSelectedMatch(response.data[0]);
      }
    } catch (error) {
      console.error('❌ Error fetching matches:', error);
      // Fallback to mock data if API fails
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId: string) => {
    try {
      console.log('📨 FETCHING: Messages for match', matchId);
      const response = await apiService.get(`/messages/${matchId}`);
      console.log('✅ MESSAGES SUCCESS:', response.data);
      setMessages(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch || sendingMessage) return;

    setSendingMessage(true);
    try {
      console.log('📤 SENDING: Message to match', selectedMatch._id);
      const response = await apiService.post('/messages', {
        matchId: selectedMatch._id,
        content: newMessage.trim()
      });
      console.log('✅ MESSAGE SENT:', response.data);

      // Add new message to list
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherUser = (match: Match) => {
    return user?.userType === 'creator' ? match.brand : match.creator;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6B46C1 0%, #1E40AF 50%, #3730A3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading messages...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6B46C1 0%, #1E40AF 50%, #3730A3 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
          Messages
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '24px',
          height: 'calc(100vh - 120px)'
        }}>
          {/* Matches List */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '20px',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Conversations
            </h2>
            
            {matches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                  No conversations yet. Apply to campaigns to start messaging!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {matches.map((match) => {
                  const otherUser = getOtherUser(match);
                  return (
                    <div
                      key={match._id}
                      onClick={() => setSelectedMatch(match)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: selectedMatch?._id === match._id 
                          ? 'rgba(255,255,255,0.2)' 
                          : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedMatch?._id !== match._id) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedMatch?._id !== match._id) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {otherUser.firstName?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                            {otherUser.firstName} {otherUser.lastName}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                            {user?.userType === 'creator' ? 'Brand' : 'Creator'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {selectedMatch ? (
              <>
                {/* Chat Header */}
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {getOtherUser(selectedMatch).firstName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                      {getOtherUser(selectedMatch).firstName} {getOtherUser(selectedMatch).lastName}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                      {user?.userType === 'creator' ? 'Brand Partner' : 'Content Creator'}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1,
                  padding: '20px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                        Start a conversation! Send your first message below.
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMyMessage = message.sender._id === user?._id;
                      return (
                        <div
                          key={message._id}
                          style={{
                            display: 'flex',
                            justifyContent: isMyMessage ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div style={{
                            maxWidth: '70%',
                            padding: '12px 16px',
                            borderRadius: '18px',
                            background: isMyMessage 
                              ? 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)'
                              : 'rgba(255,255,255,0.2)',
                            color: 'white'
                          }}>
                            <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                              {message.content}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: 'rgba(255,255,255,0.6)',
                              marginTop: '4px'
                            }}>
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div style={{
                  padding: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={sendingMessage}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '25px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '25px',
                      border: 'none',
                      background: !newMessage.trim() || sendingMessage
                        ? 'rgba(255,255,255,0.2)'
                        : 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: !newMessage.trim() || sendingMessage ? 'not-allowed' : 'pointer',
                      opacity: !newMessage.trim() || sendingMessage ? 0.5 : 1
                    }}
                  >
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;