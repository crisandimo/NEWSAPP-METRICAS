import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Asegúrate de importar autenticación

// Configuración de Firebase (verifica que los valores sean correctos en la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyBUR5fNG_AH4lsFoxD-LAkwaE6wmH6-WpE",
  authDomain: "newsapp2-52095.firebaseapp.com",
  projectId: "newsapp2-52095",
  storageBucket: "newsapp2-52095.appspot.com",
  messagingSenderId: "984849227363",
  appId: "1:984849227363:web:b3b311b12a153317eca256"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app); // Inicializar autenticación

// Exportar Firestore y Auth para usarlos en la app
export { db, auth };

  