import React, { useState } from 'react';

const AIChatPanel = () => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      setHistory((prev) => [
        ...prev,
        {
          prompt,
          response: data.response,
          timestamp: new Date().toISOString(),
        },
      ]);
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAsCSV = () => {
    const csv = ['Prompt,Response,Timestamp'];
    history.forEach((item) => {
      csv.push(
        `"${item.prompt.replace(/"/g, '""')}","${item.response.replace(/"/g, '""')}","${item.timestamp}"`
      );
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ai_prompt_history.csv';
    link.click();
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">🧠 CogTechAI Prompt Assistant</h1>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>

        {isLoading && (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Thinking...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {history.map((item, index) => (
            <div key={index}>
              <div className="bg-blue-100 text-blue-900 p-3 rounded-lg mb-1 max-w-md ml-auto text-right">
                <strong>You:</strong> {item.prompt}
              </div>
              <div className="bg-gray-200 text-gray-900 p-3 rounded-lg max-w-md">
                <strong>AI:</strong> {item.response}
              </div>
              <div className="text-xs text-gray-400 text-right mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <button onClick={downloadAsCSV} className="text-sm underline text-blue-600">
            Export CSV
          </button>
          <button onClick={clearHistory} className="text-sm underline text-red-500">
            Clear History
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;

