// Función para renderizar el grid de proyectos
const renderProjectsGrid = (projects) => {
  const container = document.querySelector('#projectsGrid');

  let html = '';

  projects.forEach((project) => {
    html += `
      <a href="./project.html?id=${project.id}" class="projectCard_link">
        <article class="projectCard">
          <div class="projectCard_image">
            <img src="${project.imgs[0].url}" alt="${project.imgs[0].alt}" />
          </div>
          <div class="projectCard_content">
            <h3 class="title">${project.title}</h3>
            <span class="tags">
                  ${project.tags.map((tag) => `<h5 class="tag">${tag}</h5>`).join('')}
            </span>
          </div>
        </article>
      </a>
    `;
  });

  container.innerHTML = html;
};

// Función para renderizar la lista de proyectos
const renderProjectsList = (projects) => {
  const container = document.querySelector('#projectsList');

  let html = '';

  projects.forEach((project) => {
    let tagsHTML = '';

    for (let i = 0; i < project.tags.length; i++) {
      tagsHTML += `<h5 class="tag">${project.tags[i]}</h5>`;
    }

    html += `
      <a href="./project.html?id=${project.id}" class="projectCard_link">
        <article class="projectCard">
          <div class="projectCard_image">
            <img src="${project.imgs[0].url}" alt="${project.imgs[0].alt}" />
          </div>
          <div class="projectCard_content">
            <div class="year">${project.year}</div>
            <div class="info">
              <h3 class="title">${project.title}</h3>
              <p class="description">
                  ${project.description[0]}
              </p>
            </div>
            <span class="tags">
              ${tagsHTML}
            </span>
          </div>
        </article>
      </a>
    `;
  });

  container.innerHTML = html;
};

// Función para cambiar entre vista grid y lista
const setDisplay = (mode, gridSection, listSection) => {
  if (mode === 'grid') {
    gridSection.style.display = 'grid';
    listSection.style.display = 'none';
  }

  if (mode === 'list') {
    gridSection.style.display = 'none';
    listSection.style.display = 'flex';
  }
};

// Función para cambiar el estilo del botón activo
const setActiveButtonStyle = (activeButton, inactiveButton) => {
  activeButton.classList.add('active');
  inactiveButton.classList.remove('active');
};

// Función principal para que funcione la galería de proyectos
export const projectsGalery = (projects) => {
  // selectores de contenedores
  const gridSection = document.querySelector('#projectsGrid');
  const listSection = document.querySelector('#projectsList');
  // selectores de botones
  const gridButton = document.querySelector('#displayGrid');
  const listButton = document.querySelector('#displayList');

  // display inicial
  if (gridSection && listSection && projects) {
    setActiveButtonStyle(gridButton, listButton);
    setDisplay('grid', gridSection, listSection);
  }

  // display GRID
  if (gridSection && projects) {
    renderProjectsGrid(projects);
    gridButton.addEventListener('click', () => {
      setDisplay('grid', gridSection, listSection);
      setActiveButtonStyle(gridButton, listButton);
    });
  }
  // display LIST
  if (listSection && projects) {
    renderProjectsList(projects);
    listButton.addEventListener('click', () => {
      setDisplay('list', gridSection, listSection);
      setActiveButtonStyle(listButton, gridButton);
    });
  }
};
