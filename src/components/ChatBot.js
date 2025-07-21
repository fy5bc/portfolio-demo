import React, { useState } from 'react';
import './ChatBot.css';

const quickPrompts = [
  'Hello!',
  'Tell me a joke.',
  'What can you do?'
];

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text) return;
    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: process.env.REACT_APP_PROMPT_ID || '' },
            ...newMessages
          ]
        })
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No response';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error fetching response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
    }
  };

  return (
    <div className="chatbot-container">
      <div className="quick-prompts">
        {quickPrompts.map((p, i) => (
          <button key={i} className="prompt-bubble" onClick={() => sendMessage(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>{m.content}</div>
        ))}
        {loading && <div className="loading" />}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;
