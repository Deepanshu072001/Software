import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { supabase } from '../supabaseClient';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    paidBills: 0,
    pendingBills: 0,
    paymentStats: {},
    itemSales: [],
    recentOrders: []
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) return;

    const totalOrders = data.length;
    const totalRevenue = data.reduce((sum, d) => sum + d.total, 0);
    const paidBills = data.filter(d => d.status === 'paid').length;
    const pendingBills = data.filter(d => d.status !== 'paid').length;

    const paymentStats = {};
    const itemMap = {};

    data.forEach(d => {
      const method = d.payment_method || 'Unknown';
      paymentStats[method] = (paymentStats[method] || 0) + d.total;

      d.items?.forEach(item => {
        itemMap[item.item_name] = (itemMap[item.item_name] || 0) + item.quantity;
      });
    });

    const itemSales = Object.entries(itemMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, qty]) => ({ label, qty }));

    const recentOrders = data
      .sort((a, b) => new Date(b.bill_date) - new Date(a.bill_date))
      .slice(0, 5);

    setStats({
      totalOrders,
      totalRevenue,
      paidBills,
      pendingBills,
      paymentStats,
      itemSales,
      recentOrders
    });
  };

  const summaryCards = [
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Total Revenue", value: `₹${stats.totalRevenue.toFixed(2)}` },
    { label: "Paid Bills", value: stats.paidBills },
    { label: "Pending Bills", value: stats.pendingBills },
  ];

  const barData = {
    labels: stats.itemSales.map(i => i.label),
    datasets: [
      {
        label: 'Top Selling Items',
        data: stats.itemSales.map(i => i.qty),
        backgroundColor: '#3498db',
      }
    ]
  };

  const pieData = {
    labels: Object.keys(stats.paymentStats),
    datasets: [{
      data: Object.values(stats.paymentStats),
      backgroundColor: ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'],
      hoverOffset: 8
    }]
  };

  const navigate = useNavigate();

const handleLogout = () => {
  // Optional: clear auth tokens or session
  // localStorage.removeItem('user');
  navigate('/auth');
};


  return (
    <div className="dashboard-container">
      <header style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1>Welcome to MuglyCafe Dashboard</h1>
        <h2>Current Time: {currentTime.toLocaleTimeString()}</h2>
        <h3> @Powered by PS Paper Tech Solution</h3>

      </header>

      <div className="summary-grid">
        {summaryCards.map((card, index) => (
          <div className="summary-card" key={index}>
            <h3>{card.label}</h3>
            <p>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="cards-grid">
        {[
          { title: 'Invoice', desc: 'Create bills', icon: '🧾', route: 'invoice' },
          { title: 'Order History', desc: 'View past orders', icon: '📜', route: 'orderHistory' },
          { title: 'Edit Pending Order', desc: 'View Pending / Paid Orders', icon: '🧊', route: 'holdBills' },
          { title: 'Report', desc: 'Generate reports', icon: '📊', route: 'report' },
        ].map((card, index) => (
          <div key={index} className="card" onClick={() => onNavigate(card.route)}>
            <div className="icon-wrapper" style={{ fontSize: 40 }}>{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="chart-panels">
        <div className="chart-box">
          <h3 style={{ textAlign: 'center' }}>💳 Payment Methods</h3>
          <Pie data={pieData} />
        </div>

        <div className="chart-box">
          <h3 style={{ textAlign: 'center' }}>📈 Top Items</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <div className="recent-orders">
        <h3>🕘 Recent Bills</h3>
        <ul>
          {stats.recentOrders.map((order, i) => (
            <li key={i}>
              <span><strong>#{order.bill_no}</strong></span>
              <span>{new Date(order.bill_date).toLocaleString()}</span>
              <span>₹{order.total.toFixed(2)}</span>
              <span className={order.status === 'paid' ? 'status-paid' : 'status-pending'}>
                {order.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .chart-panels {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          margin: 40px 0;
        }
        .chart-box {
          width: 100%;
          max-width: 400px;
          background: #f9f9f9;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .recent-orders {
          max-width: 800px;
          margin: auto;
        }
        .recent-orders ul {
          list-style: none;
          padding: 0;
        }
        .recent-orders li {
          display: grid;
          grid-template-columns: 100px 1fr 100px 80px;
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .status-paid {
          color: green;
          font-weight: bold;
        }
        .status-pending {
          color: red;
          font-weight: bold;
        }

        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding: 0 20px;
          }

        .logout-button {
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 8px 16px;
        background-color:rgb(16, 53, 140);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        height: 40px;
        z-index: 999;
}
      `}</style>
    </div>
  );
};

export default Dashboard;
