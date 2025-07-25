document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const pixelBackground = document.querySelector('.pixel-background');

for (let i = 0; i < 100; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.style.left = `${Math.random() * 100}vw`;
    pixel.style.top = `${Math.random() * 100}vh`;
    pixel.style.animationDelay = `${Math.random() * 5}s`;
    pixelBackground.appendChild(pixel);
}
