/*  app.js  */
import { auth, db } from './firebase-init.js';
import {
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

  const emailEl      = document.getElementById('email');
  const passEl       = document.getElementById('password');
  const btnLogin     = document.getElementById('btnLogin');
  const btnRegister  = document.getElementById('btnRegister');

  /* garante login persistente */
  setPersistence(auth, browserLocalPersistence);

  /* --- LOGIN --- */
  btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
      window.location.href = 'dashboard.html';
    } catch (err) {
      alert('Erro no login: ' + err.message);
    }
  });

  /* --- REGISTRO --- */
  btnRegister.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        emailEl.value.trim(),
        passEl.value
      );

      /* cria documento base no Firestore */
      await setDoc(doc(db, 'progresso', cred.user.uid), {
        email: cred.user.email,
        assistidos: [],
        categorias_concluidas: [],
        certificado_emitido: false
      });

      window.location.href = 'dashboard.html';
    } catch (err) {
      alert('Erro no cadastro: ' + err.message);
    }
  });
});
