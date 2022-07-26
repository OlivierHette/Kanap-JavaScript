/**
 *
 * Il requêter l'API pour recuper l'ensemble des produits
 * Puis inserer chaque élement dans la l'index(DOM)
 * 
 * RECUPERER Objet produit
 * POUR chaque OBJET produit
 * AJOUTER dans le DOM
 * http://localhost:3000/api/products/
 */

const URL_PRODUCTS = 'http://localhost:3000/api/products/'


/**
 * Fonction permettant de recuper les objets 
 * et les affichers directement dans le DOM
 */
const getProducts = async function () {
    try {
        let response = await fetch(URL_PRODUCTS)
        let data = await response.json()
        for(var i = 0; i < data.length; i++){
            let currentSection = document.querySelector('#items')
            
            // Liens 
            let newLink = document.createElement('a')
            newLink.setAttribute(`href`, `./product.html?id=${data[i]._id}`)
            currentSection.appendChild(newLink)

            // Articles
            let newArticle = document.createElement('article')
            newLink.appendChild(newArticle)

            // Images
            let newImg = document.createElement('img')
            newImg.setAttribute(`src`, data[i].imageUrl) // newImg.src = `${data[i].imageUrl}` 
            newImg.setAttribute(`alt`, data[i].altTxt)
            newArticle.appendChild(newImg)

            // Titres
            let newH3 = document.createElement('h3')
            newH3.className = 'productName'
            newH3.textContent = data[i].name
            newArticle.appendChild(newH3)

            // Descriptions
            let newP = document.createElement('p')
            newP.className = 'productDescription'
            newP.textContent = data[i].description
            newArticle.appendChild(newP)

        }
    } catch (e) {
        console.error(e)
    }
}
getProducts()