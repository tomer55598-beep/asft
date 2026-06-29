import React, { useState, useEffect, useRef, useCallback } from "react";
import { CheckSquare, Square, Trash2, Plus, Utensils, Droplets, ListTodo, X, RotateCcw, Calendar, Scale, ArrowUp, ArrowDown, Minus, BookOpen, ChevronLeft, History } from "lucide-react";

const WATER_GOAL = 4000; // ml
const WATER_QUICK_ADDS = [200, 330, 500];

const palette = {
  bg: "#F6F1E7",
  surface: "#FFFFFF",
  border: "#E7DECB",
  ink: "#2B2A28",
  mutedInk: "#8C8374",
  tasksAccent: "#5C7A5E",
  tasksAccentSoft: "#E4ECE2",
  foodAccent: "#C16A3E",
  foodAccentSoft: "#F6E3D6",
  waterAccent: "#3C6E96",
  waterAccentSoft: "#DCEBF4",
  weightAccent: "#7C5A65",
  weightAccentSoft: "#EFE1E5",
  danger: "#B5544A",
};


const TASK_STATUS = {
  not_done: "לא בוצע",
  done: "בוצע",
};

const FOOD_ESTIMATES_PER_100G = [
  { label: "חזה עוף מבושל", keywords: ["חזה עוף", "חזה", "chicken breast"], calories: 165, protein: 31, fat: 3.6 },
  { label: "שניצל עוף", keywords: ["שניצל", "schnitzel"], calories: 260, protein: 18, fat: 13 },
  { label: "עוף מבושל", keywords: ["עוף", "chicken"], calories: 190, protein: 27, fat: 8 },
  { label: "בקר רזה/כתף", keywords: ["בקר", "בשר", "כתף", "beef"], calories: 220, protein: 27, fat: 12 },
  { label: "קציצות בשר", keywords: ["קציצ", "כדורי בשר", "meatballs"], calories: 250, protein: 18, fat: 16 },
  { label: "טונה במים", keywords: ["טונה", "tuna"], calories: 116, protein: 26, fat: 1 },
  { label: "סלמון", keywords: ["סלמון", "salmon"], calories: 208, protein: 20, fat: 13 },
  { label: "ביצה", keywords: ["ביצה", "ביצים", "egg"], calories: 143, protein: 13, fat: 10 },
  { label: "אורז מבושל", keywords: ["אורז", "rice"], calories: 130, protein: 2.7, fat: 0.3 },
  { label: "פסטה מבושלת", keywords: ["פסטה", "pasta"], calories: 158, protein: 5.8, fat: 0.9 },
  { label: "תפוח אדמה", keywords: ["תפוח אדמה", "תפו״א", "תפוא", "potato"], calories: 87, protein: 1.9, fat: 0.1 },
  { label: "בטטה", keywords: ["בטטה", "sweet potato"], calories: 86, protein: 1.6, fat: 0.1 },
  { label: "לחם", keywords: ["לחם", "פרוסת לחם", "bread"], calories: 265, protein: 9, fat: 3.2 },
  { label: "בגט", keywords: ["בגט", "baguette"], calories: 270, protein: 8.5, fat: 1.3 },
  { label: "לחמניה", keywords: ["לחמניה", "לחמנייה", "bun"], calories: 280, protein: 9, fat: 4 },
  { label: "גבינה צהובה", keywords: ["גבינה צהובה", "yellow cheese"], calories: 330, protein: 25, fat: 25 },
  { label: "קוטג׳ 5%", keywords: ["קוטג", "קוטג׳", "cottage"], calories: 97, protein: 11, fat: 5 },
  { label: "יוגורט/מעדן חלבון", keywords: ["יוגורט", "מעדן חלבון", "פרו", "protein yogurt"], calories: 80, protein: 10, fat: 1.5 },
  { label: "חלב", keywords: ["חלב", "milk"], calories: 60, protein: 3.3, fat: 3 },
  { label: "אבקת חלבון", keywords: ["אבקת חלבון", "סקופ", "protein powder"], calories: 400, protein: 78, fat: 6 },
  { label: "ברוקולי", keywords: ["ברוקולי", "broccoli"], calories: 35, protein: 2.4, fat: 0.4 },
  { label: "ירקות", keywords: ["ירקות", "סלט", "salad", "vegetables"], calories: 30, protein: 1.5, fat: 0.2 },
  { label: "טחינה", keywords: ["טחינה", "tahini"], calories: 595, protein: 17, fat: 54 },
  { label: "חומוס", keywords: ["חומוס", "hummus"], calories: 240, protein: 8, fat: 14 },
  { label: "שמן זית", keywords: ["שמן זית", "olive oil"], calories: 884, protein: 0, fat: 100 },
  // מתוקים וחטיפים — הערכה ל-100 גרם, הערכים משתנים לפי מוצר/טעם
  { label: "קינדר בואנו", keywords: ["קינדר בואנו", "בואנו", "bueno", "kinder bueno"], calories: 572, protein: 8.6, fat: 37.3 },
  { label: "קינדר שוקולד", keywords: ["קינדר שוקולד", "kinder chocolate", "קינדר אצבעות"], calories: 566, protein: 8.7, fat: 35 },
  { label: "קינדר קאנטרי", keywords: ["קינדר קאנטרי", "קינדר country", "kinder country"], calories: 557, protein: 8.8, fat: 33 },
  { label: "קינדר ג׳וי", keywords: ["קינדר גוי", "קינדר ג׳וי", "kinder joy"], calories: 560, protein: 7, fat: 36 },
  { label: "M&M בוטנים", keywords: ["m&m בוטנים", "אמ אנד אמ בוטנים", "אם אנד אם בוטנים", "peanut m&m"], calories: 516, protein: 10, fat: 26 },
  { label: "M&M שוקולד", keywords: ["m&m", "mms", "אמ אנד אמ", "אם אנד אם", "m and m"], calories: 492, protein: 4.8, fat: 19.6 },
  { label: "סניקרס", keywords: ["סניקרס", "snickers"], calories: 488, protein: 7.5, fat: 24 },
  { label: "טוויקס", keywords: ["טוויקס", "twix"], calories: 502, protein: 4.9, fat: 24 },
  { label: "מארס", keywords: ["מארס", "mars"], calories: 449, protein: 4.4, fat: 17 },
  { label: "קיטקט", keywords: ["קיטקט", "kitkat", "kit kat"], calories: 518, protein: 6.5, fat: 26 },
  { label: "אוראו", keywords: ["אוראו", "oreo"], calories: 480, protein: 5, fat: 20 },
  { label: "נוטלה", keywords: ["נוטלה", "nutella"], calories: 539, protein: 6.3, fat: 30.9 },
  { label: "פסק זמן", keywords: ["פסק זמן", "pesek zman"], calories: 535, protein: 7, fat: 31 },
  { label: "כיף כף", keywords: ["כיף כף", "kif kef", "כיפכף"], calories: 520, protein: 6, fat: 27 },
  { label: "קליק", keywords: ["קליק", "click"], calories: 530, protein: 6.5, fat: 30 },
  { label: "טורטית", keywords: ["טורטית", "tortit"], calories: 520, protein: 5, fat: 29 },
  { label: "שוקולד חלב", keywords: ["שוקולד חלב", "milk chocolate"], calories: 535, protein: 7, fat: 30 },
  { label: "שוקולד מריר", keywords: ["שוקולד מריר", "dark chocolate"], calories: 600, protein: 8, fat: 43 },
  { label: "במבה", keywords: ["במבה", "bamba"], calories: 544, protein: 17, fat: 34 },
  { label: "ביסלי", keywords: ["ביסלי", "bisli", "bissli"], calories: 500, protein: 8, fat: 25 },
  { label: "דוריטוס", keywords: ["דוריטוס", "doritos"], calories: 500, protein: 7, fat: 25 },
  { label: "תפוצ׳יפס", keywords: ["תפוציפס", "תפוצ׳יפס", "chips", "ציפס"], calories: 536, protein: 6, fat: 34 },
  { label: "פרינגלס", keywords: ["פרינגלס", "pringles"], calories: 536, protein: 4, fat: 32 },
  { label: "בייגלה", keywords: ["בייגלה", "pretzel", "pretzels"], calories: 380, protein: 10, fat: 4 },
  { label: "קרמבו", keywords: ["קרמבו", "krembo"], calories: 350, protein: 3, fat: 10 },
  { label: "גלידה", keywords: ["גלידה", "ice cream"], calories: 207, protein: 3.5, fat: 11 },
  { label: "מילקי", keywords: ["מילקי", "milky"], calories: 135, protein: 3, fat: 5 },
  { label: "קורנפלקס", keywords: ["קורנפלקס", "cornflakes", "דגני בוקר"], calories: 370, protein: 7, fat: 1 },
  { label: "גרנולה", keywords: ["גרנולה", "granola"], calories: 450, protein: 10, fat: 15 },
  { label: "חמאת בוטנים", keywords: ["חמאת בוטנים", "peanut butter"], calories: 588, protein: 25, fat: 50 },
  { label: "אגוזים/שקדים", keywords: ["אגוזים", "שקדים", "nuts", "almonds"], calories: 600, protein: 20, fat: 52 },
  { label: "צימוקים", keywords: ["צימוקים", "raisins"], calories: 299, protein: 3, fat: 0.5 },
  { label: "תמרים", keywords: ["תמר", "תמרים", "dates"], calories: 277, protein: 1.8, fat: 0.2 },
  { label: "בננה", keywords: ["בננה", "banana"], calories: 89, protein: 1.1, fat: 0.3 },
  { label: "תפוח", keywords: ["תפוח", "apple"], calories: 52, protein: 0.3, fat: 0.2 },
  { label: "שוקולד/חטיף מתוק כללי", keywords: ["שוקולד", "קינדר", "chocolate", "חטיף מתוק"], calories: 535, protein: 6, fat: 30 },
];

