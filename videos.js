/* videos.js ------------------------------------------------------ */
/*  SDK 11.9.1                                                     */
import { auth, db } from './firebase-init.js';

import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

import {
  doc, getDoc,
  updateDoc, arrayUnion
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

/* Vídeos de exemplo */
const videos = [
  { id: '4dkCJjV0d6Y', titulo: 'Segurança', categoria: 'Apresentação Modelos' },
  { id: 'IbthtipprPs', titulo: 'Dicas',      categoria: 'Dicas Smartway' }
];

/* DOM */
const container       = document.getElementById('video-container');
const categoriaSelect = document.getElementById('categoriaSelect');
const btnLogout       = document.getElementById('btnLogout');

let userUID    = null;
let assistidos = [];

/* Autenticação */
onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.replace('index.html');
    return;
  }

  userUID = user.uid;

  const ref  = doc(db, 'progresso', userUID);
  const snap = await getDoc(ref);
  assistidos = snap.exists() ? snap.data().assistidos : [];

  preencherCategorias();
  filtrar(categoriaSelect.value);

  btnLogout.addEventListener('click', () => {
    signOut(auth).then(() => window.location.replace('index.html'));
  });
});

/* Categorias */
function preencherCategorias() {
  categoriaSelect.innerHTML = '<option value="todas">Todas</option>';
  [...new Set(videos.map(v => v.categoria))].forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categoriaSelect.appendChild(opt);
  });
  categoriaSelect.addEventListener('change', () => filtrar(categoriaSelect.value));
}

/* Render */
function filtrar(cat) {
  container.innerHTML = '';
  const lista = cat === 'todas' ? videos : videos.filter(v => v.categoria === cat);

  lista.forEach(v => {
    const visto = assistidos.includes(v.id);
    const card  = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <h3>${v.titulo}</h3>
      <iframe src="https://www.youtube.com/embed/${v.id}"
              loading="lazy" allowfullscreen></iframe>
      <button ${visto ? 'disabled' : ''} onclick="marcar('${v.id}', this)">
        ${visto ? '✔ Assistido' : '✅ Marcar como assistido'}
      </button>`;
    container.appendChild(card);
  });
}

/* Marcar vídeo */
window.marcar = async (videoId, btn) => {
  await updateDoc(doc(db, 'progresso', userUID), {
    assistidos: arrayUnion(videoId)
  });
  btn.textContent = '✔ Assistido';
  btn.disabled    = true;
  assistidos.push(videoId);
};
