let currentUrlLocation = window.location.href
let url = new URL(currentUrlLocation)
let id = url.searchParams.get('id')

const URL_PRODUCT = `http://localhost:3000/api/products/${id}`
const pickedColor = document.querySelector('#colors')
const pickedQuantity = document.querySelector('#quantity')

/**
 * Permet de recuperer le produit depuis l'API
 */
const getProduct = async function () {
    try {
        let response = await fetch(URL_PRODUCT)
        let product = await response.json()
        console.log('product', product);
        getPost(product)      
    } catch (e) {
        console.error(e)
    }
}
getProduct()

/**
 * Permet de poster dans le DOM les éléments du produit
 * @param {*} product recupère le produit depuis la fonction getProduct()
 */
function getPost(product) {
    let itemImg = document.querySelector('.item__img')
    let newImg = document.createElement('img')
    newImg.src = product.imageUrl
    newImg.alt = product.altTxt
    itemImg.appendChild(newImg)

    let itemTitle = document.querySelector('#title')
    itemTitle.textContent = product.name

    let itemPrice = document.querySelector('#price')
    itemPrice.textContent = product.price

    let itemDesc = document.querySelector('#description')
    itemDesc.textContent = product.description

    // Ajoute toutes les options couleurs au DOM
    for(i = 0; i < product.colors.length; i++) {
        let itemOpt = document.querySelector('#colors')
        let newOpt = document.createElement('option')
        newOpt.value = product.colors[i]
        newOpt.textContent = product.colors[i]
        itemOpt.appendChild(newOpt)
    }
    addToCart(product)
}

/**
 * Permet d'ajouter au panier le produit
 * @param {*} product recupère le produit depuis la fonction getProduct()
 */
function addToCart (product) {
    const addToCardBtn = document.querySelector('#addToCart')
    addToCardBtn.addEventListener('click', function (e) {
        if(pickedQuantity.value > 0 && pickedQuantity.value <= 100 && pickedQuantity.value != 0 && pickedColor.value != '') {
            let userColor = pickedColor.value
            let userQuantity = pickedQuantity.value

            let objectProduct = {
                productId: product._id,
                productColor: userColor,
                productQuantity: Number(userQuantity),
                productName: product.name,
                productDesc: product.description,
                productImg: product.imageUrl,
                productAlt: product.altTxt
            }

            // On initialise le localStorage pour l'utiliser dans nos conditions
            let productLocalStorage = JSON.parse(localStorage.getItem("productObj"))

            /* Le panier est vide alors on ajoute le produit */
            if(!productLocalStorage) {
                productLocalStorage = []
                productLocalStorage.push(objectProduct)
                localStorage.setItem("productObj", JSON.stringify(productLocalStorage))
                console.table(productLocalStorage)
            /* Le panier contient déjà un produit */    
            } else {
                const resultFind = productLocalStorage.find( (el) => el.productId && el.productColor === userColor)
                /* Si le produit est déjà dans le panier */
                if(resultFind) {
                    let newQuantity = parseInt(objectProduct.productQuantity) + parseInt(resultFind.productQuantity)
                    resultFind.productQuantity = newQuantity
                    localStorage.setItem("productObj", JSON.stringify(productLocalStorage))
                    console.table(productLocalStorage)
                /* Si le produit est différent que celui déjà dans le panier */
                } else {
                    productLocalStorage.push(objectProduct)
                    localStorage.setItem("productObj", JSON.stringify(productLocalStorage))
                    console.table(productLocalStorage)
                }
            }
            window.location.href = "cart.html"
        } else {
            console.error('Couleur non séléctionné !!!')
        }
    })
}