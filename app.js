```javascript
import { auth } from './firebase-init.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

window.logout = function () {
  signOut(auth).then(() => window.location.href = "index.html");
};

onAuthStateChanged(auth, (user) => {
  if (window.location.pathname.includes("dashboard") && !user) {
    window.location.href = "index.html";
  }
});
```
