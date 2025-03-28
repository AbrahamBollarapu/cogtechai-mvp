import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await axios.post('http://localhost:5000/api/ask', {
        prompt: prompt,
      });
      setResponse(res.data.response);
      fetchHistory(); // Refresh history after submission
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    fetchHistory(); // Load history on page load
  }, []);

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>CogTechAI Prompt Tester</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          cols="60"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Submit'}
        </button>
      </form>

      {response && <p><strong>AI Response:</strong> {response}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Prompt History</h2>
      {history.length === 0 ? (
        <p>No prompt history yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: '10px', width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Prompt</th>
              <th>Response</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.prompt}</td>
                <td>{entry.response}</td>
                <td>{new Date(entry.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

