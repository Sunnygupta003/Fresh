import express from 'express';
import cors from 'cors';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products as initialProducts, customerOrders as initialOrders } from './src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'database.xlsx');

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// Serve the built frontend (dist folder)
app.use(express.static(path.join(__dirname, 'dist')));

// ─── Helper Functions ─────────────────────────────────────────────────────────
const getFreshnessLabel = (harvestDate) => {
  if (!harvestDate) return 'Fresh';
  const harvest = new Date(harvestDate);
  const today = new Date();
  harvest.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffMs = today - harvest;
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (days <= 2) return 'Fresh';
  if (days <= 5) return 'Moderate';
  return 'Consume Soon';
};

// Safe Excel read helper — prevents crash if sheet is empty
const readSheet = (workbook, sheetName) => {
  const ws = workbook.Sheets[sheetName];
  if (!ws) return [];
  return xlsx.utils.sheet_to_json(ws);
};

// Save a specific sheet back to workbook
const saveSheet = (workbook, sheetName, data) => {
  workbook.Sheets[sheetName] = xlsx.utils.json_to_sheet(data);
  xlsx.writeFile(workbook, DB_FILE);
};

// Parse boolean fields coming from Excel
const parseBool = (val) => val === true || val === 'true' || val === 'TRUE' || val === 1;

// ─── Database Initialization ──────────────────────────────────────────────────
const REQUIRED_SHEETS = ['Products', 'Contacts', 'BulkOrders', 'Users', 'Orders'];

const initDB = () => {
  let workbook;
  let needsWrite = false;

  if (!fs.existsSync(DB_FILE)) {
    workbook = xlsx.utils.book_new();
    needsWrite = true;

    // Seed Products
    const seededProducts = initialProducts.map(p => ({
      ...p,
      freshnessStatus: getFreshnessLabel(p.harvestDate),
    }));
    const productsSheet = xlsx.utils.json_to_sheet(seededProducts);
    xlsx.utils.book_append_sheet(workbook, productsSheet, 'Products');

    // Seed Orders
    const ordersSheet = xlsx.utils.json_to_sheet(initialOrders);
    xlsx.utils.book_append_sheet(workbook, ordersSheet, 'Orders');

    // Empty sheets
    for (const name of ['Contacts', 'BulkOrders', 'Users']) {
      const emptySheet = xlsx.utils.json_to_sheet([]);
      xlsx.utils.book_append_sheet(workbook, emptySheet, name);
    }
  } else {
    workbook = xlsx.readFile(DB_FILE);

    for (const name of REQUIRED_SHEETS) {
      if (!workbook.SheetNames.includes(name)) {
        let sheetData = [];

        if (name === 'Products') {
          sheetData = initialProducts.map(p => ({
            ...p,
            freshnessStatus: getFreshnessLabel(p.harvestDate),
          }));
        } else if (name === 'Orders') {
          sheetData = initialOrders;
        }

        const sheet = xlsx.utils.json_to_sheet(sheetData);
        xlsx.utils.book_append_sheet(workbook, sheet, name);
        needsWrite = true;
      }
    }
  }

  if (needsWrite) {
    xlsx.writeFile(workbook, DB_FILE);
    console.log('✅ database.xlsx initialized with sheets:', REQUIRED_SHEETS.join(', '));
  } else {
    console.log('✅ database.xlsx loaded — sheets:', workbook.SheetNames.join(', '));
  }
};

initDB();

