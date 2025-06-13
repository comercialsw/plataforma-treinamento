/* videos.js */
import { auth, db } from './firebase-init.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

const videos = [
  { id: '4dkCJjV0d6Y', titulo: 'Segurança', categoria: 'Apresentação Modelos' },
  { id: 'IbthtipprPs', titulo: 'Dicas', categoria: 'Dicas Smartway' }
];

const container       = document.getElementById('video-container');
const categoriaSelect = document.getElementById('categoriaSelect');
let userUID          = null;
let assistidos       = [];

// Quando o auth muda
onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.replace('index.html');
  } else {
    userUID = user.uid;
    const ref = doc(db, 'progresso', userUID);
    const snap = await getDoc(ref);
    assistidos = snap.exists() ? snap.data().assistidos : [];
    preencherCategorias();
    filtrar(categoriaSelect.value);

    // Logout
    document.getElementById('btnLogout')
      .addEventListener('click', () => signOut(auth));
  }
});

// Monta select de categoriasunction preencherCategorias() {
  [...new Set(videos.map(v => v.categoria))]
    .forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      categoriaSelect.appendChild(opt);
    });
  categoriaSelect
    .addEventListener('change', () => filtrar(categoriaSelect.value));
}

// Exibe vídeos filtrados
async function filtrar(cat) {
  container.innerHTML = '';
  for (const v of videos.filter(x => x.categoria === cat)) {
    const visto = assistidos.includes(v.id);
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <h3>${v.titulo}</h3>
      <iframe src="https://www.youtube.com/embed/${v.id}" allowfullscreen></iframe>
      <button ${visto ? 'disabled' : ''} onclick="marcar('${v.id}', this)">
        ${visto ? '✔ Já assistido' : '✅ Marcar como assistido'}
      </button>
    `;
    container.appendChild(card);
  }
}

// Marca e salva no Firestore
window.marcar = async (videoId, btn) => {
  const ref = doc(db, 'progresso', userUID);
  await updateDoc(ref, { assistidos: arrayUnion(videoId) });
  btn.textContent = '✔ Já assistido';
  btn.disabled = true;
};
