import gsap from 'gsap';

import data from './data.json';

// Animación de scroll infinito en la págima home
// Inicializa el carrusel infinito de imágenes
// 1. Selecciona los contenedores de las columnas
// 2. Limpia su contenido previo
// 3. Extrae las imágenes desde el JSON de `data.projects`
// 4. Reparte las imágenes en dos columnas alternadas
// 5. Inserta las imágenes en el DOM
// 6. Espera a que todas carguen
// 7. Rellena cada columna para evitar huecos en el scroll
// 8. Duplica el contenido para poder hacer un bucle infinito
// 9. Lanza la animación con GSAP
// 10. Añade un listener de resize con debounce
export const initInfiniteScroll = async () => {
  const groups = document.querySelectorAll('.infiniteScroll_group');

  if (groups.length < 2) return;

  // limpiamos contenido previo
  groups.forEach((group) => {
    group.innerHTML = '';
  });

  const evenImages = [];
  const oddImages = [];

  // extraemos imágenes del JSON
  const allImages = data.projects.flatMap((project) =>
    project.imgs.map((img) => ({
      src: img.url,
      alt: img.alt || project.title,
    })),
  );

  // repartimos imágenes entre columnas
  allImages.forEach((image, index) => {
    if (index % 2 === 0) {
      evenImages.push(image);
    } else {
      oddImages.push(image);
    }
  });

  // renderizamos
  renderImages(groups[0], evenImages);
  renderImages(groups[1], oddImages);

  // esperamos a que carguen
  await waitForImages();

  // rellenamos para evitar huecos
  fillGroup(groups[0]);
  fillGroup(groups[1]);

  // duplicamos para loop infinito
  duplicateGroup(groups[0]);
  duplicateGroup(groups[1]);

  // iniciamos GSAP
  startInfiniteAnimation();

  // recalcular al redimensionar
  window.addEventListener('resize', debounce(resetInfiniteScroll, 300));
};

// Crea elementos <img> para cada imagen y los añade al grupo pasado.
// Usa un DocumentFragment para insertar el contenido de forma eficiente.
const renderImages = (group, images) => {
  const fragment = document.createDocumentFragment();

  images.forEach((image) => {
    const img = document.createElement('img');

    img.src = image.src;
    img.alt = image.alt;

    img.classList.add('img');

    img.loading = 'lazy';
    img.decoding = 'async';

    fragment.appendChild(img);
  });

  group.appendChild(fragment);
};

// Esperar a que carguen las imágenes y fallback
const waitForImages = async () => {
  const images = document.querySelectorAll('.img');

  await Promise.all(
    [...images].map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      });
    }),
  );
};

// Clona el contenido del grupo hasta que su altura/ancho sea suficiente
// Móvil --> Ancho
// Desktop --> Alto
// El bucle tiene un límite de seguridad para evitar copiar infinitamente
const fillGroup = (group) => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // necesitamos bastante contenido
  const minSize = isMobile ? window.innerWidth * 4 : window.innerHeight * 4;

  const originalChildren = [...group.children];

  const getSize = () => (isMobile ? group.scrollWidth : group.scrollHeight);

  let safety = 0;

  while (getSize() < minSize && safety < 20) {
    originalChildren.forEach((child) => {
      const clone = child.cloneNode(true);
      group.appendChild(clone);
    });

    safety++;
  }
};

// Duplica todos los hijos del grupo para poder desplazar el contenido sin cortes
const duplicateGroup = (group) => {
  const children = [...group.children];

  children.forEach((child) => {
    const clone = child.cloneNode(true);
    group.appendChild(clone);
  });
};

// Animación
// Inicia la animación infinita sobre cada grupo
// Alterna la dirección entre las columnas y aplica un wrapping para que el desplazamiento se repita sin fin
const startInfiniteAnimation = () => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  document.querySelectorAll('.infiniteScroll_group').forEach((group, index) => {
    gsap.killTweensOf(group);

    gsap.set(group, {
      x: 0,
      y: 0,
    });

    const size = isMobile ? group.scrollWidth / 2 : group.scrollHeight / 2;

    const direction = index % 2 === 0 ? -1 : 1;

    // wrapper infinito
    const wrap = gsap.utils.wrap(-size, 0);

    gsap.to(group, {
      x: isMobile ? direction * size : 0,

      y: !isMobile ? direction * size : 0,

      // En duration se controla la velocidad de la animación
      duration: 100,
      ease: 'none',
      repeat: -1,

      modifiers: {
        x: (value) => {
          if (!isMobile) return '0px';

          return `${wrap(parseFloat(value))}px`;
        },

        y: (value) => {
          if (isMobile) return '0px';

          return `${wrap(parseFloat(value))}px`;
        },
      },
    });
  });
};

// Reseteo de la animación al cambiar el ancho de la ventana
// Mata las animaciones, limpia los grupos y vuelve a inicializar todo.
const resetInfiniteScroll = async () => {
  const groups = document.querySelectorAll('.infiniteScroll_group');

  gsap.killTweensOf(groups);

  groups.forEach((group) => {
    group.innerHTML = '';
    group.style.transform = '';
  });

  await initInfiniteScroll();
};

// -------------------------
// DEBOUNCE
// -------------------------

// Devuelve una función que retrasa la ejecución de `func` hasta que
// hayan pasado `delay` ms desde la última llamada.
const debounce = (func, delay) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
