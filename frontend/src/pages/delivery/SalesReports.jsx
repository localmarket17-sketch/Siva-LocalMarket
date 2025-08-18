// src/pages/deliveryboy/SalesReports.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebarvd from '../../components/Sidebarvd';
import './SalesReports.css';

const SalesReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('/api/delivery/sales-reports', { withCredentials: true });
        setReports(res.data);
      } catch (err) {
        console.error('Failed to fetch reports', err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebarvd role="delivery" />
      <div className="deliveryboy-page">
        <h2>Sales Reports</h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Deliveries</th>
              <th>Total Earnings</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => (
              <tr key={i}>
                <td>{report.date}</td>
                <td>{report.total_deliveries}</td>
                <td>₹{report.total_earnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReports;
