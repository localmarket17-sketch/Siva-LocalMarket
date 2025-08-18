import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Sidebarvd from '../../components/Sidebarvd';
import './SalesReport.css';

const SalesReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesReport();
  }, []);

  const fetchSalesReport = async () => {
    try {
      const res = await axios.get('/api/vendor/sales-report', {
        withCredentials: true,
      });
      setReport(res.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = report.reduce((sum, item) => sum + item.totalSales, 0);
  const totalUnits = report.reduce((sum, item) => sum + item.totalQuantity, 0);

  return (
    <div className="vendor-sales-report-layout">
      <Sidebarvd role="vendor" />
      <div className="vendor-sales-report-container">
        <h2 className="page-heading">📊 Sales Report</h2>

        {loading ? (
          <p className="text-gray-500">Loading sales report...</p>
        ) : report.length === 0 ? (
          <p className="text-gray-500">No sales data available.</p>
        ) : (
          <>
            <div className="stats-cards">
              <div className="card">
                <h3>Total Revenue</h3>
                <p>₹{Number(totalRevenue || 0).toFixed(2)}</p>
              </div>
              <div className="card">
                <h3>Units Sold</h3>
                <p>{totalUnits}</p>
              </div>
              <div className="card">
                <h3>Products</h3>
                <p>{report.length}</p>
              </div>
            </div>

            <div className="chart-container">
              <h3>Product-wise Sales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalSales" fill="#34d399" name="Total Sales (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
