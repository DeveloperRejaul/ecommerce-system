/** **********************************************************************************************************************
                                                header part
 *********************************************************************************************************************** */
const navLinks = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('section');
const homeLink = document.querySelector('.nav .nav-btn');
const header = document.querySelector('.header');
const menuButton = document.getElementById('menu-btn');
const closeButton = document.getElementById('close-btn');

// Mobile menu toggle
menuButton.addEventListener('click', () => {
  header.classList.add('menu-open'); // Toggle 'menu-open' class on header
});
closeButton.addEventListener('click', () => {
  header.classList.remove('menu-open'); // Toggle 'menu-open' class on header
});

// Remove 'menu-open' class when screen width is 768px or larger
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    header.classList.remove('menu-open');
  }
});

navLinks.forEach((link) => link.addEventListener('click', handleNavClick));

function handleNavClick(e) {
  e.preventDefault(); // Prevent the default anchor click behavior

  // Remove 'active' class from all nav links
  navLinks.forEach((nav) => nav.classList.remove('active'));
  this.classList.add('active'); // Add 'active' class to the clicked nav link

  // Get the target section ID from the href attribute of the clicked link
  const targetId = this.getAttribute('href').substring(1);
  const targetSection = document.getElementById(targetId);

  if (targetSection) {
    window.scrollTo({
      top: targetSection.offsetTop - 70,
      behavior: 'smooth',
    });
  }
}

// Scroll navigation active handle
window.addEventListener('scroll', handleScroll);

function handleScroll() {
  const scrollPosition = window.scrollY + 100;
  let isActive = false;

  if (window.scrollY < 100) {
    header.classList.remove('scroll-header');
  } else {
    header.classList.add('scroll-header');
  }

  // If scroll is at the top, make the Home link active
  if (window.scrollY < 300) {
    navLinks.forEach((link) => link.classList.remove('active'));
    if (homeLink) homeLink.classList.add('active');
    return;
  }

  // Loop through all sections and check if the current scroll position is inside a section
  sections.forEach((section) => {
    const sectionId = section.id;
    const matchingNavLink = document.querySelector(`.nav .nav-btn[href="#${sectionId}"]`);

    if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
      navLinks.forEach((link) => link.classList.remove('active'));
      if (matchingNavLink) {
        matchingNavLink.classList.add('active');
        isActive = true;
      }
    }
  });

  // If no section is currently active, set the Home link as active
  if (!isActive) {
    navLinks.forEach((link) => link.classList.remove('active'));
    if (homeLink) homeLink.classList.add('active');
  }
}
