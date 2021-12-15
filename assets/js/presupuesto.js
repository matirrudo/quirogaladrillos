const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}
let totalFinal = 0

//Events
//El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', e => { fetchData() });
cards.addEventListener('click', e => { addCarrito(e) });
items.addEventListener('click', e => { btnBorrar(e) })

// Traer products
const fetchData = async () => {
    const res = await fetch('https://api.alfadev.com.ar/products');
    const data = await res.json()
    pintarCards(data)
}

// Mostrar products
const pintarCards = data => {
    let position = 1;
    data.forEach(item => {
        templateCard.querySelector('#card-name').textContent = item.name
        templateCard.querySelector('#card-name-m').textContent = item.name
        templateCard.querySelector('#price').setAttribute('value', item.price)
        templateCard.querySelector('img').setAttribute('src', item.imageUrl)
        templateCard.querySelector('button').dataset.id = position
        position++
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// Agregar al carrito
const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = item => {
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('#price').value,
        id: item.querySelector('button').dataset.id,
        cantidad: parseInt(item.querySelector('#quantity').value)
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad =  carrito[producto.id].cantidad + parseInt(item.querySelector('#quantity').value)
    }
    carrito[producto.id] = { ...producto } //copia de carrito
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5"> <p class="mbr-text mbr-fonts-style display-7"> Lista vacia. Añada un producto</p></th>
        `
        return
    }
    
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    totalFinal = nPrecio

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        let cartList = []
        const cartKeys = Object.keys(carrito) //extrar un array con los nombres de los atributos
        
        for(let i = 0; i<cartKeys.length; i++){
            const total = carrito[cartKeys[i]].cantidad * carrito[cartKeys[i]].precio
            cartList.push({...carrito[cartKeys[i]], 'total':'$'+total}) //añade el elemento del carrito mas su total
        }

        printJS({
            printable:cartList,
            type:'json',
            properties:[
                {field:'title', displayName:'Producto'}, 
                {field:'cantidad', displayName:'Cantidad'}, 
                {field:'precio', displayName:'Precio unitario'}, 
                {field:'total', displayName:'Precio total'},
            ],
            gridHeaderStyle: 'border: 2px solid #3971A5;',
	        gridStyle: 'border: 2px solid #3971A5;',
            font:"Courier New",
            header: `
            <h3 class="fontConsole">Quiroga Ladrillos - Presupuesto</h3> 
            <br> 
            <h3 class="fontConsole">Precio total final: $${totalFinal}</h3>
            `,
            style: `@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300&display=swap');
            .fontConsole { font-family: "Lucida Console", "Courier New", monospace; }`,
            font: 'Lucida Console'
        })
    })
}

const btnBorrar = e => {
    if (e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        delete carrito[producto.id]
        pintarCarrito()
    }
}