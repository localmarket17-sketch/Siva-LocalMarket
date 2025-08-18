// src/pages/customer/Support.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/button';

const Support = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/support/user/${user.id}`);
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTickets();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.post('/api/support', {
        user_id: user.id,
        message: query,
      });
      setQuery('');
      setTickets((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Error submitting support query:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Customer Support</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows="4"
          className="w-full p-3 border rounded mb-2"
          placeholder="Describe your issue or query..."
        ></textarea>
        <Button type="submit">Submit Query</Button>
      </form>

      <h3 className="text-xl font-medium mb-2">Your Past Queries</h3>
      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>No support queries found.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="border p-4 rounded shadow">
              <p><strong>Query:</strong> {ticket.message}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              {ticket.response && (
                <p className="mt-2 text-green-600"><strong>Response:</strong> {ticket.response}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Submitted on: {new Date(ticket.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Support;
