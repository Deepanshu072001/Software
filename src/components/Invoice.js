import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Invoice.css';
import * as html2pdf from 'html2pdf.js';

const itemsList = [
  { "id": 1, "name": "Espresso", "category": "Beverage", "price": 100 },
  { "id": 2, "name": "Cappuccino", "category": "Beverage", "price": 130 },
  { "id": 3, "name": "Latte", "category": "Beverage", "price": 140 },
  { "id": 4, "name": "Americano", "category": "Beverage", "price": 120 },
  { "id": 5, "name": "Mocha", "category": "Beverage", "price": 150 },
  { "id": 6, "name": "Cold Coffee", "category": "Beverage", "price": 160 },
  { "id": 7, "name": "Iced Latte", "category": "Beverage", "price": 160 },
  { "id": 8, "name": "Green Tea", "category": "Beverage", "price": 90 },
  { "id": 9, "name": "Lemon Iced Tea", "category": "Beverage", "price": 100 },
  { "id": 10, "name": "Hot Chocolate", "category": "Beverage", "price": 150 },
  { "id": 11, "name": "Masala Chai", "category": "Beverage", "price": 80 },
  { "id": 12, "name": "Herbal Tea", "category": "Beverage", "price": 90 },
  { "id": 13, "name": "Filter Coffee", "category": "Beverage", "price": 70 },
  { "id": 14, "name": "Veg Sandwich", "category": "Food", "price": 120 },
  { "id": 15, "name": "Cheese Grilled Sandwich", "category": "Food", "price": 150 },
  { "id": 16, "name": "Paneer Wrap", "category": "Food", "price": 160 },
  { "id": 17, "name": "Chicken Wrap", "category": "Food", "price": 180 },
  { "id": 18, "name": "French Fries", "category": "Food", "price": 100 },
  { "id": 19, "name": "Peri Peri Fries", "category": "Food", "price": 120 },
  { "id": 20, "name": "Garlic Bread", "category": "Food", "price": 90 },
  { "id": 21, "name": "Cheesy Garlic Bread", "category": "Food", "price": 110 },
  { "id": 22, "name": "Veg Burger", "category": "Food", "price": 120 },
  { "id": 23, "name": "Chicken Burger", "category": "Food", "price": 150 },
  { "id": 24, "name": "Veg Puff", "category": "Food", "price": 50 },
  { "id": 25, "name": "Paneer Puff", "category": "Food", "price": 70 },
  { "id": 26, "name": "Samosa (2 pcs)", "category": "Food", "price": 40 },
  { "id": 27, "name": "Maggi Masala", "category": "Food", "price": 60 },
  { "id": 28, "name": "Pasta - Red Sauce", "category": "Main Course", "price": 180 },
  { "id": 29, "name": "Pasta - White Sauce", "category": "Main Course", "price": 180 },
  { "id": 30, "name": "Pizza Margherita", "category": "Main Course", "price": 200 },
  { "id": 31, "name": "Farmhouse Pizza", "category": "Main Course", "price": 250 },
  { "id": 32, "name": "Paneer Tikka Pizza", "category": "Main Course", "price": 260 },
  { "id": 33, "name": "Chicken Tandoori Pizza", "category": "Main Course", "price": 280 },
  { "id": 34, "name": "Mac & Cheese", "category": "Main Course", "price": 190 },
  { "id": 35, "name": "Club Sandwich", "category": "Main Course", "price": 170 },
  { "id": 36, "name": "Chocolate Brownie", "category": "Dessert", "price": 90 },
  { "id": 37, "name": "Choco Lava Cake", "category": "Dessert", "price": 110 },
  { "id": 38, "name": "Vanilla Ice Cream", "category": "Dessert", "price": 70 },
  { "id": 39, "name": "Chocolate Ice Cream", "category": "Dessert", "price": 80 },
  { "id": 40, "name": "Strawberry Sundae", "category": "Dessert", "price": 120 },
  { "id": 41, "name": "Muffin - Chocolate", "category": "Dessert", "price": 80 },
  { "id": 42, "name": "Muffin - Blueberry", "category": "Dessert", "price": 85 },
  { "id": 43, "name": "Donut - Glazed", "category": "Dessert", "price": 85 },
  { "id": 44, "name": "Donut - Chocolate", "category": "Dessert", "price": 90 },
  { "id": 45, "name": "Walnut Brownie", "category": "Dessert", "price": 100 },
  { "id": 46, "name": "Oreo Shake", "category": "Special Drink", "price": 160 },
  { "id": 47, "name": "KitKat Shake", "category": "Special Drink", "price": 170 },
  { "id": 48, "name": "Strawberry Shake", "category": "Special Drink", "price": 150 },
  { "id": 49, "name": "Mango Smoothie", "category": "Special Drink", "price": 150 },
  { "id": 50, "name": "Banana Shake", "category": "Special Drink", "price": 140 }

];

