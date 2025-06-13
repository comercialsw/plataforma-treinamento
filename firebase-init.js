/* firebase-init.js ---------------------------------------------- */
/*  SDK 11.27.0 + long-polling  ---------------------------------- */

import { initializeApp }       from 'https://www.gstatic.com/firebasejs/11.27.0/firebase-app.js';
import { getAuth }             from 'https://www.gstatic.com/firebasejs/11.27.0/firebase-auth.js';
import { initializeFirestore } from 'https://www.gstatic.com/firebasejs/11.27.0/firebase-firestore.js';

/* — Configuração do projeto (substitua pelos seus valores) — */
const firebaseConfig = {
  apiKey:            'AIzaSyCTJ1qxAmxW8tksXBi8hFLchSnuvSAYQfY',
  authDomain:        'smartway-treinamentos.firebaseapp.com',
  projectId:         'smartway-treinamentos',
  storageBucket:     'smartway-treinamentos.appspot.com',
  messagingSenderId: '389500401009',
  appId:             '1:389500401009:web:22182df458fc133cc072d0',
  databaseURL:       'https://smartway-treinamentos-default-rtdb.firebaseio.com'
};

/* — Inicialização — */
const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/* Força long-polling → evita erro 400 em hosts estáticos (GitHub Pages) */
export const db   = initializeFirestore(app, { experimentalForceLongPolling: true });

