```javascript
const videos = [
  { id: "XxVg_s8xAms", titulo: "Segurança", categoria: "Apresentação Modelos" },
  { id: "dQw4w9WgXcQ", titulo: "Dicas", categoria: "Dicas Smartway" }
];

const container = document.getElementById("video-container");
const categoriaSelect = document.getElementById("categoriaSelect");

const categorias = [...new Set(videos.map(v => v.categoria))];

categorias.forEach(c => {
  const opt = document.createElement("option");
  opt.value = c;
  opt.textContent = c;
  categoriaSelect.appendChild(opt);
});

window.filtrarCategoria = function () {
  const cat = categoriaSelect.value;
  container.innerHTML = "";
  videos.filter(v => v.categoria === cat).forEach(v => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <h3>${v.titulo}</h3>
      <iframe src="https://www.youtube.com/embed/${v.id}" allowfullscreen></iframe>
    `;
    container.appendChild(card);
  });
};
```

