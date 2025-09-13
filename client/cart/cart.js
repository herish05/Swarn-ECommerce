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
  usernameSpan.textContent = userData.slice(0,6)+'....';
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


function requireLogin() {
  if (!isLoggedIn()) {
    Toastify({
      text:'Please Log In',
      duration:3000,
      close:true,
      draggable:true,
      backgroundColor:'#F44336',
      stopOnFocus:true
    }).showToast();
    return false;
  }
  return true;
}

let cartData = JSON.parse(localStorage.getItem('cartData')) || [];

function calculateCartIcon() {
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

async function loadCartData() {
  if (!requireLogin()) return;

  const products = await fetch('./cart.json').then(res => res.json());

  const cartContainer = document.querySelector('.cart-items');
  cartContainer.innerHTML = '';

  cartData.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);

    if (product) {
      const itemHTML = `
        <div class="cart-item" data-id="${cartItem.id}" data-base-price="${parseFloat(product.price.replace(',', ''))}">
          <img src="${product.img}" alt="${product.name}" class="product-image" />
          <div class="product-details">
            <h3>${product.name}</h3>
            <div class="priceincart">₹${product.price}</div>
            <div class="quantity-controls">
            <div>
              <button class="quantity-btn minus">-</button>
              <span>${cartItem.quantity}</span>
              <button class="quantity-btn plus">+</button>
              </div>
            </div>
            <div class="button-group">
              <button class="remove-btn">Remove</button>
            </div>
          </div>
        </div>
      `;

      cartContainer.insertAdjacentHTML('afterbegin', itemHTML);
    }
  });

  setupEventListeners();
  updateTotalPrice();
}

function updateTotalPrice() {
  let totalBasePrice = 0;

  document.querySelectorAll('.cart-item').forEach(item => {
    const quantity = parseInt(item.querySelector('.quantity-controls span').textContent);
    const basePrice = parseFloat(item.dataset.basePrice);
    totalBasePrice += basePrice * quantity;
  });

  document.querySelector('.total-price').textContent = `₹${totalBasePrice}`;
}

function setupEventListeners() {
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function () {
      if (!requireLogin()) return;

      const item = this.closest('.cart-item');
      const quantitySpan = item.querySelector('.quantity-controls span');
      let quantity = parseInt(quantitySpan.textContent);
      const cartItem = cartData.find(cartItem => cartItem.id === item.dataset.id);

      if (this.textContent === '+' && quantity < 10) {
        quantity++;
      } else if (this.textContent === '-' && quantity > 1) {
        quantity--;
      }

      if (cartItem) {
        cartItem.quantity = quantity;
        localStorage.setItem('cartData', JSON.stringify(cartData));
      }

      quantitySpan.textContent = quantity;
      updateTotalPrice();
      calculateCartIcon(); 
    });
  });

  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function () {
      if (!requireLogin()) return;

      const item = this.closest('.cart-item');
      const itemId = item.dataset.id;

      cartData = cartData.filter(cartItem => cartItem.id !== itemId);
      localStorage.setItem('cartData', JSON.stringify(cartData));

      item.remove();
      updateTotalPrice();
      calculateCartIcon();
    });
  });
}

window.onload = loadCartData;
