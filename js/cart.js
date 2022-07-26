const currentSection = document.querySelector('#cart__items')
const URL_PRODUCTS_POST = 'http://localhost:3000/api/products/order'
const URL_PRODUCTS = 'http://localhost:3000/api/products/'

let productLocalStorage = JSON.parse(localStorage.getItem("productObj"))
console.table(productLocalStorage)

/**
 * Permet de recupérer les produits depuis l'API
 *
 * @return {*} Renvoie un tableau des produits de l'API
 */
const getProducts = async function () {
    let reponse = await fetch(URL_PRODUCTS)
    let products = await reponse.json()
    return products
}
/**
 * Permet de récuperer le prix du produit
 *
 * @param {*} idProduct Recupère l'id du localStorage
 * @return {*} Renvoie le prix de la requête API
 */
const getPrice = async (idProduct) => {
    let tab = await getProducts()
    let productPrice = tab.find( product => product._id === idProduct)

    return productPrice.price
}
/**
 * Permet d'ajouter au DOM tous les produits
 *
 */
const getCart = async function () {
    for(let product in productLocalStorage) {
    const idProduct = productLocalStorage[product].productId
        // Articles
    let newArticle = document.createElement('article')
    document.querySelector('#cart__items').appendChild(newArticle)
    newArticle.className = 'cart__item'
    newArticle.setAttribute('data-id', idProduct)
        // Div IMG
        let newDivImg = document.createElement('div')
        newArticle.appendChild(newDivImg)
        newDivImg.className = 'cart__item__img'
            // IMG
            let productImg = document.createElement('img')
            newDivImg.appendChild(productImg)
            productImg.alt = productLocalStorage[product].productAlt
            productImg.src = productLocalStorage[product].productImg
        // Div contenu
        let newDivProductContent = document.createElement('div')
        newArticle.appendChild(newDivProductContent)
        newDivProductContent.className = 'cart__item__content'
            // Div contenu description
            let newDivContentDesc = document.createElement('div')
            newDivProductContent.appendChild(newDivContentDesc)
            newDivContentDesc.className = 'cart__item__content__description'
                // Nom produit
                let newTitleProduct = document.createElement('h2')
                newDivContentDesc.appendChild(newTitleProduct)
                newTitleProduct.innerHTML = productLocalStorage[product].productName
                // Couleur Produit
                let newColorProduct = document.createElement('p')
                newDivContentDesc.appendChild(newColorProduct)
                newColorProduct.innerHTML = productLocalStorage[product].productColor
                // Prix produit
                let newPriceProduct = document.createElement('p')
                newDivContentDesc.appendChild(newPriceProduct)
                newPriceProduct.innerHTML = await getPrice(idProduct) + ' €'
                // newPriceProduct.innerHTML = productLocalStorage[product].productPrice + ' €'
            // Div contenu options
            let newDivProductSetting = document.createElement('div')
            newDivProductContent.appendChild(newDivProductSetting)
            newDivProductSetting.className = 'cart__item__content__settings'
                // Div contenu options quantité
                let newDivProductQuantity = document.createElement('div')
                newDivProductSetting.appendChild(newDivProductQuantity)
                newDivProductQuantity.className = 'cart__item__content__settings__quantity'
                    // Quantité produit séléctionné
                    let newQuantityProduct = document.createElement('p')
                    newDivProductQuantity.appendChild(newQuantityProduct)
                    newQuantityProduct.innerHTML = 'Qté : '
                    // Input modification quantité
                    let newInputPrdoduct = document.createElement('input')
                    newDivProductQuantity.appendChild(newInputPrdoduct)
                    newInputPrdoduct.type = 'number'
                    newInputPrdoduct.className = 'itemQuantity'
                    newInputPrdoduct.name = 'itemQuantity'
                    newInputPrdoduct.min = '1'
                    newInputPrdoduct.max = '100'
                    newInputPrdoduct.value = productLocalStorage[product].productQuantity
                // Div suppression des options
                let newDivOptionsDel = document.createElement('div')
                newDivProductSetting.appendChild(newDivOptionsDel)
                newDivOptionsDel.className = 'cart__item__content__settings__delete'
                    // Bouton suppression option
                    let newDelProduct = document.createElement('p')
                    newDivOptionsDel.appendChild(newDelProduct)
                    newDelProduct.className = 'deleteItem'
                    newDelProduct.innerHTML = 'Supprimer'
    }
    if (productLocalStorage != null || productLocalStorage.length === 1) {
        console.log('On rentre dans le if ?');
        getTotal()
        modifyQuantity()
        deletePoduct()
    }
}()

/**
 * Permet de renvoyer le total du prix et la quantité
 *
 */
const getTotal = async function() {
    let elmtQuantity = document.getElementsByClassName('itemQuantity')
    let elmtQuantityLength = elmtQuantity.length
    let totalQuantity = 0

    for (let i = 0; i < elmtQuantityLength; ++i) {
        totalQuantity += elmtQuantity[i].valueAsNumber
    }

    let productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.innerHTML = totalQuantity;

    totalPrice = 0;

    for (let i = 0; i < elmtQuantityLength; ++i) {
        const idProduct = productLocalStorage[i].productId
        let productPrice = await getPrice(idProduct)

        totalPrice += (elmtQuantity[i].valueAsNumber * productPrice)
    }

    let productTotalPrice = document.getElementById('totalPrice')
    productTotalPrice.innerHTML = totalPrice;
}
/**
 * Permet de modifier la quantité des produits
 *
 */
