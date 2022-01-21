const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-product-card').content
const fragment = document.createDocumentFragment()

document.addEventListener('DOMContentLoaded', e => { fetchData() });

const fetchData = async () => {
    const res = await fetch('https://api.quirogaladrillos.com.ar/products')
    const data = await res.json()
    paintCard(data)
}


const paintCard = data =>{
    data.forEach(product => {
        templateCard.querySelector('img').setAttribute('src', product.imageUrl)
        templateCard.querySelector('#card-title').textContent = product.name
        templateCard.querySelector('#card-description').textContent = product.description
        templateCard.querySelector('#card-dimensions').textContent = `- Dimensiones: ${product.sizeX}cm x ${product.sizeY}cm x ${product.sizeZ}cm`
        templateCard.querySelector('#card-volume').textContent = `- Volumen: ${product.sizeX * product.sizeY * product.sizeZ}cm3`
        templateCard.querySelector('#card-weight').textContent = `- Peso: ${product.weight}kg`
        templateCard.querySelector('#card-price').textContent = `$${product.price}/u`
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}
