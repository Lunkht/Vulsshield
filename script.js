document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const pixelBackground = document.querySelector('.pixel-background');

// Pixels replaced by a CSS grid background; no need to generate pixel elements
if (pixelBackground) {
    // Intentionally left empty to avoid creating pixel nodes
}
