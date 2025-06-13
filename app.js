/* app.js --------------------------------------------------------- */
/*  SDK 11.9.1                                                     */
import { auth, db } from './firebase-init.js';

import {
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

import {
  doc, setDoc
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

/* Persistência local */
setPersistence(auth, browserLocalPersistence).catch(console.error);

/* DOM */
const emailEl     = document.getElementById('email');
const passEl      = document.getElementById('password');
const btnLogin    = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const errorEl     = document.getElementById('error');

/* Login */
window.login = async () => {
  errorEl.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
    window.location.href = 'dashboard.html';
  } catch {
    errorEl.textContent = 'Usuário ou senha inválidos.';
  }
};

/* Registro */
window.register = async () => {
  errorEl.textContent = '';
  const email = emailEl.value.trim();
  const pwd   = passEl.value;
  if (!email || !pwd) { errorEl.textContent = 'Preencha e-mail e senha.'; return; }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pwd);
    await setDoc(doc(db, 'progresso', cred.user.uid), {
      email,
      assistidos: [],
      categorias_concluidas: [],
      certificado_emitido: false
    });
    window.location.href = 'dashboard.html';
  } catch (e) {
    errorEl.textContent = 'Erro no cadastro: ' + e.message;
  }
};

/* Proteção de rota */
onAuthStateChanged(auth, user => {
  if (window.location.pathname.includes('dashboard') && !user) {
    window.location.replace('index.html');
  }
});
