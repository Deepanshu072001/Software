import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Invoice.css';
import * as html2pdf from 'html2pdf.js';


const itemsList = [
      {"id": 1, "name": "Espresso", "SmallPrice": 99, "LargePrice": 149, category:  "Hot Beverage" },
      {"id": 2, "name": "Cappuccino", "SmallPrice": 160, "LargePrice": 180, category:  "Hot Beverage"},
      {"id": 3, "name": "Café Latte", "SmallPrice": 160, "LargePrice": 180 , category:  "Hot Beverage"},
      {"id": 4, "name": "Café Mocha", "SmallPrice": 175, "LargePrice": 0, category:  "Hot Beverage"},
      {"id": 5, "name": "Americano", "SmallPrice": 149, "LargePrice": 0, category:  "Hot Beverage"},
      {"id": 6, "name": "Irish Coffee", "SmallPrice": 160, "LargePrice": 0, category:  "Hot Beverage"},
      {"id": 7, "name": "Masala Tea", "SmallPrice": 60, "LargePrice": 0, category:  "Hot Beverage"},
      {"id": 8, "name": "Honey Ginger Lemon Tea", "SmallPrice": 60, "LargePrice": 0, category:  "Hot Beverage"},
      {"id": 9, "name": "Green Tea", "SmallPrice": 60, "LargePrice": 0, category:  "Hot Beverage"},
      {"id": 10, "name": "Hazelnut", "Price": 180 , category: "(Flavour Cappuccino/Latte)" },
      {"id": 11, "name": "Vanilla", "Price": 180, category: "(Flavour Cappuccino/Latte)" },
      {"id": 12, "name": "Irish", "Price": 180, category: "(Flavour Cappuccino/Latte)" },
      {"id": 13, "name": "Caramel", "Price": 180 , category: "(Cappuccino/Latte)" },
      {"id": 14, "name": "Red Velvet", "Price": 180, category: "(Cappuccino/Latte)" },
      {"id": 15, "name": "Cinnamon", "Price": 180, category: "(Cappuccino/Latte)" },
      {"id": 16, "name": "Butter Scotch", "Price": 180, category: "(Cappuccino/Latte)" },
      {"id": 17, "name": "Classic Hot Chocolate", "Price": 180, category: "Hot Chocolate" },
      {"id": 18, "name": "Hazelnut", "Price": 180 , category: "Hot Chocolate"},
      {"id": 19, "name": "Vanilla", "Price": 180 , category: "Hot Chocolate"},
      {"id": 20, "name": "Irish", "Price": 180 , category: "Hot Chocolate"},
      {"id": 21, "name": "Caramel", "Price": 180, category: "Hot Chocolate" },
      {"id": 22, "name": "Red Velvet", "Price": 180, category: "Hot Chocolate" },
      {"id": 23, "name": "Cinnamon", "Price": 180, category: "Hot Chocolate" },
      {"id": 24, "name": "Butter Scotch", "Price": 180 , category: "Hot Chocolate"},
      {"id": 25, "name": "Ice Americano", "Price": 149 , category: "Cold Beverage" },
      {"id": 26, "name": "Ice Latte", "Price": 160, category: "Cold Brew" },
      {"id": 27, "name": "Café Frappe", "Price": 160 , category: "Cold Brews" },
      {"id": 28, "name": "Hazelnut", "Price": 180, category: "Cold Brews" },
      {"id": 29, "name": "Hazelnut", "Price": 180 , category: "Cold Brews" },    
      {"id": 30, "name": "Vanilla", "Price": 180 , category:   "Cold Brews" },
      {"id": 31, "name": "Irish", "Price": 180, category: "Cold Brews" },
      {"id": 32, "name": "Caramel", "Price": 180, category: "Cold Brews" },
      {"id": 33, "name": "Red Velvet", "Price": 180, category: "Cold Brews" },
      {"id": 34, "name": "Cinnamon", "Price": 180, category: "Cold Brews" },
      {"id": 35, "name": "Butter Scotch", "Price": 180, category: "Cold Brews"},
      {"id": 36, "name": "Blue Lagoon", "Price": 180 , category: "Mocktails" },
      {"id": 37, "name": "Mint Mojito", "Price": 180 , category: "Mocktails" },
      {"id": 38, "name": "Peach", "Price": 180, category: "Mocktails" },
      {"id": 39, "name": "Green Apple", "Price": 180, category: "Mocktails" },
      {"id": 40, "name": "Cranberry Watermelon", "Price": 180, category: "Mocktails" },
      {"id": 41, "name": "Spice Orange Peach", "Price": 180, category: "Mocktails" },
      {"id": 42, "name": "Fruit Punch", "Price": 180, category: "Mocktails" },
      {"id": 43, "name": "Blue Ocean", "Price": 180 , category: "Mocktails" },
      {"id": 44, "name": "Lemon", "Price": 149,category: "Ice Tea" },
      {"id": 45, "name": "Peach", "Price": 149, category: "Ice Tea" },
      {"id": 46, "name": "Watermelon", "Price": 149, category: "Ice Tea" },
      {"id": 47, "name": "Cucumber", "Price": 149, category: "Ice Tea" },
      {"id": 48, "name": "Cranberry", "Price": 149 , category: "Ice Tea" },
      {"id": 49, "name": "Fresh Lime Water", "Price": 140 , category: "Lemonades"},
      {"id": 50, "name": "Fresh Lime Soda", "Price": 140 , category: "Lemonades"},
      {"id": 51, "name": "Mugly Shikanji", "Price": 140 , category: "Lemonades"},
      {"id": 52, "name": "Pink Lemonade", "Price": 140 , category: "Lemonades"},
      {"id": 53, "name": "Chatpata Jamun", "Price": 140 , category: "Lemonades"},
      {"id": 54, "name": "Soft Drink", "Price": 60, category: "Other Drinks"},
      {"id": 55, "name": "Red Bull", "Price": 140 , category: "Other Drinks"},
      {"id": 56, "name": "Mugly Crush", "Price": 160, category: "Other Drinks"},
      {"id": 57, "name": "MixBerry Green Apple",  "Price": 160, category: "Mugly Crush"},
      {"id": 58, "name": "Strawberry Mango", "Price": 160, category: "Mugly Crush"},
      {"id": 59, "name": "Mango", "Price": 160, category: "Mugly Crush"},
      {"id": 60, "name": "Blue Ocin Mojito", "Price": 160, category: "Mugly Crush"},
      {"id": 61, "name": "Wallnut Browanie", "Price": 190, category:"Shakes" },
      {"id": 62, "name": "Oreao", "Price": 190, category:"Shakes" },
      {"id": 63, "name": "Kitkat", "Price": 190, category:"Shakes" },
      {"id": 64, "name": "Red Velvet", "Price": 190 , category: "Shakes" },
      {"id": 65, "name": "Mango Colada", "Price": 190 , category:" Shakes" },
      {"id": 66, "name": "Berry Blast", "Price": 190 , category: "Shakes" },
      {"id": 67, "name": "Strawberry Red Velvet Oreo", "Price": 190, category:"Shakes" },
      {"id": 68, "name": "Butter Scotch Oreo", "Price": 190, category:"Shakes" },
      {"id": 69, "name": "Butter Scotch", "Price": 190, category:"Shakes" },
      {"id": 70, "name": "Mugly Chocolate", "Price": 190 , category:"Shakes" },
      {"id": 71, "name": "Chocolate Oreo", "Price": 190, category:"Shakes" },
      {"id": 72, "name": "Mango Shake", "Price": 190, category:"Shakes" },
      {"id": 73, "name": "Garlic Bread", "Price": 149, "category": "SIDERS" },
      {"id": 74, "name": "Cheese Garlic Bread", "Price": 180, "category": "SIDERS" },
      {"id": 75, "name": "Cheese Chilli Toast", "Price": 180, "category": "SIDERS" },
      {"id": 76, "name": "French Fries", "Price": 160, "category": "SIDERS" },
      {"id": 77, "name": "Perry Perry Fries", "Price": 170, "category": "SIDERS" },
      {"id": 78, "name": "Cheese Loaded Fries", "Price": 180, "category": "SIDERS" },
      {"id": 79, "name": "Onion Wings", "Price": 175, "category": "SIDERS" },
      {"id": 80, "name": "Spaghetti Aglio Olio Pasta", "SmallPrice": 280, "LargePrice": 325, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 81, "name": "Cheese Sauce Pasta", "SmallPrice": 280, "LargePrice": 325, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 82, "name": "Arrabiata", "SmallPrice": 280, "LargePrice": 325, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 83, "name": "Pink Penny Pasta", "SmallPrice": 280, "LargePrice": 325, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 84, "name": "Extra Topping", "Price": 50, "category": "PASTA", "Options": ["Cheese", "Vegetable", "Chicken", "Jalepino"]},
      {"id": 85, "name": "Garlic Delight", "Price": 300, "category": "Pizza" },
      {"id": 86, "name": "Margarita Classic", "Price": 280, "category": "Pizza" },
      {"id": 87, "name": "Vegetable American", "Price": 300, "category": "Pizza" },
      {"id": 88, "name": "Oyster Mushroom", "Price": 300, "category": "Pizza" },
      {"id": 89, "name": "Taka Tak Paneer", "Price": 320, "category": "Pizza" },
      {"id": 90, "name": "Chicken Pizza", "Price": 350, "category": "Pizza" },
      {"id": 91, "name": "Paneer Sandwich", "Price": 180, "category": "Sandwiches", "Type": "Veg" },
      {"id": 92, "name": "Club Sandwich", "SmallPrice": 180, "LargePrice": 220, "category": "Sandwiches", "Type": "Non Veg" },
      {"id": 93, "name": "BBQ Sandwich", "SmallPrice": 180, "LargePrice": 220, "category": "Sandwiches", "Type": "Non Veg" },
      {"id": 94, "name": "Vegetable Sandwich", "Price": 170, "category": "Sandwiches", "Type": "Veg" },
      {"id": 95, "name": "Veg Burger", "Price": 150, "category": "Burger", "Type": "Veg" },
      {"id": 96, "name": "Paneer Burger", "Price": 170, "category": "Burger", "Type": "Veg" },
      {"id": 97, "name": "Mushroom Burger", "Price": 170, "category": "Burger", "Type": "Veg" },
      {"id": 98, "name": "Chicken Burger", "Price": 199, "category": "Burger", "Type": "Non Veg" },
      {"id": 99, "name": "Mugly Chicken Breast Burger", "Price": 199, "category": "Burger", "Type": "Non Veg" },
      {"id": 100, "name": "Veg Momos (Steam/Pan Fried/Kurkure/Chilli)", "Price": 180, "category": "Momos", "Type": "Veg", "Quantity": "8 Pc" },
      {"id": 101, "name": "Cheese Momos (Steam/Pan Fried/Kurkure/Chilli)", "Price": 180, "category": "Momos", "Type": "Veg", "Quantity": "8 Pc" },
      {"id": 102, "name": "Chicken Momos (Steam/Pan Fried/Kurkure/Chilli)", "Price": 220, "category": "Momos", "Type": "Non Veg", "Quantity": "8 Pc" },
      {"id": 103, "name": "Hakka Noodles", "SmallPrice": 240, "LargePrice": 299, "category": "Noodles", "Type": "Veg" },
      {"id": 104, "name": "Chilli Garlic Noodles", "SmallPrice": 240, "LargePrice": 299, "category": "Noodles", "Type": "Veg" },
      {"id": 105, "name": "Shezwan Noodles", "SmallPrice": 240, "LargePrice": 299, "category": "Noodles", "Type": "Veg" },
      {"id": 106, "name": "Bron Garlic Noodles", "SmallPrice": 240, "LargePrice": 299, "category": "Noodles", "Type": "Non Veg" },
      {"id": 107, "name": "Veg Fried Rice", "SmallPrice": 180, "LargePrice": 220, "category": "Fried Rice", "Type": "Veg" },
      {"id": 108, "name": "Shezwan Fried Rice", "SmallPrice": 180, "LargePrice": 220, "category": "Fried Rice", "Type": "Veg" },
      {"id": 109, "name": "Bron Garlic Fried Rice", "SmallPrice": 180, "LargePrice": 220, "category": "Fried Rice", "Type": "Non Veg" },
      {"id": 110, "name": "Egg Fried Rice", "Price": 199, "category": "Fried Rice", "Type": "Non Veg" },
      {"id": 111, "name": "Triple Fried Rice", "Price": 199, "category": "Fried Rice", "Type": "Non Veg" },
      {"id": 112, "name": "Veg Sizzler (Serve With Rice Noodles)", "Price": 299, "category": "Sizzler", "Type": "Veg" },
      {"id": 113, "name": "Paneer Sizzler (Serve With Rice Noodles)", "Price": 350, "category": "Sizzler", "Type": "Veg" },
      {"id": 114, "name": "Chicken Sizzler (Serve With Rice Noodles)", "Price": 399, "category": "Sizzler", "Type": "Non Veg" },
      {"id": 115, "name": "Chilli Panner (Dry/Gravy)", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 116, "name": "Chilli Mushroom", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 117, "name": "Chilli Baby Corn", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 118, "name": "Honey Chilli Potato", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 119, "name": "Crispy Corn", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 120, "name": "Spring Roll", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 121, "name": "Crispy Veg", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 122, "name": "Panner 65", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 123, "name": "Cigar Roll", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 124, "name": "Lotus Steam", "Price": 250, "category": "Chinese Snacks", "Type": "Veg" },
      {"id": 125, "name": "Chilli Chicken (Dry/Gravy)", "Price": 299, "category": "Chinese Snacks", "Type": "Non Veg" },
      {"id": 126, "name": "Manchurian (Dry/Gravy)", "Price": 299, "category": "Chinese Snacks", "Type": "Non Veg" },
      {"id": 127, "name": "Chicken Manchurian", "Price": 299, "category": "Chinese Snacks", "Type": "Non Veg" },
      {"id": 128, "name": "Chicken Black Pepper", "Price": 299, "category": "Chinese Snacks", "Type": "Non Veg" },
      {"id": 129, "name": "Chicken Lollypop", "Price": 299, "category": "Chinese Snacks", "Type": "Non Veg" },
      {"id": 130, "name": "Chicken Wings", "Price": 299, "category": "Chinese Snacks", "Type": "Non Veg" },
      {"id": 131, "name": "Veg Chinese Platter (4 pc Each)", "Price": 350, "category": "Chinese Platter", "Type": "Veg", "Includes": ["Chilli Paneer", "Spring Roll", "Manchurian"] },
      {"id": 132, "name": "Non Veg Chinese Platter (4 pc Each)", "Price": 399, "category": "Chinese Platter", "Type": "Non Veg", "Includes": ["Chilli Chicken", "Chicken Lollypop", "Chicken Black Pepper"] },
      {"id": 133, "name": "Combos Noodles / Fried Rice", "SmallPrice": 199, "LargePrice": 220, "category": "Combos", "Includes": ["Chilli Paneer", "Manchurian", "Chilli Chicken"] },
      {"id": 134, "name": "Seasar Salad", "PriceSmall": 175, "PriceLarge": 220, "category": "Salad", "Type": "Veg" },
      {"id": 135, "name": "Greek Salad", "PriceSmall": 175, "PriceLarge": 220, "category": "Salad", "Type": "Veg" },
      {"id": 136, "name": "Green Salad", "PriceSmall": 175, "PriceLarge": 220, "category": "Salad", "Type": "Veg" },
      {"id": 137, "name": "Brownie With Hot Chocolate", "Price": 140, "category": "Dessert" },
      {"id": 138, "name": "Brownie With Ice Cream", "Price": 170, "category": "Dessert" },
      {"id": 139, "name": "Sizzling Brownie", "Price": 190, "category": "Dessert" },
      {"id": 140, "name": "Blue Berry Cheese Cake", "Price": 80, "category": "Dessert" },
      {"id": 141, "name": "Red Velvet Cheese Cake", "Price": 80, "category": "Dessert" },
      {"id": 142, "name": "Chocolate Truffle", "Price": 80, "category": "Dessert" },
      {"id": 143, "name": "Vanilla Ice Cream", "Price": 80, "category": "Dessert" },
      {"id": 144, "name": "American Nuts Cream", "Price": 80, "category": "Dessert" },
      {"id": 145, "name": "Chocolate Cream", "Price": 80, "category": "Dessert" },
      {"id": 146, "name": "Roasted Almond Ice Cream", "Price": 80, "category": "Dessert" },
      {"id": 147, "name": "Ice Cream", "Price": 50, category:"Add Ons" },
      {"id": 148, "name": "Chocolate Syrup", "Price": 50, category:"Add Ons" },
      {"id": 149, "name": "Whipping Cream", "Price": 50 , category:"Add Ons" }
 ];
  

