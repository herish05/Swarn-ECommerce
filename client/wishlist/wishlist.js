let wishlistData = JSON.parse(localStorage.getItem('wishlistData')) || [];

function isLoggedIn() {
  return localStorage.getItem('authToken') !== null;
}
if (localStorage.getItem('authToken')) {
    const account = document.getElementById('account');
    if (account) account.style.display = 'none';
    const navIcons = document.querySelector('.nav-icons');
  
    const profileLink = document.createElement('a');
    const pRound = document.createElement('div');
    pRound.classList.add('p-round');
    const pData = document.createElement('p');
    pData.id = 'p-data';
    const userData = JSON.parse(localStorage.getItem('userData'));
    pData.textContent = userData ? userData[0] : 'User'; 
  
    
    pRound.appendChild(pData);
  
   
    profileLink.appendChild(pRound);
    const usernameSpan = document.createElement('span');
    usernameSpan.id = 'username';
    usernameSpan.textContent = userData.length>6?userData.slice(0,6)+'...':userData;
    profileLink.appendChild(usernameSpan);
    navIcons.appendChild(profileLink);
    const logoutButton = document.createElement('button');
    logoutButton.id = 'logout';
    logoutButton.type = 'submit';
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('authToken'); 
      window.location.href = 'http://127.0.0.1:5500/client/landingPage.html'; 
    });
    navIcons.appendChild(logoutButton);
  }
  


async function loadWishlistData() {
    const products = await fetch('../cart/cart.json').then(res => res.json());

    const wishlistContainer = document.querySelector('.wishlistContainer');
    wishlistContainer.innerHTML = ''; 
    let wishlistData = JSON.parse(localStorage.getItem('wishlistData')) || [];

    wishlistData.forEach(wishlistItem => {
        const product = products.find(p => p.id === wishlistItem.id);
        if (product) {
            const itemHTML = `
                <div class="item">
                    <img src="${product.img}" alt="${product.name}">
                    <div class="info">
                        <h3 class="name">${product.name}</h3>
                        <h6>₹${product.price}</h6>
                    </div>
                    <div class="buttons">
                        <button class="add-to-cart" data-id="${product.id}">Add To Cart</button>
                        <button class="remove" data-id="${product.id}">Remove</button>
                    </div>
                </div>
            `;
            wishlistContainer.innerHTML += itemHTML; // Append the item HTML to the container
        }
    });
}

function removeFromWishlist(id) {
    let wishlistData = JSON.parse(localStorage.getItem('wishlistData')) || [];
    wishlistData = wishlistData.filter(item => item.id !== id);
    localStorage.setItem('wishlistData', JSON.stringify(wishlistData));
    // location.reload();
    loadWishlistData();
}

function addToCart(id) {
    let wishlistData = JSON.parse(localStorage.getItem('wishlistData')) || [];
    let cartData = JSON.parse(localStorage.getItem('cartData')) || [];

    const itemToAdd = wishlistData.find(item => item.id === id);
    if (itemToAdd) {
        const existsInCart = cartData.some(item => item.id === id);
        if (!existsInCart) {
            cartData.push(itemToAdd);
            localStorage.setItem('cartData', JSON.stringify(cartData));
            removeFromWishlist(id); 
            Toastify({
                text: "Item added to cart!",
                duration: 3000,
                gravity: "top",
                position: 'right',
                backgroundColor: "#4CAF50",
            }).showToast();
        calculateCartIcon();

        } else {
            Toastify({
                text: "Item already exists in the cart.",
                duration: 3000,
                gravity: "top",
                position: 'right',
                backgroundColor: "#FF5722",
            }).showToast();
        }
    }
}

document.querySelector('.wishlistContainer').addEventListener('click', (event) => {
    if (event.target.classList.contains('remove')) {
        const id = event.target.getAttribute('data-id');
        removeFromWishlist(id);
    } else if (event.target.classList.contains('add-to-cart')) {
        const id = event.target.getAttribute('data-id');
        addToCart(id);
    }
});

function calculateCartIcon() {
let cartData = JSON.parse(localStorage.getItem('cartData')) || [];

  let cartIcon = document.getElementById('cart-icon');

  if (isLoggedIn()) {
   
    const itemCount = cartData
      .map(x => x.quantity)
      .reduce((x, y) => x + y, 0);
    cartIcon.innerText = itemCount;
    cartIcon.style.display = 'block'; 
  } else {
    cartIcon.style.display = 'none'; 
  }
}

calculateCartIcon();


// Load the wishlist on page load
window.onload = loadWishlistData;