const Invoice = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedQty, setSelectedQty] = useState('');
  const [itemIdToQty, setItemIdToQty] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [discount, setDiscount] = useState(0); // flat discount amount
  const [billMeta, setBillMeta] = useState(null);
  const [existingBillId, setExistingBillId] = useState(null);

  const handleSelectItem = (e) => {
    setSelectedItemId(e.target.value);
    setSelectedQty('');
  };

  const handleSelectQty = (e) => {
    const qty = e.target.value;
    setSelectedQty(qty);

    if (selectedItemId && qty) {
      setItemIdToQty(prev => ({
        ...prev,
        [selectedItemId]: parseInt(qty)
      }));
      setSelectedItemId('');
      setSelectedQty('');
    }
  };

  const generateBill = async () => {
    if (!name || !phone) return alert("Please fill customer details");
    if (!tableNo) return alert("Please provide the table no.");

    const filtered = itemsList
      .filter(item => itemIdToQty[item.id] > 0)
      .map(item => ({
        item_name: item.name,
        quantity: itemIdToQty[item.id],
        price: item.price,
        amount: item.price * itemIdToQty[item.id],
      }));

    if (filtered.length === 0) return alert("Please select at least one item");

    const subtotal = filtered.reduce((acc, item) => acc + item.amount, 0);
    const sgst = subtotal * 0.025;
    const cgst = subtotal * 0.025;
    const totalBeforeDiscount = subtotal + sgst + cgst;
    const finalTotal = totalBeforeDiscount - discount;

    const { data, error } = await supabase.from('customers').insert({
      name,
      phone,
      table_no: tableNo,
      items: filtered,
      subtotal,
      sgst,
      cgst,
      discount,
      total: finalTotal,
    }).select('bill_no, bill_date');

    if (error) {
      console.error("Supabase error:", error);
      alert("Error saving bill!" + error.message);
    } else {
      alert("Bill saved!");
      setSelectedItems(filtered);
      setBillMeta(data[0]);
    }
  };

  const clearAll = () => {
    setName('');
    setPhone('');
    setTableNo('');
    setItemIdToQty({});
    setSelectedItems([]);
    setSelectedItemId('');
    setSelectedQty('');
    setBillMeta(null);
    setExistingBillId(null);
  };

  const subtotal = selectedItems.reduce((acc, item) => acc + item.amount, 0);
  const sgst = subtotal * 0.025;
  const cgst = subtotal * 0.025;
  const finalTotal = Math.max(0, subtotal + sgst + cgst - discount);


  const downloadPDF = () => {
    const element = document.querySelector(".bill-output");
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `Invoice_${name || "Customer"}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  const resumeHeldBill = async () => {
    if (!tableNo) return alert("Please select a table number to resume");

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('table_no', tableNo)
      .order('bill_date', { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error resuming bill:", error);
      alert("Failed to resume bill");
    } else if (data.length === 0) {
      alert("No held bill found for this table");
    } else {
      const bill = data[0];
      setName(bill.name);
      setPhone(bill.phone);
      setExistingBillId(bill.id);
      setBillMeta({ bill_no: bill.bill_no, bill_date: bill.bill_date });
      setSelectedItems(bill.items);

      // Convert item list into ID-Qty mapping
      const qtyMap = {};
      bill.items.forEach((item) => {
        const found = itemsList.find(i => i.name === item.item_name);
        if (found) {
          qtyMap[found.id] = item.quantity;
        }
      });
      setItemIdToQty(qtyMap);
    }
  };

  return (
    <div className="main-content">
      <div className="invoice">
      <h2> MuglyCafe (Dehradun)</h2>
      <p>Contact: +91-7302358896</p>
      <p>GST: 05ABAFG6063E1AE</p>
      <hr />

      <div className="no-print">
        <div className="form-section">
          <label>Name: <input value={name} onChange={e => setName(e.target.value)} /></label>
          <label>Phone: <input value={phone} onChange={e => setPhone(e.target.value)} /></label>
          <label>Discount (₹): 
      <input
        type="number"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
        placeholder="Enter discount amount"
        className="input-field"
      />
    </label>
        </div>

        <div className="form-section">
          <h4>Select Items</h4>
          <div className="selectors">
            <select value={selectedItemId} onChange={handleSelectItem}>
              <option value="">-- Choose an item --</option>
              {itemsList.map(item => (
                <option
                  key={item.id}
                  value={item.id}
                  disabled={itemIdToQty.hasOwnProperty(item.id)}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <select value={selectedQty} onChange={handleSelectQty} disabled={!selectedItemId}>
              <option value="">-- Select Quantity --</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="selected-items">
            {Object.entries(itemIdToQty).map(([id, qty]) => {
              const item = itemsList.find(i => i.id === parseInt(id));
              return (
                <div key={id} className="item-row">
                  <span>{item.name}</span>
                  <span>
                    Qty: {qty}
                    <button onClick={() => {
                      setItemIdToQty(prev => ({
                        ...prev,
                        [id]: prev[id] + 1
                      }));
                    }}>+</button>
                    <button onClick={() => {
                      setItemIdToQty(prev => {
                        const newQty = prev[id] - 1;
                        if (newQty <= 0) {
                          const { [id]: _, ...rest } = prev;
                          return rest;
                        }
                        return { ...prev, [id]: newQty };
                      });
                    }}>-</button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-section">
          <label>Table No:
            <select value={tableNo} onChange={e => setTableNo(e.target.value)}>
              <option value="">-- Select Table --</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>Table {num}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="button-group">
          <button onClick={generateBill}>Generate Bill</button>
          <button onClick={clearAll}>Clear</button>
          <button onClick={resumeHeldBill}>Hold Bills</button>
          <button onClick={() => navigate('/history')}>View Order History</button>
          <button onClick={() => navigate('/held-bills')}>View Hold Bills</button>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="bill-output">
          <h3>Bill No: {billMeta?.bill_no || '-'}</h3>
          <p>Date: {billMeta?.bill_date ? new Date(billMeta.bill_date).toLocaleString() : '-'}</p>
          <p>Table No: {tableNo}</p>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Sub Total: ₹{subtotal}</p>
          <p>SGST 2.5%: ₹{sgst.toFixed(2)}</p>
          <p>CGST 2.5%: ₹{cgst.toFixed(2)}</p>
          <p>Discount: ₹{discount.toFixed(2)}</p>
          <p><strong>Total: ₹{finalTotal.toFixed(2)}</strong></p>
          <p>Thank you for visiting MuglyCafe!</p>
          <p>Thank you!!</p>

          <div className="button-group no-print">
            <button onClick={() => window.print()}>Print Receipt</button>
            <button onClick={downloadPDF}>Download PDF</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Invoice;