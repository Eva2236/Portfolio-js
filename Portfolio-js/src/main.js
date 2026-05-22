import './style.css';
import './sass/style.scss';

import data from './app/data.json';

import { initInfiniteScroll } from './app/gsapAnimation.js';
import { projectsGalery } from './app/projectsGalery.js';
import { renderCvInfo } from './app/cvInfo.js';

document.addEventListener('DOMContentLoaded', async () => {
  renderFooter();
  responsiveMenu();

  projectsGalery(data.projects);
  renderCvInfo(data.profile);

  await initInfiniteScroll();
});

// Menu
const responsiveMenu = () => {
  const menuToggle = document.getElementById('menuToggle');
  const responsiveWebMenu = document.getElementById('responsiveWebMenu');

  if (!menuToggle || !responsiveWebMenu) return;

  menuToggle.addEventListener('click', () => {
    responsiveWebMenu.classList.toggle('hidden');

    menuToggle.textContent = responsiveWebMenu.classList.contains('hidden') ? 'Menú' : 'Cerrar';
  });
};

// Footer
const renderFooter = () => {
  const footer = document.querySelector('#webFooter');

  if (!footer) return;

  footer.innerHTML = `
    <p>Graphic Design Portfolio</p>
    <p>${data.profile.name}</p>
    <p>All Rights Reserved © 2026</p>
  `;
};
