# Soulbound Dashboard

Dashboard interactivo para campañas de **Soulbound: Age of Sigmar Roleplay**.
Incluye:
- `index.html` — roster de personajes (crear / abrir / eliminar)
- `character.html` — hoja de personaje completa, editable, sincronizada en tiempo real
- `dm.html` — vista maestra del Dungeon Master: tabla con todos los personajes, edición rápida de Wounds/Mettle/XP, y acceso para editar cualquier hoja completa

Los datos se guardan en **Firebase Firestore** (capa gratuita), así que cualquier cambio que haga el DM o un jugador se refleja casi al instante en las pantallas de los demás.

---

## 1. Crear el proyecto de Firebase (una sola vez)

1. Ve a https://console.firebase.google.com/ y crea un proyecto nuevo (gratis, no requiere tarjeta para esto).
2. En el menú lateral entra a **Compilación → Firestore Database → Crear base de datos**.
   - Elige cualquier ubicación.
   - Modo: **producción**.
3. Entra a **Firestore Database → Reglas** y pega esto para arrancar rápido:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

   > ⚠️ Esto deja la base de datos abierta a cualquiera que conozca tu `projectId`. Para una mesa privada normalmente es suficiente (nadie va a adivinar el ID), pero si quieres más seguridad, ver la sección "Endurecer la seguridad" más abajo.

4. Click en el ícono de engrane (arriba a la izquierda) → **Configuración del proyecto**.
5. Baja hasta "Tus apps" → click en el ícono **`</>`** (Web) → regístrala con cualquier nombre (no necesitas Firebase Hosting).
6. Copia el objeto `firebaseConfig` que te muestra.

## 2. Pegar la configuración en el proyecto

Abre `assets/firebase-config.js` y reemplaza los valores de ejemplo con los que copiaste:

```js
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

## 3. Subir a GitHub Pages

1. Crea un repositorio en GitHub y sube todos estos archivos (manteniendo la carpeta `assets/`).
2. En el repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, elige la rama (`main`) y carpeta `/ (root)`.
3. Espera 1-2 minutos y tu sitio quedará en `https://tu-usuario.github.io/tu-repo/`.

## 4. Uso

- **Jugadores**: entran a `index.html`, crean su personaje y comparten el link directo `character.html?id=...` para volver rápido a su hoja (queda guardado en la URL).
- **DM**: entra a `dm.html`. La primera vez que pones un PIN, queda guardado para todos — solo quien lo conozca puede entrar a esa vista. Desde ahí puedes editar Wounds/Mettle/XP de cualquier personaje directamente en la tabla, o abrir "Editar todo" para tocar cualquier campo de la hoja completa.

---

## Notas importantes

- **Concurrencia**: si dos personas editan el mismo campo casi al mismo tiempo, gana el último guardado (no hay merge inteligente). Para una mesa de pocos jugadores esto no suele ser problema.
- **Valores de combate**: Melee, Precisión y Defensa se sugieren automáticamente a partir de Weapon Skill / Ballistic Skill / Reflexes (regla aproximada). Si tu mesa usa la tabla completa del manual con todos los modificadores, puedes escribir el valor final manualmente en el campo "override" y se usará ese en vez del sugerido.
- **Wounds, Mettle, Toughness**: se dejaron como campos manuales (no se intenta replicar la fórmula exacta del manual) para evitar errores; cálculenlos una vez al crear el personaje y ajusten "actual" durante la partida.
- **Runas (Fyreslayer) / Aether-Rig (Kharadron)**: no tienen su propia sección dedicada en esta versión; pueden anotarse en "Notas & Inventario" o pedir que se añada una sección extra si las necesitan.

## Endurecer la seguridad (opcional)

Si te preocupa que alguien con el link adivine el `projectId` y escriba en tu base de datos, puedes:
- Restringir las reglas de Firestore a una "clave de campaña" compartida (pedir que se implemente si lo necesitas).
- Usar Firebase Authentication con un código de invitación.

Esto no se incluyó por defecto para mantener la configuración simple para un grupo de amigos.