function getTaskStatus(task) {
  return task.status || (task.done ? "done" : "not_done");
}

function isTaskDone(task) {
  return getTaskStatus(task) === "done";
}

function normalizeFoodText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[״"']/g, "")
    .replace(/[׳`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function numberFromInput(value) {
  const num = parseFloat(String(value || "").replace(",", "."));
  return Number.isFinite(num) ? num : null;
}

function extractGramsFromName(name) {
  const match = String(name || "").match(/(\d+(?:[.,]\d+)?)\s*(גרם|גר׳|גר|ג׳|ג'|g)/i);
  return match ? numberFromInput(match[1]) : null;
}

function cleanFoodName(name) {
  return String(name || "")
    .replace(/(\d+(?:[.,]\d+)?)\s*(גרם|גר׳|גר|ג׳|ג'|g)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getFoodGrams(name, gramsInput) {
  return numberFromInput(gramsInput) || extractGramsFromName(name);
}

function roundOne(num) {
  return Math.round(num * 10) / 10;
}

function estimateFoodMacros(name, gramsInput) {
  const grams = getFoodGrams(name, gramsInput);
  const cleanedName = cleanFoodName(name);
  const normalized = normalizeFoodText(cleanedName || name);
  if (!normalized || !grams || grams <= 0) return null;

  const match = FOOD_ESTIMATES_PER_100G.find((item) =>
    item.keywords.some((keyword) => normalized.includes(normalizeFoodText(keyword)))
  );

  if (!match) return null;
  const factor = grams / 100;
  return {
    grams,
    label: match.label,
    calories: Math.round(match.calories * factor),
    protein: roundOne(match.protein * factor),
    fat: roundOne(match.fat * factor),
  };
}

function getDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatHebrewDate(d = new Date()) {
  const days = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת"];
  const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
  return `${days[d.getDay()]}, ${d.getDate()} ב${months[d.getMonth()]}`;
}

function formatShortDate(dateStr) {
  // dateStr: YYYY-MM-DD
  const [y, m, d] = dateStr.split("-");
  return `${d}.${m}`;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

async function loadKey(key, fallback) {
  try {
    const res = await window.storage.get(key, false);
    if (res && res.value) return JSON.parse(res.value);
    return fallback;
  } catch (e) {
    return fallback;
  }
}

async function saveKey(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), false);
  } catch (e) {
    console.error("שמירה נכשלה", e);
  }
}


async function addDateToHistory(date) {
  const dates = await loadKey("dailyHistoryDates", []);
  if (!dates.includes(date)) {
    const next = [...dates, date].sort((a, b) => b.localeCompare(a));
    await saveKey("dailyHistoryDates", next);
    return next;
  }
  return dates;
}

async function loadHistoryRows(dates) {
  const rows = await Promise.all(
    dates.map(async (date) => {
      const food = await loadKey(`food:${date}`, []);
      const water = await loadKey(`water:${date}`, []);
      const totals = food.reduce(
        (acc, f) => ({
          calories: acc.calories + (Number(f.calories) || 0),
          protein: acc.protein + (Number(f.protein) || 0),
          fat: acc.fat + (Number(f.fat) || 0),
        }),
        { calories: 0, protein: 0, fat: 0 }
      );
      const totalWater = water.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
      return { date, food, water, totals, totalWater };
    })
  );
  return rows.filter((row) => row.food.length > 0 || row.water.length > 0);
}

export default function DayBoard() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("tasks");
  const [dateKey, setDateKey] = useState(getDateKey());

  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [showDueFields, setShowDueFields] = useState(false);
  const [dueDateInput, setDueDateInput] = useState("");
  const [dueTimeInput, setDueTimeInput] = useState("");

  const [foodEntries, setFoodEntries] = useState([]);
  const [foodForm, setFoodForm] = useState({ name: "", grams: "", calories: "", protein: "", fat: "", autoNote: "" });
  const [savedFoods, setSavedFoods] = useState([]);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showLibraryForm, setShowLibraryForm] = useState(false);
  const [libraryForm, setLibraryForm] = useState({ name: "", calories: "", protein: "", fat: "" });

  const [waterEntries, setWaterEntries] = useState([]);
  const [customWater, setCustomWater] = useState("");

  const [historyRows, setHistoryRows] = useState([]);

  const [weightEntries, setWeightEntries] = useState([]);
  const [weightDate, setWeightDate] = useState(getDateKey());
  const [weightValue, setWeightValue] = useState("");

  const dateKeyRef = useRef(dateKey);
  dateKeyRef.current = dateKey;

  useEffect(() => {
    const estimate = estimateFoodMacros(foodForm.name, foodForm.grams);
    const extractedGrams = extractGramsFromName(foodForm.name);
    setFoodForm((prev) => {
      let next;
      if (estimate) {
        next = {
          ...prev,
          grams: prev.grams || (extractedGrams ? String(extractedGrams) : prev.grams),
          calories: String(estimate.calories),
          protein: String(estimate.protein),
          fat: String(estimate.fat),
          autoNote: `חושב אוטומטית לפי ${estimate.label} ו-${estimate.grams} גרם. אפשר לערוך ידנית.`,
        };
      } else {
        next = { ...prev, autoNote: prev.name.trim() && getFoodGrams(prev.name, prev.grams) ? "לא מצאתי התאמה אוטומטית. אפשר למלא ידנית." : "" };
      }
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [foodForm.name, foodForm.grams]);

  // initial load
  useEffect(() => {
    (async () => {
      const t = await loadKey("tasks", []);
      const f = await loadKey(`food:${dateKey}`, []);
      const w = await loadKey(`water:${dateKey}`, []);
      const wt = await loadKey("weight", []);
      const lib = await loadKey("foodLibrary", []);
      let histDates = await loadKey("dailyHistoryDates", []);
      if ((f.length > 0 || w.length > 0) && !histDates.includes(dateKey)) {
        histDates = await addDateToHistory(dateKey);
      }
      const hist = await loadHistoryRows(histDates);
      setTasks(t);
      setFoodEntries(f);
      setWaterEntries(w);
      setWeightEntries(wt);
      setSavedFoods(lib);
      setHistoryRows(hist);
      setReady(true);
    })();
  }, []);

  const refreshHistory = useCallback(async () => {
    const dates = await loadKey("dailyHistoryDates", []);
    const rows = await loadHistoryRows(dates);
    setHistoryRows(rows);
  }, []);

  // midnight rollover check
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = getDateKey();
      if (now !== dateKeyRef.current) {
        setDateKey(now);
        const f = await loadKey(`food:${now}`, []);
        const w = await loadKey(`water:${now}`, []);
        setFoodEntries(f);
        setWaterEntries(w);
        await refreshHistory();
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [refreshHistory]);

  // ---- tasks ----
  const persistTasks = useCallback(async (next) => {
    setTasks(next);
    await saveKey("tasks", next);
  }, []);

  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;
    const due = dueDateInput ? { date: dueDateInput, time: dueTimeInput || null } : null;
    const next = [...tasks, { id: uid(), text, status: "not_done", statusText: "", done: false, createdAt: Date.now(), due }];
    persistTasks(next);
    setNewTaskText("");
    setDueDateInput("");
    setDueTimeInput("");
    setShowDueFields(false);
  };

  const toggleTask = (id) => {
    const next = tasks.map((t) => {
      if (t.id !== id) return t;
      const nextStatus = isTaskDone(t) ? "not_done" : "done";
      return { ...t, status: nextStatus, done: nextStatus === "done" };
    });
    persistTasks(next);
  };

  const updateTaskStatus = (id, status) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, status, done: status === "done" } : t));
    persistTasks(next);
  };

  const updateTaskStatusText = (id, statusText) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, statusText } : t));
    persistTasks(next);
  };

  const deleteTask = (id) => {
    persistTasks(tasks.filter((t) => t.id !== id));
  };

  const clearDoneTasks = () => {
    persistTasks(tasks.filter((t) => !isTaskDone(t)));
  };

  // ---- food ----
  const persistFood = useCallback(async (next) => {
    const currentDate = dateKeyRef.current;
    setFoodEntries(next);
    await saveKey(`food:${currentDate}`, next);
    if (next.length > 0) await addDateToHistory(currentDate);
    await refreshHistory();
  }, [refreshHistory]);

  const addFood = () => {
    const rawName = foodForm.name.trim();
    const name = cleanFoodName(rawName) || rawName;
    const grams = getFoodGrams(rawName, foodForm.grams);
    const calories = parseFloat(foodForm.calories);
    if (!name || isNaN(calories)) return;
    const entry = {
      id: uid(),
      name,
      grams: grams || null,
      calories: Math.round(calories),
      protein: parseFloat(foodForm.protein) || 0,
      fat: parseFloat(foodForm.fat) || 0,
      estimateNote: foodForm.autoNote || null,
      time: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
    };
    persistFood([...foodEntries, entry]);
    setFoodForm({ name: "", grams: "", calories: "", protein: "", fat: "", autoNote: "" });
  };

  const deleteFood = (id) => {
    persistFood(foodEntries.filter((f) => f.id !== id));
  };

  // ---- food product library ----
  const persistLibrary = useCallback(async (next) => {
    setSavedFoods(next);
    await saveKey("foodLibrary", next);
  }, []);

  const addProductToLibrary = () => {
    const name = libraryForm.name.trim();
    const calories = parseFloat(libraryForm.calories);
    if (!name || isNaN(calories)) return;
    const product = {
      id: uid(),
      name,
      calories: Math.round(calories),
      protein: parseFloat(libraryForm.protein) || 0,
      fat: parseFloat(libraryForm.fat) || 0,
    };
    persistLibrary([...savedFoods, product]);
    setLibraryForm({ name: "", calories: "", protein: "", fat: "" });
    setShowLibraryForm(false);
  };

  const deleteProductFromLibrary = (id) => {
    persistLibrary(savedFoods.filter((p) => p.id !== id));
  };

  const logProductFromLibrary = (product) => {
    const entry = {
      id: uid(),
      name: product.name,
      calories: product.calories,
      protein: product.protein,
      fat: product.fat,
      time: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
    };
    persistFood([...foodEntries, entry]);
  };

  const foodTotals = foodEntries.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, fat: 0 }
  );

  // ---- water ----
  const persistWater = useCallback(async (next) => {
    const currentDate = dateKeyRef.current;
    setWaterEntries(next);
    await saveKey(`water:${currentDate}`, next);
    if (next.length > 0) await addDateToHistory(currentDate);
    await refreshHistory();
  }, [refreshHistory]);

  const addWater = (amount) => {
    if (!amount || amount <= 0) return;
    const entry = { id: uid(), amount, time: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }) };
    persistWater([...waterEntries, entry]);
  };

  const removeWaterEntry = (id) => {
    persistWater(waterEntries.filter((w) => w.id !== id));
  };

  const totalWater = waterEntries.reduce((sum, w) => sum + w.amount, 0);
  const waterPct = Math.min(100, Math.round((totalWater / WATER_GOAL) * 100));
  const waterGoalReached = totalWater >= WATER_GOAL;

  // ---- weight ----
  const persistWeight = useCallback(async (next) => {
    setWeightEntries(next);
    await saveKey("weight", next);
  }, []);

  const saveWeight = () => {
    const val = parseFloat(weightValue);
    if (!weightDate || isNaN(val) || val <= 0) return;
    const existingIdx = weightEntries.findIndex((w) => w.date === weightDate);
    let next;
    if (existingIdx >= 0) {
      next = weightEntries.map((w, i) => (i === existingIdx ? { ...w, weight: val } : w));
    } else {
      next = [...weightEntries, { id: uid(), date: weightDate, weight: val }];
    }
    persistWeight(next);
    setWeightValue("");
  };

  const deleteWeight = (id) => {
    persistWeight(weightEntries.filter((w) => w.id !== id));
  };

  if (!ready) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center"
        style={{ background: palette.bg, fontFamily: "Rubik, sans-serif" }}
      >
        <p style={{ color: palette.mutedInk }}>טוען...</p>
      </div>
    );
  }

  const tabMeta = {
    tasks: { label: "משימות", icon: ListTodo, accent: palette.tasksAccent },
    food: { label: "תזונה", icon: Utensils, accent: palette.foodAccent },
    water: { label: "מים", icon: Droplets, accent: palette.waterAccent },
    weight: { label: "משקל", icon: Scale, accent: palette.weightAccent },
    history: { label: "היסטוריה", icon: History, accent: palette.ink },
  };

  return (
    <div dir="rtl" className="min-h-screen pb-24" style={{ background: palette.bg, fontFamily: "Rubik, sans-serif", color: palette.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700&family=Rubik:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Frank Ruhl Libre', serif; }
        @keyframes ripple { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ripple { animation: ripple 7s linear infinite; }
        input::placeholder { color: #B7AE9C; }
      `}</style>

      {/* header */}
      <header className="px-5 pt-6 pb-4 max-w-xl mx-auto">
        <p className="text-sm" style={{ color: palette.mutedInk }}>{formatHebrewDate()}</p>
        <h1 className="font-display text-3xl mt-1" style={{ color: palette.ink }}>לוח-יום</h1>
      </header>

      <main className="px-5 max-w-xl mx-auto">
        {tab === "tasks" && (
          <TasksView
            tasks={tasks}
            newTaskText={newTaskText}
            setNewTaskText={setNewTaskText}
            addTask={addTask}
            toggleTask={toggleTask}
            updateTaskStatus={updateTaskStatus}
            updateTaskStatusText={updateTaskStatusText}
            deleteTask={deleteTask}
            clearDoneTasks={clearDoneTasks}
            showDueFields={showDueFields}
            setShowDueFields={setShowDueFields}
            dueDateInput={dueDateInput}
            setDueDateInput={setDueDateInput}
            dueTimeInput={dueTimeInput}
            setDueTimeInput={setDueTimeInput}
          />
        )}

        {tab === "food" && (
          <FoodView
            foodForm={foodForm}
            setFoodForm={setFoodForm}
            addFood={addFood}
            foodEntries={foodEntries}
            deleteFood={deleteFood}
            totals={foodTotals}
            savedFoods={savedFoods}
            showLibraryModal={showLibraryModal}
            setShowLibraryModal={setShowLibraryModal}
          />
        )}

        {tab === "water" && (
          <WaterView
            totalWater={totalWater}
            waterPct={waterPct}
            waterGoalReached={waterGoalReached}
            addWater={addWater}
            customWater={customWater}
            setCustomWater={setCustomWater}
            waterEntries={waterEntries}
            removeWaterEntry={removeWaterEntry}
          />
        )}

        {tab === "weight" && (
          <WeightView
            weightEntries={weightEntries}
            weightDate={weightDate}
            setWeightDate={setWeightDate}
            weightValue={weightValue}
            setWeightValue={setWeightValue}
            saveWeight={saveWeight}
            deleteWeight={deleteWeight}
          />
        )}

        {tab === "history" && (
          <HistoryView historyRows={historyRows} />
        )}
      </main>

      {showLibraryModal && (
        <ProductLibraryModal
          savedFoods={savedFoods}
          showLibraryForm={showLibraryForm}
          setShowLibraryForm={setShowLibraryForm}
          libraryForm={libraryForm}
          setLibraryForm={setLibraryForm}
          addProductToLibrary={addProductToLibrary}
          deleteProductFromLibrary={deleteProductFromLibrary}
          logProductFromLibrary={logProductFromLibrary}
          onClose={() => setShowLibraryModal(false)}
        />
      )}

      {/* bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex justify-center"
        style={{ background: palette.surface, borderTop: `1px solid ${palette.border}` }}
      >
        <div className="max-w-xl w-full flex">
          {Object.entries(tabMeta).map(([key, meta]) => {
            const Icon = meta.icon;
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex-1 flex flex-col items-center gap-1 py-3"
                style={{ color: active ? meta.accent : palette.mutedInk }}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[11px]" style={{ fontWeight: active ? 600 : 400 }}>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl p-4 mb-4" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
      {children}
    </div>
  );
}

function isOverdue(due) {
  if (!due || !due.date) return false;
  const dt = new Date(`${due.date}T${due.time || "23:59"}`);
  return dt.getTime() < Date.now();
}

function formatDue(due) {
  if (!due || !due.date) return "";
  const txt = formatShortDate(due.date);
  return due.time ? `${txt} · ${due.time}` : txt;
}

function TasksView({
  tasks, newTaskText, setNewTaskText, addTask, toggleTask, updateTaskStatus, deleteTask, clearDoneTasks,
  showDueFields, setShowDueFields, dueDateInput, setDueDateInput, dueTimeInput, setDueTimeInput,
}) {
  const activeTasks = tasks
    .filter((t) => !isTaskDone(t))
    .slice()
    .sort((a, b) => {
      const aTime = a.due ? new Date(`${a.due.date}T${a.due.time || "23:59"}`).getTime() : Infinity;
      const bTime = b.due ? new Date(`${b.due.date}T${b.due.time || "23:59"}`).getTime() : Infinity;
      return aTime - bTime;
    });
  const doneTasks = tasks.filter((t) => isTaskDone(t));

  return (
    <div>
      <Card>
        <div className="flex gap-2 mb-2">
          <input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !showDueFields && addTask()}
            placeholder="מה צריך לעשות?"
            className="flex-1 rounded-xl px-3 py-2 outline-none"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <button
            onClick={() => setShowDueFields((v) => !v)}
            className="rounded-xl px-3 flex items-center justify-center"
            style={{
              background: showDueFields || dueDateInput ? palette.tasksAccentSoft : palette.bg,
              color: palette.tasksAccent,
              border: `1px solid ${palette.border}`,
            }}
          >
            <Calendar size={18} />
          </button>
          <button
            onClick={addTask}
            className="rounded-xl px-3 flex items-center justify-center"
            style={{ background: palette.tasksAccent, color: "#fff" }}
          >
            <Plus size={20} />
          </button>
        </div>

        {showDueFields && (
          <div className="flex gap-2">
            <input
              type="date"
              value={dueDateInput}
              onChange={(e) => setDueDateInput(e.target.value)}
              className="flex-1 rounded-xl px-3 py-2 outline-none text-sm"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <input
              type="time"
              value={dueTimeInput}
              onChange={(e) => setDueTimeInput(e.target.value)}
              className="flex-1 rounded-xl px-3 py-2 outline-none text-sm"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
          </div>
        )}
      </Card>

      {tasks.length === 0 && (
        <p className="text-sm text-center mt-8" style={{ color: palette.mutedInk }}>
          הרשימה פנויה. מה הדבר הראשון שצריך לעשות היום?
        </p>
      )}

      {activeTasks.length > 0 && (
        <div className="space-y-2 mb-4">
          {activeTasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} onStatusChange={(status) => updateTaskStatus(task.id, status)} onStatusTextChange={(statusText) => updateTaskStatusText(task.id, statusText)} onDelete={() => deleteTask(task.id)} />
          ))}
        </div>
      )}

      {doneTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs" style={{ color: palette.mutedInk }}>הושלמו ({doneTasks.length})</span>
            <button onClick={clearDoneTasks} className="text-xs flex items-center gap-1" style={{ color: palette.mutedInk }}>
              <RotateCcw size={12} /> נקה
            </button>
          </div>
          <div className="space-y-2">
            {doneTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} onStatusChange={(status) => updateTaskStatus(task.id, status)} onStatusTextChange={(statusText) => updateTaskStatusText(task.id, statusText)} onDelete={() => deleteTask(task.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onToggle, onStatusChange, onStatusTextChange, onDelete }) {
  const status = getTaskStatus(task);
  const done = status === "done";
  const overdue = !done && isOverdue(task.due);
  return (
    <div className="rounded-xl px-3 py-2.5" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
      <div className="flex items-start gap-3">
        <button onClick={onToggle} style={{ color: done ? palette.tasksAccent : palette.mutedInk }}>
          {done ? <CheckSquare size={20} /> : <Square size={20} />}
        </button>
        <div className="flex-1 min-w-0">
          <span
            className="text-sm block"
            style={{ color: done ? palette.mutedInk : palette.ink, textDecoration: done ? "line-through" : "none" }}
          >
            {task.text}
          </span>
          {task.due && task.due.date && (
            <span className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: overdue ? palette.danger : palette.mutedInk }}>
              <Calendar size={11} /> {formatDue(task.due)}
            </span>
          )}
        </div>
        <button onClick={onDelete} style={{ color: palette.mutedInk }}>
          <X size={16} />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 pr-8">
        <span className="text-[11px]" style={{ color: palette.mutedInk }}>סטטוס</span>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="flex-1 rounded-xl px-3 py-2 outline-none text-xs"
          style={{ background: done ? palette.tasksAccentSoft : palette.bg, border: `1px solid ${palette.border}`, color: done ? palette.tasksAccent : palette.ink }}
        >
          <option value="not_done">לא בוצע</option>
          <option value="done">בוצע</option>
        </select>
      </div>

      <div className="mt-2 pr-8">
        <input
          value={task.statusText || ""}
          onChange={(e) => onStatusTextChange(e.target.value)}
          placeholder="כתוב איפה המשימה עומדת... למשל: בטיפול / מחכה לאישור / תקוע"
          className="w-full rounded-xl px-3 py-2 outline-none text-xs"
          style={{ background: palette.bg, border: `1px solid ${palette.border}`, color: palette.ink }}
        />
      </div>
    </div>
  );
}

function StatChip({ label, value, accent, soft }) {
  return (
    <div className="flex-1 rounded-xl py-1.5 px-1 text-center min-w-0" style={{ background: soft }}>
      <p className="text-base font-semibold whitespace-nowrap" style={{ color: accent }}>{value}</p>
      <p className="text-[10px] whitespace-nowrap" style={{ color: palette.mutedInk }}>{label}</p>
    </div>
  );
}

function FoodView({
  foodForm, setFoodForm, addFood, foodEntries, deleteFood, totals,
  savedFoods, showLibraryModal, setShowLibraryModal,
}) {
  return (
    <div>
      <Card>
        <p className="text-xs mb-2" style={{ color: palette.mutedInk }}>סיכום היום</p>
        <div className="flex gap-1.5">
          <StatChip label="קלוריות" value={Math.round(totals.calories)} accent={palette.foodAccent} soft={palette.foodAccentSoft} />
          <StatChip label='חלבון (ג)' value={Math.round(totals.protein)} accent={palette.foodAccent} soft={palette.foodAccentSoft} />
          <StatChip label='שומן (ג)' value={Math.round(totals.fat)} accent={palette.foodAccent} soft={palette.foodAccentSoft} />
        </div>
      </Card>

      <button
        onClick={() => setShowLibraryModal(true)}
        className="w-full rounded-2xl p-4 mb-4 flex items-center justify-between"
        style={{ background: palette.surface, border: `1px solid ${palette.border}` }}
      >
        <span className="text-sm font-medium flex items-center gap-1.5">
          <BookOpen size={16} style={{ color: palette.foodAccent }} /> ספר מוצרים
          <span style={{ color: palette.mutedInk }} className="text-xs">
            {savedFoods.length > 0 ? `(${savedFoods.length})` : ""}
          </span>
        </span>
        <ChevronLeft size={18} style={{ color: palette.mutedInk }} />
      </button>

      <Card>
        <p className="text-sm font-medium mb-1">הוספה חד-פעמית</p>
        <p className="text-[11px] mb-3" style={{ color: palette.mutedInk }}>
          כתוב מאכל וכמות בגרמים, למשל: חזה עוף 200 גרם או קינדר בואנו 43 גרם. האפליקציה תחשב הערכה אוטומטית, ואפשר לערוך לפני שמירה.
        </p>
        <div className="space-y-2">
          <input
            value={foodForm.name}
            onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
            placeholder="מה אכלת? למשל: חזה עוף / קינדר בואנו / M&M"
            className="w-full rounded-xl px-3 py-2 outline-none"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <input
            value={foodForm.grams}
            onChange={(e) => setFoodForm({ ...foodForm, grams: e.target.value })}
            placeholder='כמה גרם?'
            type="number"
            className="w-full rounded-xl px-3 py-2 outline-none"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          {foodForm.autoNote && (
            <p className="text-[11px] rounded-xl px-3 py-2" style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}>
              {foodForm.autoNote}
            </p>
          )}
          <div className="flex gap-2">
            <input
              value={foodForm.calories}
              onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
              placeholder="קלוריות"
              type="number"
              className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <input
              value={foodForm.protein}
              onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
              placeholder='חלבון (ג)'
              type="number"
              className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
            <input
              value={foodForm.fat}
              onChange={(e) => setFoodForm({ ...foodForm, fat: e.target.value })}
              placeholder='שומן (ג)'
              type="number"
              className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
              style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
            />
          </div>
          <button
            onClick={addFood}
            className="w-full rounded-xl py-2 flex items-center justify-center gap-1 font-medium"
            style={{ background: palette.foodAccent, color: "#fff" }}
          >
            <Plus size={18} /> הוסף לתפריט היום
          </button>
        </div>
      </Card>

      {foodEntries.length === 0 ? (
        <p className="text-sm text-center mt-6" style={{ color: palette.mutedInk }}>עדיין לא נרשם אוכל היום.</p>
      ) : (
        <div className="space-y-2">
          {foodEntries.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
              <div className="flex-1">
                <p className="text-sm font-medium">{f.name}</p>
                <p className="text-[11px]" style={{ color: palette.mutedInk }}>
                  {f.time}{f.grams ? ` · ${f.grams} גרם` : ""} · {f.calories} קל׳ · {f.protein} ג חלבון · {f.fat} ג שומן
                </p>
              </div>
              <button onClick={() => deleteFood(f.id)} style={{ color: palette.mutedInk }}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductLibraryModal({
  savedFoods, showLibraryForm, setShowLibraryForm, libraryForm, setLibraryForm,
  addProductToLibrary, deleteProductFromLibrary, logProductFromLibrary, onClose,
}) {
  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ background: "rgba(20,18,15,0.45)", zIndex: 50 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-t-3xl p-4 flex flex-col"
        style={{ background: palette.surface, maxHeight: "82vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <p className="text-base font-medium flex items-center gap-1.5">
            <BookOpen size={18} style={{ color: palette.foodAccent }} /> ספר מוצרים
          </p>
          <button onClick={onClose} style={{ color: palette.mutedInk }}>
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <button
            onClick={() => setShowLibraryForm((v) => !v)}
            className="w-full text-sm flex items-center justify-center gap-1 rounded-xl py-2 mb-3"
            style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}
          >
            <Plus size={15} /> מוצר חדש
          </button>

          {showLibraryForm && (
            <div className="space-y-2 mb-4 pb-4" style={{ borderBottom: `1px solid ${palette.border}` }}>
              <input
                value={libraryForm.name}
                onChange={(e) => setLibraryForm({ ...libraryForm, name: e.target.value })}
                placeholder="שם המוצר"
                className="w-full rounded-xl px-3 py-2 outline-none"
                style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
              />
              <div className="flex gap-2">
                <input
                  value={libraryForm.calories}
                  onChange={(e) => setLibraryForm({ ...libraryForm, calories: e.target.value })}
                  placeholder="קלוריות"
                  type="number"
                  className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
                  style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
                />
                <input
                  value={libraryForm.protein}
                  onChange={(e) => setLibraryForm({ ...libraryForm, protein: e.target.value })}
                  placeholder='חלבון (ג)'
                  type="number"
                  className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
                  style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
                />
                <input
                  value={libraryForm.fat}
                  onChange={(e) => setLibraryForm({ ...libraryForm, fat: e.target.value })}
                  placeholder='שומן (ג)'
                  type="number"
                  className="flex-1 rounded-xl px-3 py-2 outline-none min-w-0"
                  style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
                />
              </div>
              <button
                onClick={addProductToLibrary}
                className="w-full rounded-xl py-2 text-sm font-medium"
                style={{ background: palette.foodAccent, color: "#fff" }}
              >
                שמירה בספר המוצרים
              </button>
            </div>
          )}

          {savedFoods.length === 0 ? (
            <p className="text-xs text-center py-2" style={{ color: palette.mutedInk }}>
              עדיין אין מוצרים שמורים. הוסיפו מוצר כדי לרשום אותו בלחיצה אחת בכל פעם.
            </p>
          ) : (
            <div className="space-y-2 pb-2">
              {savedFoods.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: palette.bg, border: `1px solid ${palette.border}` }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-[11px]" style={{ color: palette.mutedInk }}>
                      {p.calories} קל׳ · {p.protein} ג חלבון · {p.fat} ג שומן
                    </p>
                  </div>
                  <button
                    onClick={() => logProductFromLibrary(p)}
                    className="rounded-lg p-1.5 flex-shrink-0"
                    style={{ background: palette.foodAccentSoft, color: palette.foodAccent }}
                    title="הוסף לתפריט היום"
                  >
                    <Plus size={16} />
                  </button>
                  <button onClick={() => deleteProductFromLibrary(p.id)} style={{ color: palette.mutedInk }} className="flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function HistoryView({ historyRows }) {
  return (
    <div>
      <Card>
        <p className="text-sm font-medium mb-1">היסטוריית תזונה ושתייה</p>
        <p className="text-xs" style={{ color: palette.mutedInk }}>
          כאן יופיעו כל הימים שבהם רשמת אוכל או מים. ימים קודמים יישמרו גם אחרי האיפוס היומי.
        </p>
      </Card>

      {historyRows.length === 0 ? (
        <p className="text-sm text-center mt-6" style={{ color: palette.mutedInk }}>עדיין אין היסטוריה להצגה.</p>
      ) : (
        <div className="space-y-3">
          {historyRows.map((day) => (
            <Card key={day.date}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">{formatShortDate(day.date)}</p>
                <p className="text-[11px]" style={{ color: palette.mutedInk }}>
                  {day.food.length} פריטי אוכל · {day.water.length} רשומות מים
                </p>
              </div>

              <div className="flex gap-1.5 mb-3">
                <StatChip label="קלוריות" value={Math.round(day.totals.calories)} accent={palette.foodAccent} soft={palette.foodAccentSoft} />
                <StatChip label='חלבון (ג)' value={Math.round(day.totals.protein)} accent={palette.foodAccent} soft={palette.foodAccentSoft} />
                <StatChip label="מים" value={`${(day.totalWater / 1000).toFixed(2)} ל׳`} accent={palette.waterAccent} soft={palette.waterAccentSoft} />
              </div>

              {day.food.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium mb-1" style={{ color: palette.foodAccent }}>תזונה</p>
                  <div className="space-y-1">
                    {day.food.map((f) => (
                      <p key={f.id} className="text-[12px]" style={{ color: palette.mutedInk }}>
                        {f.time} · {f.name}{f.grams ? ` · ${f.grams} גרם` : ""} · {f.calories} קל׳ · {f.protein} ג חלבון
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {day.water.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: palette.waterAccent }}>מים</p>
                  <div className="space-y-1">
                    {day.water.slice().reverse().map((w) => (
                      <p key={w.id} className="text-[12px]" style={{ color: palette.mutedInk }}>
                        {w.time} · {w.amount} מ״ל
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function WaterView({ totalWater, waterPct, waterGoalReached, addWater, customWater, setCustomWater, waterEntries, removeWaterEntry }) {
  return (
    <div>
      <Card>
        <div className="flex items-center gap-5">
          <div
            className="relative rounded-2xl overflow-hidden flex-shrink-0"
            style={{ width: 84, height: 140, border: `2px solid ${palette.waterAccent}`, background: palette.bg }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 transition-all duration-700"
              style={{ height: `${waterPct}%`, background: `linear-gradient(180deg, #5C9AC4, ${palette.waterAccent})` }}
            >
              <div className="absolute -top-1 left-0 w-[200%] h-2 ripple" style={{
                backgroundImage: "radial-gradient(circle at 5px 2px, rgba(255,255,255,0.45) 2px, transparent 3px)",
                backgroundSize: "10px 4px",
              }} />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-semibold" style={{ color: palette.waterAccent }}>
              {(totalWater / 1000).toFixed(2)} <span className="text-sm font-normal">ל׳</span>
            </p>
            <p className="text-xs mb-1" style={{ color: palette.mutedInk }}>מתוך {(WATER_GOAL / 1000).toFixed(0)} ליטר ליום</p>
            <p className="text-sm" style={{ color: waterGoalReached ? palette.tasksAccent : palette.mutedInk }}>
              {waterGoalReached ? "🎉 הגעת ליעד היום!" : `נשארו ${((WATER_GOAL - totalWater) / 1000).toFixed(2)} ל׳`}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-medium mb-3">הוספת שתייה</p>
        <div className="flex gap-2 mb-2">
          {WATER_QUICK_ADDS.map((amt) => (
            <button
              key={amt}
              onClick={() => addWater(amt)}
              className="flex-1 rounded-xl py-2 text-sm font-medium"
              style={{ background: palette.waterAccentSoft, color: palette.waterAccent }}
            >
              {'+' + amt + ' מ"ל'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={customWater}
            onChange={(e) => setCustomWater(e.target.value)}
            placeholder='כמות מותאמת (מ"ל)'
            type="number"
            className="flex-1 rounded-xl px-3 py-2 outline-none"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <button
            onClick={() => {
              const v = parseFloat(customWater);
              if (v > 0) {
                addWater(Math.round(v));
                setCustomWater("");
              }
            }}
            className="rounded-xl px-4 flex items-center justify-center"
            style={{ background: palette.waterAccent, color: "#fff" }}
          >
            <Plus size={18} />
          </button>
        </div>
      </Card>

      {waterEntries.length > 0 && (
        <div className="space-y-2">
          {waterEntries.slice().reverse().map((w) => (
            <div key={w.id} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
              <Droplets size={14} style={{ color: palette.waterAccent }} />
              <span className="flex-1">{w.amount + ' מ"ל · ' + w.time}</span>
              <button onClick={() => removeWaterEntry(w.id)} style={{ color: palette.mutedInk }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WeightView({ weightEntries, weightDate, setWeightDate, weightValue, setWeightValue, saveWeight, deleteWeight }) {
  const sortedAsc = weightEntries.slice().sort((a, b) => a.date.localeCompare(b.date));
  const rows = sortedAsc.map((entry, i) => ({
    ...entry,
    delta: i > 0 ? Math.round((entry.weight - sortedAsc[i - 1].weight) * 10) / 10 : null,
  }));
  const rowsDesc = rows.slice().reverse();

  const latest = rows.length > 0 ? rows[rows.length - 1] : null;
  const first = rows.length > 0 ? rows[0] : null;
  const totalChange = latest && first && rows.length > 1 ? Math.round((latest.weight - first.weight) * 10) / 10 : null;

  return (
    <div>
      <Card>
        {latest ? (
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 text-center">
              <p className="text-3xl font-semibold" style={{ color: palette.weightAccent }}>{latest.weight}</p>
              <p className="text-[11px]" style={{ color: palette.mutedInk }}>ק"ג · {formatShortDate(latest.date)}</p>
            </div>
            <div className="flex-1 space-y-1">
              <DeltaLine label="לעומת השקילה הקודמת" delta={latest.delta} />
              {totalChange !== null && <DeltaLine label="סה״כ מאז ההתחלה" delta={totalChange} />}
            </div>
          </div>
        ) : (
          <p className="text-sm text-center" style={{ color: palette.mutedInk }}>עדיין לא נרשמה שקילה.</p>
        )}
      </Card>

      <Card>
        <p className="text-sm font-medium mb-3">עדכון משקל</p>
        <div className="flex gap-2">
          <input
            type="date"
            value={weightDate}
            onChange={(e) => setWeightDate(e.target.value)}
            className="flex-1 rounded-xl px-3 py-2 outline-none text-sm min-w-0"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <input
            type="number"
            step="0.1"
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
            placeholder='ק"ג'
            className="w-20 rounded-xl px-3 py-2 outline-none text-sm"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <button
            onClick={saveWeight}
            className="rounded-xl px-4 flex items-center justify-center"
            style={{ background: palette.weightAccent, color: "#fff" }}
          >
            <Plus size={18} />
          </button>
        </div>
        <p className="text-[11px] mt-2" style={{ color: palette.mutedInk }}>עדכון לתאריך שכבר קיים יחליף את השקילה הישנה.</p>
      </Card>

      {rowsDesc.length > 0 && (
        <div className="space-y-2">
          {rowsDesc.map((w) => (
            <div key={w.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
              <div className="flex-1 flex items-center gap-3">
                <span className="text-sm font-medium">{w.weight} ק"ג</span>
                <span className="text-[11px]" style={{ color: palette.mutedInk }}>{formatShortDate(w.date)}</span>
                {w.delta !== null && <DeltaBadge delta={w.delta} />}
              </div>
              <button onClick={() => deleteWeight(w.id)} style={{ color: palette.mutedInk }}>
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeltaLine({ label, delta }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: palette.mutedInk }}>{label}</span>
      <DeltaBadge delta={delta} />
    </div>
  );
}

function DeltaBadge({ delta }) {
  if (delta === null) {
    return <span className="text-xs" style={{ color: palette.mutedInk }}>—</span>;
  }
  if (delta === 0) {
    return (
      <span className="text-xs flex items-center gap-0.5" style={{ color: palette.mutedInk }}>
        <Minus size={12} /> ללא שינוי
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span className="text-xs flex items-center gap-0.5 font-medium" style={{ color: up ? palette.danger : palette.tasksAccent }}>
      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(delta)} ק"ג
    </span>
  );
}
