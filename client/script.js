
const navbar = document.querySelector('.nav');
const placeholder = document.querySelector('.nav-placeholder');
if(window.location.href==='http://127.0.0.1:5500/client/dashboard.html' && !localStorage.getItem('authToken')){
    window.location.href='landingPage.html'

}
if(window.location.href==='http://127.0.0.1:5500/client/landingPage.html' && localStorage.getItem('authToken')){
    window.location.href='http://127.0.0.1:5500/client/dashboard.html'
}
window.addEventListener('scroll', function() {
    if (window.scrollY > 41) {
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.width = '100%';
        navbar.style.zIndex='1000'
        placeholder.style.display = 'block'; // Show the placeholder
    } else {
        navbar.style.position = 'relative';
        placeholder.style.display = 'none'; // Hide the placeholder
    }
});

function calculateCartIcon(){
    if(localStorage.getItem('authToken')){
        let cartIcon = document.getElementById('cart-icon');
    let cartData = JSON.parse(localStorage.getItem('cartData'))||[];
    console.log(cartData)
    cartIcon.innerText=(cartData.map((x)=>x.quantity)).reduce((x,y)=>x+y,0)
    }
    else{
        
        return ;
    }
    
}

calculateCartIcon();

  const carousel = document.querySelector('.carousel1');
        const slides = document.querySelectorAll('.slide');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentSlide = 0;
        let autoPlayInterval;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            updateDots();
            resetAutoPlay();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(currentSlide);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && currentSlide < slides.length - 1) {
                    // Swipe left
                    goToSlide(currentSlide + 1);
                } else if (diff < 0 && currentSlide > 0) {
                    // Swipe right
                    goToSlide(currentSlide - 1);
                }
            }
        }

        // Start autoplay
        resetAutoPlay();

let pData=document.getElementById('p-data');
const username=document.getElementById('username')
const btnLog=document.getElementById('logout');
const userData=JSON.parse(localStorage.getItem('userData'));
pData.innerHTML=userData[0];
if(userData.length>6){
    username.innerHTML=userData[0]+userData[1]+userData[2]+userData[3]+userData[4]+userData[5]+'.'+'.'+'.'+'.'
}
else{
    username.innerHTML=userData
}
function logoutfunc(e){
    e.preventDefault();
  if(localStorage.getItem('authToken')){
    localStorage.removeItem('authToken')
    window.location.href='http://127.0.0.1:5500/client/landingPage.html'
  }
  
}
btnLog.addEventListener('click',logoutfunc)
