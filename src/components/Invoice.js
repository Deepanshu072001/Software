import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Invoice.css';
import * as html2pdf from 'html2pdf.js';


const itemsList = [
  // Hot Beverage @99 @149 @160 @180 @175 @60
      {"id": 1, "name": "Espresso  small", "Price": 99, category:  "Hot Beverage"},
      {"id": 2, "name": "Espresso  large", "Price": 149, category:  "Hot Beverage"},
      {"id": 3, "name": "Cappuccino  small", "Price": 160,  category:  "Hot Beverage"},
      {"id": 4, "name": "Cappuccino  large", "Price": 180, category:  "Hot Beverage"},
      {"id": 5, "name": "Café Latte  small", "Price": 160,  category:  "Hot Beverage"},
      {"id": 6, "name": "Café Latte  large", "Price": 180, category:  "Hot Beverage"},
      {"id": 7, "name": "Café Mocha", "Price": 175, category:  "Hot Beverage"},
      {"id": 8, "name": "Americano", "Price": 149, category:  "Hot Beverage"},
      {"id": 9, "name": "Irish Coffee", "Price": 160, category:  "Hot Beverage"},
      {"id": 10, "name": "Masala Tea", "Price": 60, category:  "Hot Beverage"},
      {"id": 11, "name": "Honey Ginger", "Price": 60, category:  "Hot Beverage"},
      {"id": 12, "name": "Lemon Tea", "Price": 60, category:  "Hot Beverage"},
      {"id": 13, "name": "Green Tea", "Price": 60, category:  "Hot Beverage"},

// Flavour Cappuccino/Latte @180
      {"id": 14, "name": "Hazelnut", "Price": 180 , category: "(Flavour Cappuccino/Latte)" },
      {"id": 15, "name": "Vanilla", "Price": 180, category: "(Flavour Cappuccino/Latte)" },
      {"id": 16, "name": "Irish", "Price": 180, category: "(Flavour Cappuccino/Latte)" },
      {"id": 17, "name": "Caramel", "Price": 180 , category: "(Flavour Cappuccino/Latte)" },
      {"id": 18, "name": "Red Velvet", "Price": 180, category: "(Flavour Cappuccino/Latte)" },
      {"id": 19, "name": "Cinnamon", "Price": 180, category: "(Flavour Cappuccino/Latte)" },
      {"id": 20, "name": "Butter Scotch", "Price": 180, category: "(Flavour Cappuccino/Latte)" },

// Hot Chocolate @180
      {"id": 21, "name": "Classic Hot Chocolate", "Price": 180, category: "Hot Chocolate" },
      {"id": 22, "name": "Hazelnut", "Price": 180 , category: "Hot Chocolate"},
      {"id": 23, "name": "Vanilla", "Price": 180 , category: "Hot Chocolate"},
      {"id": 24, "name": "Irish", "Price": 180 , category: "Hot Chocolate"},
      {"id": 25, "name": "Caramel", "Price": 180, category: "Hot Chocolate" },
      {"id": 26, "name": "Red Velvet", "Price": 180, category: "Hot Chocolate" },
      {"id": 27, "name": "Cinnamon", "Price": 180, category: "Hot Chocolate" },
      {"id": 28, "name": "Butter Scotch", "Price": 180 , category: "Hot Chocolate"},

// Cold Brews @149 @160 @180
      {"id": 29, "name": "Ice Americano", "Price": 149 , category: "Cold Brews" },
      {"id": 30, "name": "Ice Latte", "Price": 160, category: "Cold Brews" },
      {"id": 31, "name": "Café Frappe", "Price": 160 , category: "Cold Brews" },
      {"id": 32, "name": "Hazelnuts", "Price": 180, category: "Cold Brews" },
      {"id": 33, "name": "Vanilla", "Price": 180 , category:   "Cold Brews" },
      {"id": 34, "name": "Irish", "Price": 180, category: "Cold Brews" },
      {"id": 35, "name": "Caramel", "Price": 180, category: "Cold Brews" },
      {"id": 36, "name": "Red Velvet", "Price": 180, category: "Cold Brews" },
      {"id": 37, "name": "Cinnamon", "Price": 180, category: "Cold Brews" },  
      {"id": 38, "name": "Butter Scotch", "Price": 180, category: "Cold Brews"},

// Mocktails @180
      {"id": 39, "name": "Blue Lagoon", "Price": 180 , category: "Mocktails" },
      {"id": 40, "name": "Mint Mojito", "Price": 180 , category: "Mocktails" },
      {"id": 41, "name": "Peach", "Price": 180, category: "Mocktails" },
      {"id": 42, "name": "Green Apple", "Price": 180, category: "Mocktails" },
      {"id": 43, "name": "Cranberry", "Price": 180, category: "Mocktails" },
      {"id": 44, "name": "Spice Orange Peach", "Price": 180, category: "Mocktails" },
      {"id": 45, "name": "Fruit Punch", "Price": 180, category: "Mocktails" },
      {"id": 46, "name": "Blue Ocean", "Price": 180 , category: "Mocktails" },
      {"id": 47, "name": "Watermelon", "Price": 180, category: "Mocktails" },
      {"id": 48, "name": "Cucumber", "Price": 180, category: "Mocktails" },
      {"id": 49, "name": "Orange", "Price": 180, category: "Mocktails" },

// Ice Tea @149
      {"id": 50, "name": "Lemon", "Price": 149,category: "Ice Tea" },
      {"id": 51, "name": "Peach", "Price": 149, category: "Ice Tea" },
      {"id": 52, "name": "Watermelon", "Price": 149, category: "Ice Tea" },
      {"id": 53, "name": "Cucumber", "Price": 149, category: "Ice Tea" },
      {"id": 54, "name": "Cranberry", "Price": 149 , category: "Ice Tea" },

// Lemonades @140
      {"id": 55, "name": "Fresh Lime Water", "Price": 140 , category: "Lemonades"},
      {"id": 56, "name": "Fresh Lime Soda", "Price": 140 , category: "Lemonades"},
      {"id": 57, "name": "Mugly Shikanji", "Price": 140 , category: "Lemonades"},
      {"id": 58, "name": "Pink Lemonade", "Price": 140 , category: "Lemonades"},
      {"id": 59, "name": "Chatpata Jamun", "Price": 140 , category: "Lemonades"},

// Other Drinks @99 @140
      {"id": 60, "name": "Soft Drink", "Price": 99, category: "Other Drinks"},
      {"id": 61, "name": "Red Bull", "Price": 140 , category: "Other Drinks"},

// Mugly Crush @160      
      //{"id": 62, "name": "Mugly Crush", "Price": 160, category: "Mugly Crush"},
      {"id": 63, "name": "MixBerry Green Apple",  "Price": 160, category: "Mugly Crush"},
      {"id": 64, "name": "Strawberry Mango", "Price": 160, category: "Mugly Crush"},
      {"id": 65, "name": "Mango Crush", "Price": 160, category: "Mugly Crush"},
      {"id": 66, "name": "Blue Ocean Mojito", "Price": 160, category: "Mugly Crush"},

// Shakes @190
      {"id": 67, "name": "Wallnut Browanie", "Price": 190, category:"Shakes" },
      {"id": 68, "name": "Oreao", "Price": 190, category:"Shakes" },
      {"id": 69, "name": "Kitkat", "Price": 190, category:"Shakes" },
      {"id": 70, "name": "Red Velvet", "Price": 190 , category: "Shakes" },
      {"id": 71, "name": "Mango Colada", "Price": 190 , category: "Shakes" },
      {"id": 72, "name": "Berry Blast", "Price": 190 , category: "Shakes" },
      {"id": 73, "name": "Strawberry", "Price": 190, category:"Shakes" },
      {"id": 74, "name": "Butter Scotch Oreo", "Price": 190, category:"Shakes" },
      {"id": 75, "name": "Butter Scotch", "Price": 190, category:"Shakes" },
      {"id": 76, "name": "Mugly Chocolate", "Price": 190 , category:"Shakes" },
      {"id": 77, "name": "Chocolate Oreo", "Price": 190, category:"Shakes" },
      {"id": 78, "name": "Mango Shake", "Price": 190, category:"Shakes" },
      {"id": 79, "name": "Red Velvet Oreo", "Price": 190, category:"Shakes" },

// Soup @149 @180
      {"id": 80, "name": "Cream Of Tomato", "Price": 149, "category": "Soup" },
      {"id": 81, "name": "Cream Of Tomato non-veg", "Price": 180, "category": "Soup"  },
      {"id": 82, "name": "Cream Of Mushroom", "Price": 149, "category": "Soup"  },
      {"id": 83, "name": "Cream Of Mushroom non-veg", "Price": 180, "category": "Soup" },
      {"id": 84, "name": "Lung Fung Soup", "Price": 149, "category": "Soup" },
      {"id": 85, "name": "Lung Fung Soup non-veg", "Price": 180, "category": "Soup" },
      {"id": 86, "name": "Hot & Sour Soup", "Price": 149, "category": "Soup" },
      {"id": 87, "name": "Hot & Sour Soup non-veg", "Price": 180, "category": "Soup" },
      {"id": 88, "name": "Sweet Corn Soup", "Price": 149, "category": "Soup"},
      {"id": 89, "name": "Sweet Corn Soup non-veg", "Price": 180, "category": "Soup" },
      {"id": 90, "name": "Manchow", "Price": 149, "category": "Soup" },
      {"id": 91, "name": "Manchow non-veg", "Price": 180, "category": "Soup" },
      {"id": 92, "name": "Lemon Coriander", "Price": 149, "category": "Soup" },
      {"id": 93, "name": "Lemon Coriander non-veg", "Price": 180, "category": "Soup"},

// SIDERS @149 @160 @170 @180
      {"id": 94, "name": "Garlic Bread", "Price": 149, "category": "SIDERS" },
      {"id": 95, "name": "Cheese Garlic Bread", "Price": 180, "category": "SIDERS" },
      {"id": 96, "name": "Cheese Chilli Toast", "Price": 180, "category": "SIDERS" },
      {"id": 97, "name": "French Fries", "Price": 160, "category": "SIDERS" },
      {"id": 98, "name": "Perry Perry Fries", "Price": 170, "category": "SIDERS" },
      {"id": 99, "name": "Cheese Loaded Fries", "Price": 180, "category": "SIDERS" },
      {"id": 100, "name": "Onion Wings", "Price": 175, "category": "SIDERS" },
      {"id": 101, "name": "Nachos Bowl", "Price": 175, "category": "SIDERS" },

// PASTA @280 @325 @350
      {"id": 102, "name": "Spaghetti Aglio Olio Pasta", "Price": 280, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 103, "name": "Spaghetti Aglio Olio Pasta non-veg", "Price": 325, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 104, "name": "Cheese Sauce Pasta", "Price": 280, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 105, "name": "Cheese Sauce Pasta non-veg", "Price": 350, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 106, "name": "Arrabiata", "Price": 280, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 107, "name": "Arrabiata non-veg", "Price": 350, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 108, "name": "Pink Penny Pasta", "Price": 280, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      {"id": 109, "name": "Pink Penny Pasta non-veg", "Price": 350, "category": "PASTA", "Notes": "Served With Garlic Bread, Veg/Non Veg" },
      
// PIZZA @280 @300 @320 @350
      {"id": 116, "name": "Garlic Delight", "Price": 300, "category": "Pizza" },
      {"id": 117, "name": "Margarita Classic", "Price": 280, "category": "Pizza" },
      {"id": 118, "name": "Vegetable American", "Price": 300, "category": "Pizza" },
      {"id": 119, "name": "Oyster Mushroom", "Price": 300, "category": "Pizza" },
      {"id": 120, "name": "Taka Tak Paneer", "Price": 320, "category": "Pizza" },
      {"id": 121, "name": "Chicken Pizza", "Price": 350, "category": "Pizza" },
      {"id": 122, "name": "Chilli Panner Pizza", "Price": 320, "category": "Pizza" },

// Sandwichs @150 @170 @180 @220
      {"id": 123, "name": "Colslow Sandwich", "Price": 150, "category": "Sandwichs" },
      {"id": 124, "name": "Paneer Sandwich", "Price": 180, "category": "Sandwichs" },
      {"id": 125, "name": "Club Sandwich", "Price": 180, "category": "Sandwichs" },
      {"id": 126, "name": "Club Sandwich  non-veg", "Price": 220, "category": "Sandwichs" },
      {"id": 127, "name": "BBQ Sandwich veg", "Price": 180, "category": "Sandwichs" },
      {"id": 128, "name": "BBQ Sandwich non-veg", "Price": 220, "category": "Sandwichs" },
      {"id": 129, "name": "Vegetable Sandwich", "Price": 170, "category": "Sandwichs" },

// Burger @150 @170 @199
      {"id": 130, "name": "Veg Burger", "Price": 150, "category": "Burger" },
      {"id": 131, "name": "Paneer Burger", "Price": 170, "category": "Burger" },
      {"id": 132, "name": "Mushroom Burger", "Price": 170, "category": "Burger" },
      {"id": 133, "name": "Chicken Burger", "Price": 199, "category": "Burger", },
      {"id": 134, "name": "Mugly Chicken Breast Burger", "Price": 199, "category": "Burger" },

// Momos @180 @220
      {"id": 135, "name": "Veg Momos (Steam/Pan Fried/Kurkure/Chilli)", "Price": 180, "category": "Momos", "Quantity": "8 Pc" },
      {"id": 136, "name": "Cheese Momos (Steam/Pan Fried/Kurkure/Chilli)", "Price": 180, "category": "Momos", "Quantity": "8 Pc" },
      {"id": 137, "name": "Chicken Momos (Steam/Pan Fried/Kurkure/Chilli)", "Price": 220, "category": "Momos", "Quantity": "8 Pc" },

// Noodles @249 @299      
      {"id": 138, "name": "Hakka Noodles", "Price": 249, "category": "Noodles" },
      {"id": 139, "name": "Hakka Noodles non-veg", "Price": 299, "category": "Noodles" },
      {"id": 140, "name": "Chilli Garlic Noodles", "Price": 249, "category": "Noodles", },
      {"id": 141, "name": "Chilli Garlic Noodles non-veg", "Price": 299, "category": "Noodles" },
      {"id": 142, "name": "Shezwan Noodles", "Price": 249, "category": "Noodles", },
      {"id": 143, "name": "Shezwan Noodles non-veg", "Price": 299, "category": "Noodles" },
      {"id": 144, "name": "Bron Garlic Noodles", "Price": 249, "category": "Noodles", },
      {"id": 145, "name": "Bron Garlic Noodles non-veg", "Price": 299, "category": "Noodles" },
      {"id": 146, "name": "Vegetable Maggi", "Price": 99, "category": "Noodles", "Type": "Veg" },

// Fried Rice @180 @220      
      {"id": 147, "name": "Veg Fried Rice", "Price": 180, "category": "Fried Rice" },
      {"id": 148, "name": "Non Veg Fried Rice ", "Price": 220, "category": "Fried Rice" },
      {"id": 149, "name": "Shezwan Fried Rice", "Price": 180, "category": "Fried Rice" },
      {"id": 150, "name": "Shezwan Fried Rice Non Veg", "Price": 220, "category": "Fried Rice" },
      {"id": 151, "name": "Bron Garlic Fried Rice", "Price": 180, "category": "Fried Rice" },
      {"id": 152, "name": "Bron Garlic Fried Rice Non Veg", "Price": 220, "category": "Fried Rice" },
      {"id": 153, "name": "Egg Fried Rice", "Price": 180, "category": "Fried Rice" },
      {"id": 154, "name": "Triple Fried Rice", "Price": 180, "category": "Fried Rice" },
      {"id": 155, "name": "Triple Fried Rice Non Veg", "Price": 220, "category": "Fried Rice" },

// Sizzler @299 @350 @399
      {"id": 156, "name": "Veg Sizzler (Serve With Rice Noodles)", "Price": 299, "category": "Sizzler" },
      {"id": 157, "name": "Paneer Sizzler (Serve With Rice Noodles)", "Price": 350, "category": "Sizzler" },
      {"id": 158, "name": "Chicken Sizzler (Serve With Rice Noodles)", "Price": 399, "category": "Sizzler" },

// Chinese Snacks @250 @299      
      {"id": 159, "name": "Chilli Panner  (Dry/Gravy)", "Price": 250, "category": "Chinese Snacks" },
      {"id": 160, "name": "Chilli Mushroom", "Price": 250, "category": "Chinese Snacks" },
      {"id": 161, "name": "Chilli Baby Corn", "Price": 250, "category": "Chinese Snacks" },
      {"id": 162, "name": "Honey Chilli Potato", "Price": 250, "category": "Chinese Snacks" },
      {"id": 163, "name": "Crispy Corn", "Price": 250, "category": "Chinese Snacks" },
      {"id": 164, "name": "Spring Roll", "Price": 250, "category": "Chinese Snacks" },
      {"id": 165, "name": "Crispy Veg", "Price": 250, "category": "Chinese Snacks" },
      {"id": 166, "name": "Panner 65", "Price": 250, "category": "Chinese Snacks" },
      {"id": 167, "name": "Cigar Roll", "Price": 250, "category": "Chinese Snacks" },
      {"id": 168, "name": "Lotus Steam", "Price": 250, "category": "Chinese Snacks"},
      {"id": 169, "name": "Manchurian (Dry/Gravy)", "Price": 250, "category": "Chinese Snacks" },
      {"id": 170, "name": "Mushroom Duplex", "Price": 250, "category": "Chinese Snacks" },
      {"id": 171, "name": "Chilli Chicken (Dry/Gravy)", "Price": 299, "category": "Chinese Snacks" },
      {"id": 172, "name": "Chicken Manchurian", "Price": 299, "category": "Chinese Snacks" },
      {"id": 173, "name": "Chicken Black Pepper", "Price": 299, "category": "Chinese Snacks" },
      {"id": 174, "name": "Chicken Lollipop", "Price": 299, "category": "Chinese Snacks" },
      {"id": 175, "name": "Chicken Wings", "Price": 299, "category": "Chinese Snacks" },

// Chinese Platter @350 @399      
      {"id": 176, "name": "Chilli Paneer (4 pc Each)", "Price": 350, "category": "Veg Chinese Platter"},
      {"id": 177, "name": "Spring Roll (4 pc Each)", "Price": 350, "category": "Veg Chinese Platter"},
      {"id": 178, "name": " Manchurian (4 pc Each)", "Price": 350, "category": "Veg Chinese Platter"},

// Nonveg Chinese Platter @399      
      {"id": 179, "name": "Chilli Chicken (4 pc Each)", "Price": 399, "category": "Nonveg Chinese Platter"},
      {"id": 180, "name": "Chicken Lollipop (4 pc Each)", "Price": 399, "category": "Nonveg Chinese Platter"},
      {"id": 181 , "name": "Chicken Black Pepper (4 pc Each)", "Price": 399, "category": "Nonveg Chinese Platter" },

// Combos @199 @220
      {"id": 182, "name": "Combos Noodles(Chilli Paneer)", "Price": 199, "category": "Combos" },
      {"id": 183, "name": "Combos Noodles(Chilli Chicken)", "Price": 199, "category": "Combos" },
      {"id": 184, "name": "Combo Noodles(Manchurian)", "Price": 199, "category": "Combos" },
      {"id": 185, "name": "Combos Fried Rice(Chilli Paneer)", "Price": 220, "category": "Combos" },
      {"id": 186, "name": "Combos Fried Rice(Chilli Chicken)", "Price": 220, "category": "Combos" },
      {"id": 187, "name": "Combo Fried Rice(Manchurian)", "Price": 220, "category": "Combos" },

      {"id": 188, "name": "Seasar Salad", "Price": 175, "category": "Salad" },
      {"id": 189, "name": "Seasar Salad non-veg", "Price": 220, "category": "Salad" },
      {"id": 190, "name": "Greek Salad", "Price": 175, "category": "Salad" },
      {"id": 191, "name": "Greek Salad non-veg", "Price": 220, "category": "Salad" },
      {"id": 192, "name": "Green Salad", "Price": 175, "category": "Salad" },
      {"id": 193, "name": "Green Salad non-veg", "Price": 220, "category": "Salad" },

// Dessert @80 @190 @225 @250
      {"id": 194, "name": "Brownie With Hot Chocolate", "Price": 190, "category": "Dessert" },
      {"id": 195, "name": "Brownie With Ice Cream", "Price": 225, "category": "Dessert" },
      {"id": 196, "name": "Sizzling Brownie", "Price": 250, "category": "Dessert" },
      {"id": 197, "name": "Vanilla Ice Cream", "Price": 80, "category": "Dessert" },
      {"id": 198, "name": "American Nuts Cream", "Price": 80, "category": "Dessert" },
      {"id": 199, "name": "Chocolate Cream", "Price": 80, "category": "Dessert" },
      {"id": 200, "name": "Roasted Almond Ice Cream", "Price": 80, "category": "Dessert" },

// Mugly Specials @650 @850 @1200      
      {"id": 201, "name": "Mugly Special small", "Price": 650, category:"Mugly Specials" },
      {"id": 202, "name": "Mugly Special medium", "Price": 850, category:"Mugly Specials" },
       {"id": 203, "name": "Mugly Special large", "Price": 1200, category:"Mugly Specials" },

// Add Ons @50
       {"id": 204, "name": "Ice Cream", "Price": 50, category:"Add Ons" },
      {"id": 205, "name": "Chocolate Syrup", "Price": 50, category:"Add Ons" },
      {"id": 206, "name": "Cheese", "Price": 50, category:"Add Ons" },
      {"id": 207, "name": "Vegetable", "Price": 50, category:"Add Ons" },
      {"id": 208, "name": "Chicken", "Price": 50, category:"Add Ons" },
      {"id": 210, "name": "Jalepino", "Price": 50, category:"Add Ons" },
      {"id": 110, "name": "Extra Topping : [Cheese] veg", "Price": 50, "category": "Add Ons", },
      {"id": 111, "name": "Extra Topping : [Cheese] ", "Price": 50, "category": "Add Ons"},
      {"id": 112, "name": "Extra Topping : [Vegetable] ", "Price": 50, "category": "Add Ons"},
      {"id": 113, "name": "Extra Topping : [Chicken]", "Price": 50, "category": "Add Ons"},
      {"id": 114, "name": "Extra Topping : [Jalepino] veg", "Price": 50, "category": "Add Ons"},
      {"id": 115, "name": "Extra Topping : [Jalepino]", "Price": 50, "category": "Add Ons"},

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
  const [selectedType, setSelectedType] = useState('');

  
  const categorySupportsType = (category) => {
  return itemsList.some(item => item.category === category && item.Type);
};

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
          type: item.Type || 'NA',
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
        <h2>Mugly Cafe (Dehradun)</h2>
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
                setSelectedType('');
              }}>
                <option value="">-- Select Category --</option>
                {[...new Set(itemsList.map(item => item.category))].map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>

              {/* NEW TYPE FILTER FOR VEG/NON-VEG ITEMS */}
              {categorySupportsType(selectedCategory) && (
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="">-- Select Type --</option>
                  <option value="Veg">Veg</option>
                  <option value="Non Veg">Non Veg</option>
                </select>
              )}

              <select
                value={selectedItemId}
                onChange={handleSelectItem}
                disabled={!selectedCategory}
              >
                <option value="">-- Select Item --</option>
                {itemsList
                  .filter(item => item.category === selectedCategory)
                  .filter(item => !selectedType || (item.Type && item.Type.includes(selectedType))) 
                  
                  .map(item => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={itemIdToQty.hasOwnProperty(item.id)}
                    >
                      {item.name} {item.type ? `(${item.type})` : ''}
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
                <tr><th>Item</th> <th>Type</th> <th>Qty</th><th>Price</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item_name}</td>
                    <td>{item.type}</td>
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
