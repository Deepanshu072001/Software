import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filterType, setFilterType] = useState('date');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('detailed');

  const fetchOrders = async () => {
    if (!startDate && filterType !== 'all') return alert("Please select a start date");

    setLoading(true);
    let query = supabase.from('customers').select('*');

    if (filterType === 'date' && startDate) {
      const fromDate = new Date(startDate);
      const toDate = new Date(startDate);
      toDate.setDate(toDate.getDate() + 1);
      query = query
        .gte('bill_date', fromDate.toISOString())
        .lt('bill_date', toDate.toISOString());
    } else if (filterType === 'range' && startDate && endDate) {
      const fromDate = new Date(startDate);
      const toDate = new Date(endDate);
      toDate.setDate(toDate.getDate() + 1);
      query = query
        .gte('bill_date', fromDate.toISOString())
        .lt('bill_date', toDate.toISOString());
    } else if (filterType === 'month' && startDate) {
      const date = new Date(startDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const fromDate = new Date(year, month, 1).toISOString();
      const toDate = new Date(year, month + 1, 1).toISOString();
      query = query.gte('bill_date', fromDate).lt('bill_date', toDate);
    }

    const { data, error } = await query.order('bill_date', { ascending: false });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error fetching orders");
    } else {
      const parsedOrders = data.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      }));
      setOrders(parsedOrders);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const rows = [];

    orders.forEach((order) => {
      const row = [
        new Date(order.bill_date).toLocaleDateString(),
        order.bill_no,
        order.total,
      ];
      rows.push(row);
    });

    doc.autoTable({
      head: [['Date', 'Bill No', 'Total']],
      body: rows,
    });

    doc.save('OrderHistory.pdf');
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(
      orders.map(order => ({
        Date: new Date(order.bill_date).toLocaleDateString(),
        BillNo: order.bill_no,
        Total: order.total
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "OrderHistory.csv";
    link.click();
  };

  const exportToXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      orders.map(order => ({
        Date: new Date(order.bill_date).toLocaleDateString(),
        BillNo: order.bill_no,
        Total: order.total
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OrderHistory");
    XLSX.writeFile(workbook, "OrderHistory.xlsx");
  };

  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="invoice fade-in">
      <h2>Order History</h2>

      {/* Filter Section */}
      <div className="form-section">
        <div className="filter-group">
          <label>
            <i className="bi bi-filter-circle-fill" style={{ marginRight: 8 }}></i>Filter By:
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="date">By Date</option>
              <option value="range">Between Dates</option>
              <option value="month">By Month</option>
            </select>
          </label>

          <label>
            Start Date:
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </label>

          {(filterType === 'range') && (
            <label>
              End Date:
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </label>
          )}

          <button onClick={fetchOrders} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Orders'}
          </button>
        </div>
      </div>

      {/* View Toggle */}
      {orders.length > 0 && (
        <>
          <div className="export-buttons">
            <button onClick={exportToPDF}>Export to PDF</button>
            <button onClick={exportToCSV}>Export to CSV</button>
            <button onClick={exportToXLSX}>Download as XLSX</button>
            <button onClick={() => setViewMode(viewMode === 'detailed' ? 'summary' : 'detailed')}>
              {viewMode === 'detailed' ? 'Switch to Summary View' : 'Switch to Detailed View'}
            </button>
          </div>

          <div className="order-list">
            {orders.map((order, idx) => (
              <div key={idx} className="item-row">
                <p><strong>Date:</strong> {new Date(order.bill_date).toLocaleString()}</p>
                <p><strong>Bill No:</strong> {order.bill_no}</p>
                {viewMode === 'detailed' && (
                  <>
                    <ul>
                      {order.items.map((item, i) => (
                        <li key={i}>{item.item_name} × {item.quantity} - ₹{item.amount}</li>
                      ))}
                    </ul>
                  </>
                )}
                <p><strong>Total:</strong> ₹{order.total}</p>
              </div>
            ))}

            {viewMode === 'summary' && (
              <div className="summary-footer">
                <p><strong>Total Orders:</strong> {totalOrders}</p>
                <p><strong>Total Amount Sold:</strong> ₹{totalAmount}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistory;
