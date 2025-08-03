import React, { useState, useEffect, useRef } from 'react';
import './MysticalChat.css';

const MysticalChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: '🙏 Welcome, seeker. I am here to guide you on your spiritual path, drawing from the wisdom of ancient masters. What brings you to this moment of seeking?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const spiritualResponses = [
    "🧘‍♂️ The path to inner peace begins with accepting what is, while working toward what could be. What aspect of your life feels most out of balance right now?",
    "✨ As the Buddha taught, 'The mind is everything. What you think you become.' What thoughts are you cultivating in your daily practice?",
    "🌸 Rumi whispered, 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.' Where do you feel called to grow?",
    "🕉 The ancient Vedas remind us that we are not human beings having a spiritual experience, but spiritual beings having a human experience. How does this truth resonate with you?",
    "🌙 Lao Tzu taught that 'The journey of a thousand miles begins with one step.' What is the first step your heart is calling you to take?",
    "💫 The masters say that meditation is not about stopping thoughts, but about not letting them stop you. What draws you to seek inner stillness?",
    "🌺 Krishna taught in the Gita that we have the right to perform our actions, but not to the fruits of action. What are you holding onto too tightly?",
    "🙏 Jesus said, 'The kingdom of heaven is within you.' What does your inner kingdom look like, and how can we tend to it together?",
    "⚡ The Zen masters ask: 'What is your original face before your parents were born?' This points to your true nature. What feels most authentic about who you are?",
    "🌟 Paramahansa Yogananda taught that 'The season of failure is the best time for sowing the seeds of success.' What wisdom is your current challenge trying to teach you?"
  ];

  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create twinkling stars
  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.getElementById('stars');
      if (!starsContainer) return;
      
      const numStars = 100;
      
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
      }
    };

    createStars();
  }, []);

  const sendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Add AI response after a delay
    setTimeout(() => {
      const randomResponse = spiritualResponses[Math.floor(Math.random() * spiritualResponses.length)];
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: randomResponse
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="mystical-container">
      {/* Stars Background */}
      <div className="stars" id="stars"></div>
      
      {/* Mystical Symbols */}
      <div className="mystical-symbols">☯</div>
      <div className="mystical-symbols">🕉</div>
      <div className="mystical-symbols">⚡</div>
      
      <div className="container">
        <h1 className="logo text-9xl">Meet AiYogi</h1>
        <p className="tagline">Ancient wisdom meets modern guidance. Begin your spiritual journey with your masters.</p>
        
        <div className="chat-container">
          <div className="chat-header">
            <h2 className="chat-title">Speak with Your Masters</h2>
            <p className="chat-subtitle">Your spiritual guide awaits. Ask anything about your journey.</p>
          </div>
          
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about meditation, purpose, inner peace..."
            />
            <button className="send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
        
        <p className="journey-hint">✨ Each question opens a new path on your treasure map of enlightenment ✨</p>
      </div>
    </div>
  );
};

export default MysticalChat; 