// ═══════════════════════════════════════════════════════════════════════════════
// ██  AUTH APIs
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/auth/google — Google OAuth login/register
app.post('/api/auth/google', (req, res) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Decode the Google JWT token (base64 payload)
    const payload = JSON.parse(
      Buffer.from(credential.split('.')[1], 'base64').toString()
    );

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Could not extract email from Google token' });
    }

    const userRole = role || 'customer';

    const workbook = xlsx.readFile(DB_FILE);
    const users = readSheet(workbook, 'Users');

    let user = users.find(u => u.Email === email);

    if (user) {
      user.LastLogin = new Date().toISOString();
      const idx = users.findIndex(u => u.Email === email);
      users[idx] = user;
    } else {
      user = {
        GoogleID: googleId,
        Name: name,
        Email: email,
        Picture: picture || '',
        Role: userRole,
        Status: 'active',
        CreatedAt: new Date().toISOString(),
        LastLogin: new Date().toISOString(),
      };
      users.push(user);
    }

    saveSheet(workbook, 'Users', users);

    res.json({
      success: true,
      user: {
        googleId: user.GoogleID,
        name: user.Name,
        email: user.Email,
        picture: user.Picture,
        role: user.Role,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ██  USERS APIs
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/users — List all users (for Admin dashboard)
app.get('/api/users', (req, res) => {
  try {
    const workbook = xlsx.readFile(DB_FILE);
    const users = readSheet(workbook, 'Users');
    res.json(users);
  } catch (error) {
    console.error('Error reading users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/:email — Update user status/role (Admin)
app.put('/api/users/:email', (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body; // { Status, Role, ... }

    const workbook = xlsx.readFile(DB_FILE);
    const users = readSheet(workbook, 'Users');

    const idx = users.findIndex(u => u.Email === email);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Apply allowed updates
    if (updates.Status) users[idx].Status = updates.Status;
    if (updates.Role) users[idx].Role = updates.Role;

    saveSheet(workbook, 'Users', users);
    res.json(users[idx]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ██  PRODUCTS APIs
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/products — List all products
app.get('/api/products', (req, res) => {
  try {
    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Products');

    const formatted = data.map(p => ({
      ...p,
      id: Number(p.id),
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      stock: Number(p.stock),
      rating: Number(p.rating),
      reviews: Number(p.reviews),
      organic: parseBool(p.organic),
      bulkAvailable: parseBool(p.bulkAvailable),
      farmerId: Number(p.farmerId),
      freshnessStatus: getFreshnessLabel(p.harvestDate),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/:id — Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const productId = Number(req.params.id);
    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Products');

    const product = data.find(p => Number(p.id) === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      ...product,
      id: Number(product.id),
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      stock: Number(product.stock),
      rating: Number(product.rating),
      reviews: Number(product.reviews),
      organic: parseBool(product.organic),
      bulkAvailable: parseBool(product.bulkAvailable),
      farmerId: Number(product.farmerId),
      freshnessStatus: getFreshnessLabel(product.harvestDate),
    });
  } catch (error) {
    console.error('Error reading product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/products — Add a new product
app.post('/api/products', (req, res) => {
  try {
    const { name, category, description, price, unit, stock, organic, harvestDate, season, bulkAvailable, farmer, farmerId, location, image } = req.body;

    if (!name || !category || !price || !stock) {
      return res.status(400).json({ error: 'Missing required fields: name, category, price, stock' });
    }

    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Products');

    const maxId = data.reduce((max, p) => (Number(p.id) > max ? Number(p.id) : max), 0);
    const cleanHarvestDate = harvestDate || new Date().toISOString().split('T')[0];

    const newProduct = {
      id: maxId + 1,
      name,
      category,
      price: Number(price),
      unit: unit || 'kg',
      originalPrice: Math.round(Number(price) * 1.25),
      stock: Number(stock),
      rating: 5.0,
      reviews: 0,
      organic: parseBool(organic),
      farmer: farmer || 'Ravi Kumar',
      farmerId: Number(farmerId) || 1,
      location: location || 'Nashik, MH',
      image: image || 'https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=400&q=80',
      description: description || '',
      harvestDate: cleanHarvestDate,
      freshnessStatus: getFreshnessLabel(cleanHarvestDate),
      season: season || 'All Season',
      bulkAvailable: parseBool(bulkAvailable),
    };

    data.push(newProduct);
    saveSheet(workbook, 'Products', data);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/products/:id — Update a product
app.put('/api/products/:id', (req, res) => {
  try {
    const productId = Number(req.params.id);
    const updates = req.body;

    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Products');

    const idx = data.findIndex(p => Number(p.id) === productId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Merge updates
    const updatedProduct = { ...data[idx], ...updates };

    // Recalculate derived fields
    if (updates.price) updatedProduct.price = Number(updates.price);
    if (updates.stock) updatedProduct.stock = Number(updates.stock);
    if (updates.harvestDate) {
      updatedProduct.freshnessStatus = getFreshnessLabel(updates.harvestDate);
    }

    data[idx] = updatedProduct;
    saveSheet(workbook, 'Products', data);

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/products/:id — Delete a product
app.delete('/api/products/:id', (req, res) => {
  try {
    const productId = Number(req.params.id);

    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Products');

    const idx = data.findIndex(p => Number(p.id) === productId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deleted = data.splice(idx, 1)[0];
    saveSheet(workbook, 'Products', data);

    res.json({ message: 'Product deleted', product: deleted });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ██  ORDERS APIs
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/orders — List all orders
app.get('/api/orders', (req, res) => {
  try {
    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Orders');
    res.json(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/orders — Place a new order
app.post('/api/orders', (req, res) => {
  try {
    const { total, items, address, farmer, customerEmail } = req.body;

    if (!total || !items) {
      return res.status(400).json({ error: 'Missing required fields: total, items' });
    }

    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Orders');

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      total: Number(total),
      items: typeof items === 'string' ? items : JSON.stringify(items),
      farmer: farmer || '',
      address: address || '',
      customerEmail: customerEmail || '',
      CreatedAt: new Date().toISOString(),
    };

    data.push(newOrder);
    saveSheet(workbook, 'Orders', data);

    res.status(201).json({ ...newOrder, items: typeof items === 'string' ? JSON.parse(items) : items });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/orders/:id — Update order status
app.put('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryPartnerId } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Orders');

    const idx = data.findIndex(o => o.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    data[idx].status = status.toLowerCase();
    if (deliveryPartnerId) data[idx].deliveryPartnerId = deliveryPartnerId;

    saveSheet(workbook, 'Orders', data);
    res.json(data[idx]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ██  BULK ORDERS APIs
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/bulk-orders — List all bulk orders
app.get('/api/bulk-orders', (req, res) => {
  try {
    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'BulkOrders');

    const formatted = data.map(o => ({
      ...o,
      ProductID: Number(o.ProductID),
      FarmerID: Number(o.FarmerID),
      Quantity: Number(o.Quantity),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error reading bulk orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/bulk-orders — Create a new bulk order
app.post('/api/bulk-orders', (req, res) => {
  try {
    const { customerName, phone, productId, productName, farmerId, quantity, deliveryDate, message } = req.body;

    if (!customerName || !phone || !productId || !quantity || !deliveryDate) {
      return res.status(400).json({ error: 'Missing required fields: customerName, phone, productId, quantity, deliveryDate' });
    }

    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'BulkOrders');

    const orderId = `BO-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      OrderID: orderId,
      CustomerName: customerName,
      Phone: phone,
      ProductID: Number(productId),
      ProductName: productName || '',
      FarmerID: Number(farmerId) || 1,
      Quantity: Number(quantity),
      DeliveryDate: deliveryDate,
      Message: message || '',
      Status: 'pending',
      CreatedAt: new Date().toISOString().split('T')[0],
    };

    data.push(newOrder);
    saveSheet(workbook, 'BulkOrders', data);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating bulk order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/bulk-orders/:id — Update bulk order status
app.put('/api/bulk-orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'BulkOrders');

    const idx = data.findIndex(o => o.OrderID === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Bulk order not found' });
    }

    data[idx].Status = status.toLowerCase();
    saveSheet(workbook, 'BulkOrders', data);

    res.json(data[idx]);
  } catch (error) {
    console.error('Error updating bulk order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/bulk-orders/:id — Delete a bulk order
app.delete('/api/bulk-orders/:id', (req, res) => {
  try {
    const { id } = req.params;

    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'BulkOrders');

    const idx = data.findIndex(o => o.OrderID === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Bulk order not found' });
    }

    const deleted = data.splice(idx, 1)[0];
    saveSheet(workbook, 'BulkOrders', data);

    res.json({ message: 'Bulk order deleted', order: deleted });
  } catch (error) {
    console.error('Error deleting bulk order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ██  CONTACTS APIs
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/contacts — List all contact submissions
app.get('/api/contacts', (req, res) => {
  try {
    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Contacts');
    res.json(data);
  } catch (error) {
    console.error('Error reading contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/contact — Submit a contact message
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required: name, email, message' });
    }

    const newEntry = {
      Date: new Date().toISOString(),
      Name: name,
      Email: email,
      Message: message,
    };

    const workbook = xlsx.readFile(DB_FILE);
    const data = readSheet(workbook, 'Contacts');
    data.push(newEntry);

    saveSheet(workbook, 'Contacts', data);

    res.status(200).json({ message: 'Contact saved successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ██  DASHBOARD / STATS APIs
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/stats — Platform-wide stats for admin dashboard
app.get('/api/stats', (req, res) => {
  try {
    const workbook = xlsx.readFile(DB_FILE);
    const products = readSheet(workbook, 'Products');
    const users = readSheet(workbook, 'Users');
    const orders = readSheet(workbook, 'Orders');
    const bulkOrders = readSheet(workbook, 'BulkOrders');
    const contacts = readSheet(workbook, 'Contacts');

    const freshCount = products.filter(p => {
      const label = getFreshnessLabel(p.harvestDate);
      return label === 'Fresh';
    }).length;

    const organicCount = products.filter(p => parseBool(p.organic)).length;

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    res.json({
      totalProducts: products.length,
      freshProducts: freshCount,
      organicProducts: organicCount,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalBulkOrders: bulkOrders.length,
      totalContacts: contacts.length,
      totalRevenue,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    });
  } catch (error) {
    console.error('Error computing stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ██  API STATUS & FRONTEND CATCH-ALL
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api — API status and available endpoints
app.get('/api', (req, res) => {
  res.json({
    status: '🟢 running',
    name: 'Fresh Produce API Server',
    version: '2.0.0',
    database: 'Excel (database.xlsx)',
    endpoints: {
      auth: [
        'POST /api/auth/google',
      ],
      users: [
        'GET  /api/users',
        'PUT  /api/users/:email',
      ],
      products: [
        'GET    /api/products',
        'GET    /api/products/:id',
        'POST   /api/products',
        'PUT    /api/products/:id',
        'DELETE /api/products/:id',
      ],
      orders: [
        'GET    /api/orders',
        'POST   /api/orders',
        'PUT    /api/orders/:id',
      ],
      bulkOrders: [
        'GET    /api/bulk-orders',
        'POST   /api/bulk-orders',
        'PUT    /api/bulk-orders/:id',
        'DELETE /api/bulk-orders/:id',
      ],
      contacts: [
        'GET  /api/contacts',
        'POST /api/contact',
      ],
      stats: [
        'GET /api/stats',
      ],
    },
  });
});

// Catch-all: serve frontend for any non-API route (SPA support)
app.get('{*path}', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: 'Frontend not built. Run: npm run build',
      hint: 'For development, use http://localhost:5173 (Vite dev server)',
    });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  🌿 Fresh Produce API Server                    ║');
  console.log(`║  🚀 Running on http://localhost:${PORT}             ║`);
  console.log('║  📊 Database: database.xlsx                     ║');
  console.log('║  📡 API Docs: http://localhost:3001/api          ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});
