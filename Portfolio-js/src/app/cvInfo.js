// Información del CV de la página del about (Sobre mí)
export const renderCvInfo = (data) => {
  const container = document.querySelector('#cvInfo');

  let html = '';

  for (let i = 0; i < data.cv.length; i++) {
    html += `
      <div class="cvInfo_group">
        <h5 class="title">${data.cv[i].title}</h5>
        <ul class="list">
          ${data.cv[i].content.map((item) => `<li class="h3">${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (container) {
    container.innerHTML = html;
  }
};
