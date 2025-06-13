```javascript
import { auth, db } from './firebase-init.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Função de login
async function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const erro = document.getElementById('erro');
  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = 'dashboard.html';
  } catch (e) {
    erro.innerText = 'Credenciais inválidas';
  }
}

// Função de registro
async function registrar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const erro = document.getElementById('erro');
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, 'progresso', uid), {
      email,
      assistidos: [],
      categorias_concluidas: [],
      certificado_emitido: false,
      data_certificado: null
    });
    window.location.href = 'dashboard.html';
  } catch (e) {
    erro.innerText = 'Erro ao registrar: ' + e.message;
  }
}

// Função de logout
function logout() {
  signOut(auth).then(() => window.location.href = 'index.html');
}

// Event listeners e controle de rota
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnLogin').addEventListener('click', login);
  document.getElementById('btnRegistrar').addEventListener('click', registrar);
  onAuthStateChanged(auth, user => {
    if (window.location.pathname.includes('dashboard') && !user) {
      window.location.href = 'index.html';
    }
  });
});
```
