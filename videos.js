```javascript
import { auth, db } from './firebase-init.js';
import { doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const videos = [
  { id: "XxVg_s8xAms", titulo: "Segurança", categoria: "Apresentação Modelos" },
  { id: "dQw4w9WgXcQ", titulo: "Dicas", categoria: "Dicas Smartway" }
];

const container = document.getElementById('video-container');
const categoriaSelect = document.getElementById('categoriaSelect');
let userUID = null;
let videosAssistidos = [];

onAuthStateChanged(auth, async user => {
  if (user) {
    userUID = user.uid;
    const progressoRef = doc(db, 'progresso', userUID);
    const snap = await getDoc(progressoRef);
    if (snap.exists()) {
      videosAssistidos = snap.data().assistidos || [];
      preencherCategorias();
      renderizarVideos(categoriaSelect.value);
    }
  }
});

function preencherCategorias() {
  const categorias = [...new Set(videos.map(v => v.categoria))];
  categorias.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categoriaSelect.appendChild(opt);
  });
}

function renderizarVideos(cat) {
  container.innerHTML = '';
  videos.filter(v => v.categoria === cat).forEach(v => {
    const assistido = videosAssistidos.includes(v.id);
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <h3>${v.titulo}</h3>
      <iframe src="https://www.youtube.com/embed/${v.id}" allowfullscreen></iframe>
      <br>
      <button ${assistido ? 'disabled' : ''} onclick="marcarAssistido('${v.id}', this)">
        ${assistido ? '✔ Já assistido' : '✅ Marcar como assistido'}
      </button>
    `;
    container.appendChild(card);
  });
}

window.marcarAssistido = async function(videoId, botao) {
  if (!userUID) return;
  const ref = doc(db, 'progresso', userUID);
  await updateDoc(ref, { assistidos: arrayUnion(videoId) });
  botao.innerText = '✔ Já assistido';
  botao.disabled = true;
};
```
