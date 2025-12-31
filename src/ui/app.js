const productName = document.querySelector('#name');
const productPrice = document.querySelector('#price');
const productDescription = document.querySelector('#description');
const productForm = document.querySelector('#productForm');
const productsList = document.querySelector('#products');
let products = [];
let editingStatus = false;
let editingProductId ;

async function getAndRenderProducts() {
	try {
		const products = await window.api.getProducts();
		productsList.innerHTML = '';
		products.forEach(product => {
			productsList.innerHTML += `
			
			<div class="card card-body my-2 animate__animated animate__fadeInLeft">
				<h4>${product.name}</h4>
				<p>${product.price} FCFA</p>
				<h3>${product.description}</h3>
				<p>
				<button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
				<button class="btn btn-secondary btn-sm" onclick="editProduct(${product.id})">Update</button>
				</p>
			</div>

			
			`;
		});
	} catch (error) {
		console.error('Error:', error);
	}
}

init();

async function init() {
	getAndRenderProducts();
}


productForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	try {
		const newProduct = {
			name: productName.value,
			price: productPrice.value,
			description: productDescription.value
		};

		if (editingStatus) {
			newProduct.id = editingProductId;
			const updatedProduct = await window.api.updateProduct(newProduct);
			console.log('Product updated:', updatedProduct);
			editingStatus = false;
			editingProductId = null;
			productForm['btnProductForm'].innerText = 'Save';
		} else {
			const savedProduct = await window.api.createProduct(newProduct);
			console.log('Product saved:', savedProduct);
		}
		productForm.reset();
		productName.focus();
		getAndRenderProducts();
	} catch (error) {
		console.error('Error:', error);
	}
});

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  await window.api.deleteProduct(id);
	getAndRenderProducts();
}

async function editProduct(id) {
	const product = await window.api.getProductById(id);
	productName.value = product.name;
	productPrice.value = product.price;
	productDescription.value = product.description;
	editingStatus = true;
	editingProductId = id;
	productForm['btnProductForm'].innerText = 'Update';
}
