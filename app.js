```javascript
/* app.js */
import { auth, db } from './firebase-init.js';
import {
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

// Persistência de login
setPersistence(auth, browserLocalPersistence);

// Elementos do DOM
const emailEl     = document.getElementById('email');
const passEl      = document.getElementById('password');
const btnLogin    = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const errorEl     = document.getElementById('error');

// Função de login
btnLogin.addEventListener('click', async () => {
  errorEl.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, emailEl.value.trim(), passEl.value);
    window.location.href = 'dashboard.html';
  } catch (e) {
    errorEl.textContent = 'Usuário ou senha inválidos.';
  }
});

// Função de registro
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
    await setDoc(doc(db, 'progresso', cred.user.uid), {
      email: cred.user.email,
      assistidos: [],
      categorias_concluidas: [],
      certificado_emitido: false
    });
    window.location.href = 'dashboard.html';
  } catch (e) {
    errorEl.textContent = 'Erro no cadastro: ' + e.message;
  }
});

// Proteção de rota (se for dashboard e não tiver usuário logado, redireciona)
onAuthStateChanged(auth, user => {
  if (window.location.pathname.includes('dashboard') && !user) {
    window.location.replace('index.html');
  }
});
```
