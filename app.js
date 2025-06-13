/* app.js -----------------------------------------------------------
 * - SDK atualizado para 11.27.0
 * - Imports consistentes (não reinicializa Firebase aqui)
 * - Persistência tratada com promessa
 * ----------------------------------------------------------------- */

import { auth, db } from './firebase-init.js';

import {
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut           // se não usar, pode remover este import
} from 'https://www.gstatic.com/firebasejs/11.27.0/firebase-auth.js';

import {
  doc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/11.27.0/firebase-firestore.js';

/* 1) Persistência de login (localStorage) */
setPersistence(auth, browserLocalPersistence).catch(console.error);

/* 2) Elementos do DOM */
const emailEl     = document.getElementById('email');
const passEl      = document.getElementById('password');
const btnLogin    = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const errorEl     = document.getElementById('error');

/* 3) Função de login */
btnLogin.addEventListener('click', async () => {
  errorEl.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
    window.location.href = 'dashboard.html';
  } catch (e) {
    errorEl.textContent = 'Usuário ou senha inválidos.';
    console.error(e);
  }
});

/* 4) Função de registro */
btnRegister.addEventListener('click', async () => {
  errorEl.textContent = '';
  if (!emailEl.value || !passEl.value) {
    errorEl.textContent = 'Preencha e-mail e senha.';
    return;
  }
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      emailEl.value.trim(),
      passEl.value
    );

    // cria documento inicial de progresso
    await setDoc(doc(db, 'progresso', cred.user.uid), {
      email: cred.user.email,
      assistidos: [],
      categorias_concluidas: [],
      certificado_emitido: false
    });

    window.location.href = 'dashboard.html';
  } catch (e) {
    errorEl.textContent = 'Erro no cadastro: ' + e.message;
    console.error(e);
  }
});

/* 5) Proteção de rota: dashboard requer usuário autenticado */
onAuthStateChanged(auth, user => {
  const inDashboard = window.location.pathname.includes('dashboard');
  if (inDashboard && !user) {
    window.location.replace('index.html');
  }
});
