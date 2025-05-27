import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

function ZReport() {
  console.log("ZReport component loaded"); // Debug check

  const [filterType, setFilterType] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDateRange = () => {
    const date = new Date(startDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    switch (filterType) {
      case 'daily': return { from: new Date(year, month, date.getDate()), to: new Date(year, month, date.getDate() + 1) };
      case 'monthly': return { from: new Date(year, month, 1), to: new Date(year, month + 1, 1) };
      case 'quarterly': {
        const q = Math.floor(month / 3) * 3;
        return { from: new Date(year, q, 1), to: new Date(year, q + 3, 1) };
      }
      case 'halfyear': {
        const h = month < 6 ? 0 : 6;
        return { from: new Date(year, h, 1), to: new Date(year, h + 6, 1) };
      }
      case 'yearly': return { from: new Date(year, 0, 1), to: new Date(year + 1, 0, 1) };
      default: return { from: null, to: null };
    }
  };

  const fetchData = async () => {
    if (!startDate) return alert("Select a date to continue.");
    const { from, to } = getDateRange();
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .gte('bill_date', from.toISOString())
      .lt('bill_date', to.toISOString());
    setLoading(false);
    if (error) {
      alert('Error fetching data');
      console.error(error);
    } else {
      setData(data);
    }
  };

  const totalAmount = data.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = data.length;
  const paymentSummary = {};
  data.forEach(order => {
    const method = order.payment_method || 'Unknown';
    paymentSummary[method] = (paymentSummary[method] || 0) + order.total;
  });

  const exportXLSX = () => {
    const sheet = XLSX.utils.json_to_sheet(data.map(d => ({
      Date: new Date(d.bill_date).toLocaleDateString(),
      Name: d.name,
      Phone: d.phone,
      PaymentMethod: d.payment_method,
      Total: d.total
    })));
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "ZReport");
    XLSX.writeFile(book, "Z_Report.xlsx");
  };

  const exportCSV = () => {
    const csv = Papa.unparse(
      data.map(d => ({
        Date: new Date(d.bill_date).toLocaleDateString(),
        Name: d.name,
        Phone: d.phone,
        PaymentMethod: d.payment_method,
        Total: d.total
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Z_Report.csv';
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const rows = data.map(d => [
      new Date(d.bill_date).toLocaleDateString(),
      d.name,
      d.phone,
      d.payment_method,
      d.total
    ]);
    doc.autoTable({
      head: [['Date', 'Name', 'Phone', 'Payment', 'Total']],
      body: rows,
    });
    doc.save('Z_Report.pdf');
  };

  return (
    <div className="invoice" style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>Z Report</h2>
      <div className="form-section">
        <label>Report Type:</label>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="halfyear">Half-Yearly</option>
          <option value="yearly">Yearly</option>
        </select>

        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

        <button onClick={fetchData} disabled={loading}>
          {loading ? "Loading..." : "Generate Report"}
        </button>
      </div>

      {data.length > 0 && (
        <div className="order-list">
          <h3>Summary</h3>
          <p>Total Orders: {totalOrders}</p>
          <p>Total Sales: ₹{totalAmount.toFixed(2)}</p>
          <h4>By Payment Method</h4>
          <ul>
            {Object.entries(paymentSummary).map(([method, amount]) => (
              <li key={method}>{method}: ₹{amount.toFixed(2)}</li>
            ))}
          </ul>

          <div className="export-buttons" style={{ marginTop: 20 }}>
            <button onClick={exportPDF}>Export to PDF</button>
            <button onClick={exportCSV}>Export to CSV</button>
            <button onClick={exportXLSX}>Export to XLSX</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZReport;
