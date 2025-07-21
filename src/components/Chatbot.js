import React, { useState } from 'react';
import { Container, Button, Form, Card } from 'react-bootstrap';

const presetQuestions = [
  'Can you introduce the school?',
  "Where's the toilet?",
  'What time does school finish?'
];

// Placeholder for spreadsheet data
const infoData = {
  'introduce': 'Welcome to our primary school! We foster a love of learning in every child.',
  'toilet': 'The toilets are located next to the main office on the ground floor.',
  'finish': 'Classes normally finish at 3:30 PM.'
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    const userText = text || input;
    if (!userText.trim()) return;
    setMessages([...messages, { from: 'user', text: userText }]);
    setInput('');

    // Quick replies from spreadsheet placeholder
    const key = userText.toLowerCase();
    if (key.includes('introduce')) {
      setMessages((m) => [...m, { from: 'bot', text: infoData['introduce'] }]);
      return;
    }
    if (key.includes('toilet')) {
      setMessages((m) => [...m, { from: 'bot', text: infoData['toilet'] }]);
      return;
    }
    if (key.includes('finish')) {
      setMessages((m) => [...m, { from: 'bot', text: infoData['finish'] }]);
      return;
    }

    // Fallback to ChatGPT API
    try {
      setLoading(true);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userText }]
        })
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I did not understand that.';
      setMessages((m) => [...m, { from: 'bot', text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { from: 'bot', text: 'Error contacting assistant.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: '600px', marginTop: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        {presetQuestions.map((q) => (
          <Button key={q} variant="outline-primary" onClick={() => handleSend(q)}>
            {q}
          </Button>
        ))}
      </div>
      <Card style={{ height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        <Card.Body>
          {messages.map((m, idx) => (
            <div key={idx} style={{ textAlign: m.from === 'user' ? 'right' : 'left' }}>
              <b>{m.from === 'user' ? 'You' : 'Bot'}:</b> {m.text}
            </div>
          ))}
          {loading && <div>Loading...</div>}
        </Card.Body>
      </Card>
      <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        <Form.Control
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
      </Form>
    </Container>
  );
};

export default Chatbot;
