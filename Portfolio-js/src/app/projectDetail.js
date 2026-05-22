import data from './data.json';

// Función para obtener el ID del proyecto de la URL
const getProjectIdFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};

// Función para renderizar mensaje de proyecto no encontrado
const renderNotFound = () => {
  const container = document.querySelector('#projectDetail');

  if (!container) return;

  container.innerHTML = `
    <div class="projectDetail_notFound">
      <h2>Proyecto no encontrado</h2>
      <p>No se ha podido cargar la ficha del proyecto. Comprueba que la URL es correcta e inténtalo de nuevo.</p>
      <a href="./projects.html" class="projectDetail_back button">Volver a Proyectos</a>
    </div>
  `;
};

// Función para renderizar la información del proyecto
const renderProjectDetail = (project) => {
  const container = document.querySelector('#projectDetail');

  if (!container) return;

  const tagsHTML = project.tags.map((tag) => `<h3 class="tag">${tag}</h3>`).join('');

  const descriptionHTML = project.description.map((paragraph) => `<p>${paragraph}</p>`).join('');

  const imagesHTML = project.imgs
    .map(
      (img) => `
        <img src="${img.url}" alt="${img.alt}" />
    `,
    )
    .join('');

  container.innerHTML = `
          <div class="pagePadding projectDetail_content">
            <h1 class="title">${project.title}</h1>
            <div class="projectInfo">
              <div class="projectInfo_group">
                <h4>Categorías</h4>
                <h3 class="tag">${project.year}</h3>
                ${tagsHTML}
              </div>
              <div class="projectInfo_group">
                <h4>Descripción</h4>
                ${descriptionHTML}
              </div>
            </div>
          </div>
          <div class="projectDetail_galery">${imagesHTML}</div>
  `;
};

// Función que funcione la página de detalle del proyecto
export const initProjectDetail = async () => {
  const projectId = getProjectIdFromQuery();

  if (!projectId) {
    renderNotFound();
    return;
  }

  const project = data.projects.find((project) => project.id === projectId);

  if (!project) {
    renderNotFound();
    return;
  }

  renderProjectDetail(project);
};

document.addEventListener('DOMContentLoaded', initProjectDetail);
