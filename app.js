```javascript
import { auth, db } from './firebase-init.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.login = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erro");
  signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(() => {
      erro.innerText = "Credenciais inválidas";
    });
};

window.registrar = async function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erro");
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "progresso", uid), {
      email: email,
      assistidos: [],
      categorias_concluidas: [],
      certificado_emitido: false,
      data_certificado: null
    });
    window.location.href = "dashboard.html";
  } catch (e) {
    erro.innerText = "Erro ao registrar: " + e.message;
  }
};

window.logout = function () {
  signOut(auth).then(() => window.location.href = "index.html");
};

onAuthStateChanged(auth, (user) => {
  if (window.location.pathname.includes("dashboard") && !user) {
    window.location.href = "index.html";
  }
});
```
