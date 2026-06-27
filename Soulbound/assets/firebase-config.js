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

export const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "PEGA_AQUI.firebaseapp.com",
  projectId: "PEGA_AQUI",
  storageBucket: "PEGA_AQUI.appspot.com",
  messagingSenderId: "000000000000",
  appId: "PEGA_AQUI"
};
