const socket = io()

socket.on('update-products', (product) => {
    const productDiv = document.createElement('div')
    productDiv.id = `product-${product._id}`
    productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p><strong>Descripción:</strong> ${product.description}</p>
        <p><strong>Código:</strong> ${product.code}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <p><strong>Categoría:</strong> ${product.category}</p>
        <button onclick="deleteProduct('${product._id}')">Eliminar</button>
        <hr>
    `
    document.getElementById('listadoProductos').appendChild(productDiv)
})

socket.on('remove-product', (productId) => {
    const productDiv = document.getElementById(`product-${productId}`)
    if (productDiv) {
        productDiv.remove()
    }
})

function deleteProduct(productId) {
    fetch(`/realtimeproducts/${productId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error al eliminar el producto')
        }
    })
}

document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const product = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: parseInt(formData.get('code')),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        category: formData.get('category')
    }

    fetch('/realtimeproducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => {        
        if (!data.error) {
            alert(data)
            socket.emit('new-product', data)
        }
    })
    .catch(error => console.error('Error:', error))
})