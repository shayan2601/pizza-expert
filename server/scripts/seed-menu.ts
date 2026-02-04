import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-expert';

const menuItems = [
  {
    category: 'Pizza',
    name: 'Chicken Tikka Pizza',
    variants: [
      { size: 'Small 7 inch', price: 500 },
      { size: 'Medium 10 inch', price: 900 },
      { size: 'Large 13 inch', price: 1250 },
      { size: 'Extra Large 16 inch', price: 1750 },
    ],
  },
  {
    category: 'Pizza',
    name: 'Chicken BBQ Pizza',
    variants: [
      { size: 'Small', price: 500 },
      { size: 'Medium', price: 900 },
      { size: 'Large', price: 1250 },
      { size: 'Extra Large', price: 1750 },
    ],
  },
  {
    category: 'Pizza',
    name: 'Chicken Fajita Pizza',
    variants: [
      { size: 'Small', price: 500 },
      { size: 'Medium', price: 900 },
      { size: 'Large', price: 1250 },
      { size: 'Extra Large', price: 1750 },
    ],
  },
  {
    category: 'Pizza',
    name: 'Cheese Lover Pizza',
    variants: [
      { size: 'Small', price: 500 },
      { size: 'Medium', price: 900 },
      { size: 'Large', price: 1250 },
      { size: 'Extra Large', price: 1750 },
    ],
  },
  {
    category: 'Pizza',
    name: 'Veggie Delight Pizza',
    variants: [
      { size: 'Small', price: 500 },
      { size: 'Medium', price: 900 },
      { size: 'Large', price: 1250 },
      { size: 'Extra Large', price: 1750 },
    ],
  },
  {
    category: 'Pizza',
    name: 'Peri Peri Pizza',
    variants: [
      { size: 'Small', price: 500 },
      { size: 'Medium', price: 900 },
      { size: 'Large', price: 1250 },
      { size: 'Extra Large', price: 1750 },
    ],
  },
  {
    category: 'Pizza',
    name: 'Hot & Spicy Pizza',
    variants: [
      { size: 'Small', price: 500 },
      { size: 'Medium', price: 900 },
      { size: 'Large', price: 1250 },
      { size: 'Extra Large', price: 1750 },
    ],
  },
  {
    category: 'Pizza',
    name: 'Supreme Pizza',
    variants: [
      { size: 'Small', price: 500 },
      { size: 'Medium', price: 900 },
      { size: 'Large', price: 1250 },
      { size: 'Extra Large', price: 1750 },
    ],
  },
  {
    category: 'Signature Pizza',
    name: 'Malai Boti Pizza',
    variants: [
      { size: 'Small', price: 590 },
      { size: 'Medium', price: 1050 },
      { size: 'Large', price: 1400 },
      { size: 'Extra Large', price: 2200 },
    ],
  },
  {
    category: 'Signature Pizza',
    name: 'Behari Pizza',
    variants: [
      { size: 'Small', price: 590 },
      { size: 'Medium', price: 1050 },
      { size: 'Large', price: 1400 },
      { size: 'Extra Large', price: 2200 },
    ],
  },
  {
    category: 'Signature Pizza',
    name: 'Expert Special Pizza',
    variants: [
      { size: 'Small', price: 590 },
      { size: 'Medium', price: 1050 },
      { size: 'Large', price: 1400 },
      { size: 'Extra Large', price: 2200 },
    ],
  },
  {
    category: 'Signature Pizza',
    name: 'Crown Crust Pizza',
    variants: [
      { size: 'Medium', price: 1150 },
      { size: 'Large', price: 1600 },
      { size: 'Extra Large', price: 2250 },
    ],
  },
  {
    category: 'Signature Pizza',
    name: 'Kabab Stuffed Pizza',
    variants: [
      { size: 'Medium', price: 1150 },
      { size: 'Large', price: 1600 },
      { size: 'Extra Large', price: 2250 },
    ],
  },
  {
    category: 'Signature Pizza',
    name: 'Lazania Pizza',
    variants: [
      { size: 'Medium', price: 1150 },
      { size: 'Large', price: 1600 },
      { size: 'Extra Large', price: 2250 },
    ],
  },
  {
    category: 'Signature Pizza',
    name: 'Half n Half Pizza',
    variants: [
      { size: 'Medium', price: 1150 },
      { size: 'Large', price: 1600 },
      { size: 'Extra Large', price: 2250 },
    ],
  },
  {
    category: 'Burger',
    name: 'Zinger Burger',
    variants: [{ size: 'Single', price: 450 }],
  },
  {
    category: 'Burger',
    name: 'Patty Burger',
    variants: [{ size: 'Single', price: 330 }],
  },
  {
    category: 'Burger',
    name: 'Grill Burger',
    variants: [{ size: 'Single', price: 490 }],
  },
  {
    category: 'Burger',
    name: 'Tower Burger',
    variants: [{ size: 'Single', price: 530 }],
  },
  {
    category: 'Burger',
    name: 'Pizza Burger',
    variants: [{ size: 'Single', price: 450 }],
  },
  {
    category: 'Burger',
    name: 'Mighty Burger',
    variants: [{ size: 'Single', price: 690 }],
  },
  {
    category: 'Burger',
    name: 'Chicken Burger',
    variants: [{ size: 'Single', price: 320 }],
  },
  {
    category: 'Shawarma',
    name: 'Chicken Shawarma',
    variants: [{ size: 'Regular', price: 280 }],
  },
  {
    category: 'Shawarma',
    name: 'Chicken Cheese Shawarma',
    variants: [{ size: 'Regular', price: 330 }],
  },
  {
    category: 'Shawarma',
    name: 'Grill Shawarma',
    variants: [{ size: 'Regular', price: 370 }],
  },
  {
    category: 'Shawarma',
    name: 'Zinger Shawarma',
    variants: [{ size: 'Regular', price: 450 }],
  },
  {
    category: 'Shawarma',
    name: 'Platter Shawarma',
    variants: [{ size: 'Regular', price: 480 }],
  },
  {
    category: 'Shawarma',
    name: 'Platter Cheese Shawarma',
    variants: [{ size: 'Regular', price: 540 }],
  },
  {
    category: 'Shawarma',
    name: 'Expert Special Shawarma',
    variants: [{ size: 'Regular', price: 330 }],
  },
  {
    category: 'Wrap',
    name: 'Grill Wrap',
    variants: [{ size: 'Single', price: 500 }],
  },
  {
    category: 'Wrap',
    name: 'Kabab Wrap',
    variants: [{ size: 'Single', price: 450 }],
  },
  {
    category: 'Wrap',
    name: 'Crispy Wrap',
    variants: [{ size: 'Single', price: 550 }],
  },
  {
    category: 'Wrap',
    name: 'Mexican Tacos Wrap',
    variants: [{ size: 'Single', price: 690 }],
  },
  {
    category: 'Wrap',
    name: 'Double Stake Wrap',
    variants: [{ size: 'Single', price: 690 }],
  },
  {
    category: 'Wrap',
    name: 'Cheese Quesadilla',
    variants: [{ size: 'Single', price: 690 }],
  },
  {
    category: 'Paratha Roll',
    name: 'Crispy Paratha Roll',
    variants: [{ size: 'Single', price: 450 }],
  },
  {
    category: 'Paratha Roll',
    name: 'Chicken Paratha Roll',
    variants: [{ size: 'Single', price: 320 }],
  },
  {
    category: 'Paratha Roll',
    name: 'Chicken Cheese Paratha Roll',
    variants: [{ size: 'Single', price: 370 }],
  },
  {
    category: 'Paratha Roll',
    name: 'Grill Paratha Roll',
    variants: [{ size: 'Single', price: 380 }],
  },
  {
    category: 'Wings',
    name: 'Hot Wings',
    variants: [
      { size: '5 Pcs', price: 400 },
      { size: '10 Pcs', price: 750 },
    ],
  },
  {
    category: 'Wings',
    name: 'BBQ Wings',
    variants: [
      { size: '5 Pcs', price: 450 },
      { size: '10 Pcs', price: 800 },
    ],
  },
  {
    category: 'Wings',
    name: 'Hot Shots',
    variants: [
      { size: '5 Pcs', price: 300 },
      { size: '10 Pcs', price: 550 },
    ],
  },
  {
    category: 'Wings',
    name: 'Nuggets',
    variants: [
      { size: '5 Pcs', price: 350 },
      { size: '10 Pcs', price: 650 },
    ],
  },
  {
    category: 'Fries',
    name: 'Plain Fries',
    variants: [
      { size: 'Regular', price: 180 },
      { size: 'Large', price: 320 },
    ],
  },
  {
    category: 'Fries',
    name: 'Masala Fries',
    variants: [
      { size: 'Regular', price: 180 },
      { size: 'Large', price: 320 },
    ],
  },
  {
    category: 'Fries',
    name: 'BBQ Fries',
    variants: [
      { size: 'Regular', price: 200 },
      { size: 'Large', price: 350 },
    ],
  },
  {
    category: 'Fries',
    name: 'Loaded Fries',
    variants: [
      { size: 'Regular', price: 370 },
      { size: 'Large', price: 550 },
    ],
  },
  {
    category: 'Fries',
    name: 'Cheese Fries',
    variants: [
      { size: 'Regular', price: 280 },
      { size: 'Large', price: 400 },
    ],
  },
  {
    category: 'Sandwich',
    name: 'Chicken Sandwich',
    variants: [{ size: 'With Fries', price: 500 }],
  },
  {
    category: 'Sandwich',
    name: 'Club Sandwich',
    variants: [{ size: 'With Fries', price: 550 }],
  },
  {
    category: 'Sandwich',
    name: 'Grill Sandwich',
    variants: [{ size: 'With Fries', price: 600 }],
  },
  {
    category: 'Sandwich',
    name: 'Fajita Sandwich',
    variants: [{ size: 'With Fries', price: 550 }],
  },
  {
    category: 'Kids Meal',
    name: 'Meal 1',
    variants: [{ size: 'Patty Burger + Nuggets + Fries + Juice', price: 549 }],
  },
  {
    category: 'Kids Meal',
    name: 'Meal 2',
    variants: [{ size: 'Nuggets + Fries + Juice', price: 399 }],
  },
  {
    category: 'Deals',
    name: 'Deal 1',
    variants: [{ size: '1 Patty Burger, 1 Reg Fries, 1 Reg Drink', price: 450 }],
  },
  {
    category: 'Deals',
    name: 'Deal 2',
    variants: [{ size: '1 Zinger Burger, 1 Reg Fries, 1 Reg Drink', price: 550 }],
  },
  {
    category: 'Deals',
    name: 'Deal 3',
    variants: [{ size: '2 Zinger Burger, 2 Reg Drink', price: 890 }],
  },
  {
    category: 'Deals',
    name: 'Deal 4',
    variants: [{ size: '4 Zinger Burger, 1.5 Ltr Drink', price: 1690 }],
  },
  {
    category: 'Deals',
    name: 'Deal 5',
    variants: [{ size: '1 Zinger Burger, 1 Small Pizza, 345ml Drink', price: 900 }],
  },
  {
    category: 'Deals',
    name: 'Deal 6',
    variants: [{ size: '1 Chicken Sandwich, 1 Reg Fries, 1 Reg Drink', price: 560 }],
  },
  {
    category: 'Deals',
    name: 'Deal 7',
    variants: [{ size: '2 Small Pizza (Reg Flavor), 1.5 Ltr Drink', price: 1000 }],
  },
  {
    category: 'Deals',
    name: 'Deal 8',
    variants: [{ size: '2 Medium Pizza (Reg Flavor), 1 Ltr Drink', price: 1800 }],
  },
  {
    category: 'Deals',
    name: 'Deal 9',
    variants: [{ size: '2 Large Pizza (Reg Flavor), 1.5 Ltr Drink', price: 2500 }],
  },
  {
    category: 'Deals',
    name: 'Deal 10',
    variants: [{ size: '2 Shawarma, 1 345ml Drink', price: 600 }],
  },
  {
    category: 'Deals',
    name: 'Deal 11',
    variants: [{ size: '1 Grill Burger, 1 Reg Fries, 1 Reg Drink', price: 600 }],
  },
  {
    category: 'Deals',
    name: 'Deal 12',
    variants: [{ size: '10 Pcs Nuggets, 1 Large Pizza (Reg Flavor), 1 Zinger Burger, 1.5 Ltr Drink', price: 2490 }],
  },
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('products');

    console.log('Clearing existing products...');
    await collection.deleteMany({});

    console.log(`Adding ${menuItems.length} products...`);
    await collection.insertMany(menuItems);

    console.log('Seeding successful!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seed();