const Invoice = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedQty, setSelectedQty] = useState('');
  const [itemIdToQty, setItemIdToQty] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [billMeta, setBillMeta] = useState(null);
  const [existingBillId, setExistingBillId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

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
      .map(item => {
        const price = Number(
          item.Price ??
          item.SmallPrice ??
          item.LargePrice ??
          0
        );

        return {
          item_name: item.name,
          quantity: itemIdToQty[item.id],
          price: price,
          amount: price * itemIdToQty[item.id],
        };
      });

    if (filtered.length === 0) return alert("Please select at least one item");

    const subtotal = filtered.reduce((acc, item) => acc + item.amount, 0);
    const discountAmount = subtotal * (discount / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const sgst = discountedSubtotal * 0.025;
    const cgst = discountedSubtotal * 0.025;
    const finalTotal = discountedSubtotal + sgst + cgst;

    const billStatus = paymentMethod ? 'paid' : 'pending';

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
      payment_method: paymentMethod,
      status: billStatus,
      is_paid: paymentMethod ? true : false,
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
    setSelectedCategory('');
    setSelectedQty('');
    setBillMeta(null);
    setExistingBillId(null);
    setPaymentMethod('');
  };

  const subtotal = selectedItems.reduce((acc, item) => acc + item.amount, 0);
  const sgst = subtotal * 0.025;
  const cgst = subtotal * 0.025;
  const finalTotal = Math.max(0, subtotal -(subtotal*(discount/100)) + sgst + cgst);

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

  const editOrder = async () => {
    if (!tableNo) return alert("Please select a table number to edit the order");

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('table_no', tableNo)
      .order('bill_date', { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error editing order:", error);
      alert("Failed to edit order");
    } else if (data.length === 0) {
      alert("No hold bill found for this table");
    } else {
      const bill = data[0];
      setName(bill.name);
      setPhone(bill.phone);
      setExistingBillId(bill.id);
      setBillMeta({ bill_no: bill.bill_no, bill_date: bill.bill_date });
      setSelectedItems(bill.items);
      setPaymentMethod(bill.payment_method || '');

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
        <h2>MuglyCafe (Dehradun)</h2>
        <p>Contact: </p>
        <p>GST: </p>
        <hr />

        <div className="no-print">
          <div className="form-section">
            <label>Name: <input value={name} onChange={e => setName(e.target.value)} /></label>
            <label>Phone: <input value={phone} onChange={e => setPhone(e.target.value)} /></label>
            <label>Discount (%):
              <input type="number" 
              value={discount} onChange={(e) => setDiscount(parseInt(e.target.value))}
               placeholder="Enter discount %"
               min= "0" 
               max = "100"
               inputMode='numeric'
               style={{
                        appearance: 'textfield',
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'none'
                     }}  
               />
            </label>
            <label>Payment Method:
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="">-- Select Payment Method --</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </label>
          </div>

          <div className="form-section">
            <h4>Select Items</h4>
            <div className="selectors">
              <select value={selectedCategory} onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedItemId('');
              }}>
                <option value="">-- Select Category --</option>
                {[...new Set(itemsList.map(item => item.category))].map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedItemId}
                onChange={handleSelectItem}
                disabled={!selectedCategory}
              >
                <option value="">-- Select Item --</option>
                {itemsList
                  .filter(item => item.category === selectedCategory)
                  .map(item => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={itemIdToQty.hasOwnProperty(item.id)}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>

              <select
                value={selectedQty}
                onChange={handleSelectQty}
                disabled={!selectedItemId}
              >
                <option value="">-- Quantity --</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

          <div className="selected-items">
            {Object.entries(itemIdToQty).map(([id, qty]) => {
              const item = itemsList.find(i => i.id === parseInt(id));
              if (!item) return null;

               // Handle fallback for missing price fields safely
                const getItemPrice = (item) => Number(item.Price ?? item.SmallPrice ?? item.LargePrice ?? 0);

              const price = parseInt(getItemPrice(item));
              const itemTotal = price * qty;

              return (
                <div key={id} className="item-row">
                  <span>{item.name}</span>
                  <span>Qty: {qty}</span>
                  <span>Price: ₹{price}</span>
                  <span>Total: ₹{itemTotal}</span>
                  <span>
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
            <button onClick={editOrder}>Edit Order</button>
            <button onClick={() => navigate('/history')}>View Order History</button>
            <button onClick={() => navigate('/hold-bills')}>View Hold Bills</button>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="bill-output">
            <h3>Bill No: {billMeta?.bill_no || '-'}</h3>
            <p>Date: {billMeta?.bill_date ? new Date(billMeta.bill_date).toLocaleString() : '-'}</p>
            <p>Table No: {tableNo}</p>
            <p>Payment Method: {paymentMethod || '-'}</p>
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
            <p>Discount ({discount}%): ₹{(subtotal * (discount / 100)).toFixed(2)}</p>
            <p><strong>Total: ₹{finalTotal.toFixed(2)}</strong></p>
            <p>Thank you for visiting MuglyCafe!</p>

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
