const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  createProduct: (product) => ipcRenderer.invoke('product:create', product),
	getProducts: () => ipcRenderer.invoke('product:list'),
	  deleteProduct: (id) => ipcRenderer.invoke('product:delete', id),
		updateProduct: (product) => ipcRenderer.invoke('product:update', product),
		getProductById: (id) => ipcRenderer.invoke('product:getById', id),


});

// Exposing database connection method - although direct database access from renderer is not recommended
contextBridge.exposeInMainWorld('database', {
	getConnection: () => ipcRenderer.invoke('database:getConnection')
});