const modifyQuantity = function () {
    console.log('On rentre dans modifyQuantity');
    let itemQuantity = document.querySelectorAll('.itemQuantity')
    
    for(let j = 0; j < itemQuantity.length; j++) {
        itemQuantity[j].addEventListener("change", (e) => {
            e.preventDefault()

            let newQuantityValue = itemQuantity[j].valueAsNumber

            productLocalStorage[j].productQuantity = newQuantityValue
            localStorage.setItem('productObj', JSON.stringify(productLocalStorage))

            location.reload()
        })
    }
}
/**
 * Permet de supprimer un produit du panier
 *
 */
const deletePoduct = function () {
    let deleteItem = document.querySelectorAll('.deleteItem')
    
    for(let m = 0; m < deleteItem.length; m++) { 
        deleteItem[m].addEventListener('click', (e) => {
            e.preventDefault()

            let tabProducts = productLocalStorage.splice(m, 1)

            localStorage.setItem('productObj', JSON.stringify(productLocalStorage))
            location.reload()
            
            // let idToDelete = productLocalStorage[m].productId
            // let colorToDelete = productLocalStorage[m].productColor
            // // On renvoie tous les id qui sont différent de celui a supprimer
            // productLocalStorage = productLocalStorage.filter( item => item.productId !== idToDelete || item.productColor !== colorToDelete)
            // localStorage.setItem('productObj', JSON.stringify(productLocalStorage))
        })
    }
}
/** 
 * Permet de vérifier la qualité des informations rentré dans les inputs
 * @type {*} 
 * 
 * */
const getVerifOrderForm = function () {
    let orderForm = document.querySelector('.cart__order__form')

    //Création des expressions régulières
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$')
    let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$")
    let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+")

    orderForm.firstName.addEventListener('change', function() {
        verifFirstName(this)
    })
    /**
     * Permet de verifier la qualité des informations 
     * dans le input firstName
     *
     * @param {*} firstName Recupère l'input concerné
     */
    const verifFirstName = function(firstName) {
        let firstNameErrorMsg = firstName.nextElementSibling

        if(charRegExp.test(firstName.value)){
            firstNameErrorMsg.innerHTML = ''
        } else {
            firstNameErrorMsg.innerHTML = 'Le prénom doit uniquement comporter des lettres, des tirets ou des points.'
        }
    }

    orderForm.lastName.addEventListener('change', function() {
        verifLastName(this)
    })
    /**
     *  Permet de verifier la qualité des informations 
     * dans le input lastName
     *
     * @param {*} lastName Recupère l'input concerné
     */
    const verifLastName = function(lastName) {
        let lastNameErrorMsg = lastName.nextElementSibling

        if(charRegExp.test(lastName.value)){
            lastNameErrorMsg.innerHTML = ''
        } else {
            lastNameErrorMsg.innerHTML = 'Le nom doit uniquement comporter des lettres, des tirets ou des points.'
        }
    }

    orderForm.address.addEventListener('change', function() {
        verifAdress(this)
    })
    /**
     *Permet de verifier la qualité des informations 
     * dans le input adress
     *
     * @param {*} address Recupère l'input concerné
     */
    const verifAdress = function(address) {
        let addressErrorMsg = address.nextElementSibling

        if(addressRegExp.test(address.value)){
            addressErrorMsg.innerHTML = ''
        } else {
            addressErrorMsg.innerHTML = 'L\'adresse doit commencer par un chiffre.'
        }
    }

    orderForm.city.addEventListener('change', function() {
        verifCity(this)
    })
    /**
     *Permet de verifier la qualité des informations 
     * dans le input city
     *
     * @param {*} city Recupère l'input concerné
     */
    const verifCity = function(city) {
        let cityErrorMsg = city.nextElementSibling

        if(charRegExp.test(city.value)){
            cityErrorMsg.innerHTML = ''
        } else {
            cityErrorMsg.innerHTML = 'La Ville doit uniquement comporter des lettres, des tirets ou des points.'
        }
    }

    orderForm.email.addEventListener('change', function() {
        verifEmail(this)
    })
    /**
     *Permet de verifier la qualité des informations 
     * dans le input email
     *
     * @param {HTMLElement} email Recupère l'input concerné
     */
    const verifEmail = function(email) {
        let emailErrorMsg = email.nextElementSibling

        if(emailRegExp.test(email.value)){
            emailErrorMsg.innerHTML = ''
            getOrderForm()
        } else {
            emailErrorMsg.innerHTML = 'L\'email doit uniquement comporter des lettres, des chiffres, des tirets ou des points.'
        }
    }
}()

/** 
 * Permet de recupérer l'order de la commande
 * @type {object} Récupère l'ordre de commande et les contacts du client
 * */
const getOrderForm = function () {
    const orderBtn = document.getElementById('order')

    orderBtn.addEventListener('click', function(e) {
        e.preventDefault()
        
        let firstName = document.getElementById('firstName')
        let lastName = document.getElementById('lastName')
        let address = document.getElementById('address')
        let city = document.getElementById('city')
        let email = document.getElementById('email')

        let tabProducts = []

        for(let i = 0; i < productLocalStorage.length; i++) {
            tabProducts.push(productLocalStorage[i].productId)
        }
        console.log('TabProducts :', tabProducts)
        const order = {
            contact: {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value,
            },
            products: tabProducts
        }
        postOrderForm(order)
    })
    
}
/**
 * Permet d'envoyer au serveur la commande
 *
 * @param {object} order
 */
async function postOrderForm(order) {
    const initRequest = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    }
    let response = await fetch(URL_PRODUCTS_POST, initRequest)
    let data = await response.json()
    console.log('fetch:', response)
    console.log('fetch.json()', data, 'data id:', data.orderId)

    if(response.ok) {
        localStorage.clear()
        localStorage.setItem('orderId', data.orderId)

        document.location.href = 'confirmation.html'
    }
}