import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import './HeldBills.css';

const HeldBills = () => {
  const [tableNo, setTableNo] = useState('');
  const [heldBills, setHeldBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [tableOptions, setTableOptions] = useState([]);

  const fetchTableNumbers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('table_no')
      .neq('table_no', null)
      .order('table_no', { ascending: true });

    if (!error && data) {
      const uniqueTables = [...new Set(data.map((item) => item.table_no))];
      setTableOptions(uniqueTables);
    }
  };

  const fetchHeldBills = useCallback(async () => {
    if (!tableNo) {
      setHeldBills([]);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('table_no', tableNo)
      .order('bill_date', { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Failed to fetch held bills", error);
      alert("Error fetching bills");
    } else {
      setHeldBills(data);
    }
  }, [tableNo]);

  useEffect(() => {
    fetchTableNumbers();
  }, []);

  useEffect(() => {
    fetchHeldBills();
  }, [fetchHeldBills]);

  const handleMarkAsPaid = async (billNo) => {
    const { error } = await supabase
      .from('customers')
      .update({ is_paid: true, status: 'paid' })
      .eq('bill_no', billNo);

    if (error) {
      alert('Failed to mark as paid');
      console.error("Supabase error:", error);
    } else {
      alert('Marked as paid successfully');
      fetchHeldBills(); 
    }
  };

  const filteredBills = heldBills.filter((bill) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return bill.status !== 'paid';
    if (statusFilter === 'paid') return bill.status === 'paid';
    return true;
  });

  return (
    <div className="held-bills">
      <h2 className="text-2xl font-bold mb-4">Hold Bills by Table</h2>

      <div className="filters flex gap-6 mb-4">
        <div>
          <label className="block font-semibold mb-1">Filter by Table Number:</label>
          <select
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            className="border p-2 rounded w-48"
          >
            <option value="">Select Table</option>
            {tableOptions.map((table, i) => (
              <option key={i} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Filter by Payment Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded w-48"
          >
            <option value="all">All</option>
            <option value="pending">Pending Only</option>
            <option value="paid">Paid Only</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && filteredBills.length === 0 && tableNo && (
        <p>No bills found for table <strong>{tableNo}</strong> with selected filter.</p>
      )}

      {!loading && filteredBills.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="border p-2">Bill No</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Table No</th>
                <th className="border p-2">Payment</th>
                <th className="border p-2">Item</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill, billIndex) => (
                bill.items.map((item, itemIndex) => (
                  <tr key={`${bill.bill_no}-${itemIndex}`} className="hover:bg-gray-50">
                    {itemIndex === 0 && (
                      <>
                        <td className="border p-2" rowSpan={bill.items.length}>{bill.bill_no}</td>
                        <td className="border p-2" rowSpan={bill.items.length}>{new Date(bill.bill_date).toLocaleString()}</td>
                        <td className={`border p-2 font-semibold ${bill.status === 'paid' ? 'text-green-600' : 'text-red-600'}`} rowSpan={bill.items.length}>
                          {bill.status}
                        </td>
                        <td className="border p-2" rowSpan={bill.items.length}>{bill.name}</td>
                        <td className="border p-2" rowSpan={bill.items.length}>{bill.phone}</td>
                        <td className="border p-2" rowSpan={bill.items.length}>{bill.table_no}</td>
                        <td className="border p-2" rowSpan={bill.items.length}>{bill.payment_method || '-'}</td>
                      </>
                    )}
                    <td className="border p-2">{item.item_name}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">₹{item.price.toFixed(2)}</td>
                    <td className="border p-2">₹{item.amount.toFixed(2)}</td>
                    {itemIndex === 0 && (
                      <>
                        <td className="border p-2 font-bold text-right text-green-700" rowSpan={bill.items.length}>
                          ₹{bill.total.toFixed(2)}
                        </td>
                        <td className="border p-2" rowSpan={bill.items.length}>
                          {bill.status !== 'paid' && (
                            <button
                              onClick={() => handleMarkAsPaid(bill.bill_no)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              Mark as Paid
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HeldBills;
