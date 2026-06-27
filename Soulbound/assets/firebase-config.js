// ============================================================
// CONFIGURACIÓN DE FIREBASE
// ------------------------------------------------------------
// 1. Ve a https://console.firebase.google.com/ y crea un proyecto (gratis).
// 2. Dentro del proyecto: "Compilación" -> "Firestore Database" -> "Crear base de datos"
//    (elige modo "producción", cualquier región).
// 3. En "Reglas" de Firestore pega esto para empezar rápido (luego puedes
//    restringirlo, ver README.md):
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /{document=**} {
//          allow read, write: if true;
//        }
//      }
//    }
//
// 4. En el proyecto: ícono de engrane -> "Configuración del proyecto" -> en
//    "Tus apps" crea una app Web (</>) y copia el objeto firebaseConfig aquí abajo.
// ============================================================

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyB_-vjzxiPiQuqvAP0V_W1gsQTc97o6zeA",
  authDomain: "othenhein.firebaseapp.com",
  projectId: "othenhein",
  storageBucket: "othenhein.firebasestorage.app",
  messagingSenderId: "452145216548",
  appId: "1:452145216548:web:fd2206a0d23ba18dd7ecb1",
  measurementId: "G-J6D6JB91E1"
};

