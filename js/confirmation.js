/**
 * Permet de recupérer l'orderId
 *
 */
function getOrderId() {
    const orderId = document.getElementById('orderId')

    orderId.innerText = localStorage.getItem('orderId')
    localStorage.clear()
}
getOrderId()