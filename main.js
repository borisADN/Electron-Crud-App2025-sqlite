const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const { getConnection } = require('./database');

let mainWindow;

async function createProduct(product) {
  const db = await getConnection();
  const result = await db.run(
    'INSERT INTO product (name, price, description) VALUES (?, ?, ?)',
    [product.name, product.price, product.description]
  );
  product.id = result.lastID;

  new Notification({
    title: 'Product Created',
    body: `Product ${product.name} created successfully!`
  }).show();

  return product;
}

async function getProducts() {
  const db = await getConnection();
  return await db.all('SELECT * FROM product ORDER BY id DESC');
}

// async function updateProduct(product) {
//   const db = await getConnection();
//   await db.run(
//     'UPDATE product SET name = ?, price = ?, description = ? WHERE id = ?',
//     [product.name, product.price, product.description, product.id]
//   );
// }

async function updateProduct(product) {
  const db = await getConnection();
  await db.run(
    'UPDATE product SET name = ?, price = ?, description = ? WHERE id = ?',
    [product.name, product.price, product.description, product.id]
  );
  new Notification({
    title: 'Product Updated',
    body: `Product ${product.name} updated successfully!`
  }).show();
}

async function deleteProduct(id) {
  const db = await getConnection();
  await db.run('DELETE FROM product WHERE id = ?', [id]);
}

async function getProductById(id) {
  const connection = await getConnection();
  const results = await connection.query('SELECT * FROM product WHERE id = ?', [id]);
  return results[0];
}

function createWindow() {

  const splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    center: true
  });

  splash.loadFile('src/ui/splash.html');

  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('src/ui/index.html');

  // mainWindow.on('ready-to-show', () => mainWindow.show());
  mainWindow.once('ready-to-show', () => {
    splash.destroy(); // on ferme le splash
    mainWindow.show(); // on affiche la fenêtre principale
  });
}

app.whenReady().then(createWindow);

ipcMain.handle('product:create', async (_, product) => {
  return await createProduct(product);
});

ipcMain.handle('product:list', async () => {
  return await getProducts();
});

ipcMain.handle('product:delete', async (_, id) => {
  await deleteProduct(id);
  return true;
});

ipcMain.handle('product:update', async (_, product) => {
  await updateProduct(product);
  return true;
});

ipcMain.handle('product:getById', async (_, id) => {
  return await getProductById(id);
});

module.exports = {
  createWindow
};
