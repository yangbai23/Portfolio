// Get the hamburger icon and the navigation list
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('nav-list');

// Add an event listener to toggle the "active" class when the hamburger is clicked
hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
});
