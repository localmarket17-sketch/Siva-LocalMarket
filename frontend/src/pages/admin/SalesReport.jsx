import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebarvd';
import './SalesReport.css'; // Optional: for styling if needed

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters and pagination
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customer, setCustomer] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

const fetchSalesReport = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/admin/sales-report', {
      withCredentials: true,
    });

    const responseData = res.data || {};
    const reportData = responseData.data || [];
    const reportSummary = responseData.summary || { totalOrders: 0, totalRevenue: 0 };

    setSalesData(reportData);
    setSummary({
      totalOrders: reportSummary.totalOrders,
      totalRevenue: Number(reportSummary.totalRevenue),
    });

  } catch (err) {
    console.error('Error fetching sales report:', err);
    setError('Failed to load sales report. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleExport = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/sales-report/export', {
        withCredentials: true,
        params: {
          start: startDate,
          end: endDate,
          customer,
        },
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales-report.csv';
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export report.');
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, [startDate, endDate, customer, page]);

  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label>
          From:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="ml-2 border p-1" />
        </label>
        <label>
          To:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="ml-2 border p-1" />
        </label>
        <input
          type="text"
          placeholder="Search Customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="border p-1"
        />
        <button onClick={handleExport} className="bg-green-600 text-white px-3 py-1 rounded">
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="mb-4 bg-gray-50 p-4 rounded shadow text-sm">
        <p><strong>Total Orders:</strong> {summary.totalOrders}</p>
        <p><strong>Total Revenue:</strong> ₹{summary.totalRevenue.toLocaleString()}</p>
      </div>

      {/* Error or loading */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Sales table */}
      {!loading && !error && salesData.length === 0 ? (
        <p className="text-gray-500">No sales found for selected filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow border rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border">Order ID</th>
                <th className="py-2 px-4 border">Customer</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Items</th>
                <th className="py-2 px-4 border">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{order.order_id}</td>
                  <td className="py-2 px-4 border">{order.customer_name}</td>
                  <td className="py-2 px-4 border">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">{order.items}</td>
                  <td className="py-2 px-4 border">₹{Number(order.total_amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded">
          Prev
        </button>
        <span className="px-2 pt-1">Page {page}</span>
        <button onClick={() => setPage(page + 1)} className="px-3 py-1 bg-gray-200 rounded">
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default SalesReport;
