// ============================================================
// app.js — capa de datos y constantes compartidas
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc,
  onSnapshot, serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const CHARACTERS_COL = "characters";
export const SETTINGS_DOC = "settings/app";

// ---------- Skills (Soulbound, Age of Sigmar Roleplay) ----------
export const SKILLS = [
  ["arcana", "Arcana", "Mind"],
  ["athletics", "Athletics", "Body"],
  ["awareness", "Awareness", "Mind"],
  ["ballisticSkill", "Ballistic Skill", "Body"],
  ["beastHandling", "Beast Handling", "Soul"],
  ["channeling", "Channeling", "Mind"],
  ["crafting", "Crafting", "Mind"],
  ["determination", "Determination", "Soul"],
  ["devotion", "Devotion", "Soul"],
  ["dexterity", "Dexterity", "Body"],
  ["entertain", "Entertain", "Soul"],
  ["fortitude", "Fortitude", "Body"],
  ["guile", "Guile", "Mind"],
  ["intimidation", "Intimidation", "Soul"],
  ["intuition", "Intuition", "Mind"],
  ["lore", "Lore", "Mind"],
  ["medicine", "Medicine", "Mind"],
  ["might", "Might", "Body"],
  ["nature", "Nature", "Mind"],
  ["reflexes", "Reflexes", "Body"],
  ["stealth", "Stealth", "Body"],
  ["survival", "Survival", "Mind"],
  ["theology", "Theology", "Mind"],
  ["weaponSkill", "Weapon Skill", "Body"],
];

export const LADDER = ["Poor", "Average", "Good", "Great", "Superb", "Extraordinary"];
export function ladderLabel(score) {
  const i = Math.max(1, Math.min(6, Math.round(score || 1))) - 1;
  return LADDER[i];
}

// ---------- Esquema por defecto de un personaje ----------
export function defaultCharacter(name = "Nuevo Personaje") {
  const skills = {};
  SKILLS.forEach(([key]) => { skills[key] = { training: 0, focus: 0 }; });

  return {
    name,
    player: "",
    archetype: "",
    species: "",
    notes: { tempBuffs: "", background: "", shortGoals: "", longGoals: "" },
    attributes: { body: 1, mind: 1, soul: 1 },
    xp: { spent: 0, earned: 0, unspent: 35 },
    skills,
    combat: { meleeOverride: null, accuracyOverride: null, defenseOverride: null, move: "Normal 30'", shield: "No", armourRating: 0 },
    resources: { woundsTotal: 0, woundsCurrent: 0, mettleTotal: 0, mettleCurrent: 0, toughness: 0, naturalAwareness: 0 },
    equipment: { rightHand: "", leftHand: "", armour: "" },
    weapons: [],
    inventory: { personalItems: "", clothingTools: "", consumables: "", artifacts: "", carriedWeapons: "", currency: 200 },
    talents: [],
    spells: [],
    miracles: [],
    companion: {
      name: "", size: "", type: "", role: "",
      attributes: { body: "", mind: "", soul: "" },
      combat: { melee: "", accuracy: "", defense: "", armour: "", speed: "", initiative: "", naturalAwareness: "" },
      resources: { toughness: "", wounds: "", mettle: "" },
      traits: "", attacks: ""
    },
    updatedAt: null,
  };
}

// ---------- Combate derivado (aproximado, siempre editable a mano) ----------
export function derivedMelee(c) {
  if (c.combat?.meleeOverride !== null && c.combat?.meleeOverride !== undefined && c.combat.meleeOverride !== "") return Number(c.combat.meleeOverride);
  return 1 + (c.skills?.weaponSkill?.training || 0);
}
export function derivedAccuracy(c) {
  if (c.combat?.accuracyOverride !== null && c.combat?.accuracyOverride !== undefined && c.combat.accuracyOverride !== "") return Number(c.combat.accuracyOverride);
  return 1 + (c.skills?.ballisticSkill?.training || 0);
}
export function derivedDefense(c) {
  if (c.combat?.defenseOverride !== null && c.combat?.defenseOverride !== undefined && c.combat.defenseOverride !== "") return Number(c.combat.defenseOverride);
  return 1 + (c.skills?.reflexes?.training || 0);
}
export function dicePool(attrScore, training) {
  const pool = Math.max(1, (Number(attrScore) || 0) + (Number(training) || 0));
  return `${pool}d6`;
}

// ---------- Firestore helpers ----------
export async function listCharacters() {
  const q = query(collection(db, CHARACTERS_COL), orderBy("name"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeCharacters(cb) {
  const q = query(collection(db, CHARACTERS_COL), orderBy("name"));
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function getCharacter(id) {
  const snap = await getDoc(doc(db, CHARACTERS_COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribeCharacter(id, cb) {
  return onSnapshot(doc(db, CHARACTERS_COL, id), snap => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export async function saveCharacter(id, data) {
  await setDoc(doc(db, CHARACTERS_COL, id), { ...data, updatedAt: serverTimestamp() }, { merge: false });
}

export async function createCharacter(name) {
  const id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  const data = defaultCharacter(name);
  await setDoc(doc(db, CHARACTERS_COL, id), { ...data, updatedAt: serverTimestamp() });
  return id;
}

export async function deleteCharacter(id) {
  await deleteDoc(doc(db, CHARACTERS_COL, id));
}

export async function getDmPin() {
  const snap = await getDoc(doc(db, "settings", "app"));
  return snap.exists() ? (snap.data().dmPin || null) : null;
}

export async function setDmPin(pin) {
  await setDoc(doc(db, "settings", "app"), { dmPin: pin }, { merge: true });
}

// ---------- UI helpers ----------
export function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

export function debounce(fn, ms = 500) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
