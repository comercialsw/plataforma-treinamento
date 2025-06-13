```javascript
/* firebase-init.js */
import { initializeApp }    from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js';
import { getAuth }          from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import { getFirestore }     from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            'AIzaSyCTJ1qxAmxW8tksXBi8hFLchSnuvSAYQfY',
  authDomain:        'smartway-treinamentos.firebaseapp.com',
  projectId:         'smartway-treinamentos',
  storageBucket:     'smartway-treinamentos.appspot.com',
  messagingSenderId: '389500401009',
  appId:             '1:389500401009:web:22182df458fc133cc072d0'
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
```
