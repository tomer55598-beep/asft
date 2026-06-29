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

const TASK_PRIORITY = {
  high: "דחופה",
  normal: "רגילה",
  low: "נמוכה",
};

const FOOD_SUGGESTIONS = [
  "שווארמה",
  "שווארמה בצלחת",
  "שווארמה בפיתה",
  "שווארמה בלאפה",
  "שווארמה בבאגט",
  "פרגית",
  "פרגית בפיתה",
  "פרגית בלאפה",
  "קבב",
  "קבב בפיתה",
  "קבב בצלחת",
  "המבורגר",
  "צ׳יזבורגר",
  "נקניקיה",
  "סטייק",
  "אנטריקוט",
  "סינטה",
  "אסאדו",
  "חזה עוף",
  "עוף",
  "כרעיים",
  "כנפיים",
  "שניצל",
  "שניצלונים",
  "חזה עוף על האש",
  "קציצות",
  "כדורי בשר",
  "צלי בקר",
  "גולאש",
  "בשר טחון",
  "עראייס",
  "מעורב ירושלמי",
  "חמין",
  "טונה",
  "סלמון",
  "דג לבן",
  "אמנון",
  "נסיכת הנילוס",
  "דניס",
  "חביתה",
  "ביצה",
  "ביצים",
  "מקושקשת",
  "שקשוקה",
  "פיצה",
  "משולש פיצה",
  "פיצה משפחתית",
  "פיצה אישית",
  "פיצה מרגריטה",
  "פיצה פפרוני",
  "פיצה טונה",
  "פיצה פטריות",
  "פיצה זיתים",
  "פוקאצ׳ה",
  "טוסט",
  "טוסט גבינה",
  "טוסט נקניק",
  "בורקס",
  "בורקס גבינה",
  "בורקס תפוח אדמה",
  "מלאווח",
  "ג׳חנון",
  "פיתה",
  "לאפה",
  "באגט",
  "לחם",
  "לחמניה",
  "חלה",
  "טורטייה",
  "ראפ",
  "קרואסון",
  "מאפה גבינה",
  "סושי",
  "רול סושי",
  "סושי סלמון",
  "סושי טונה",
  "סושי צמחוני",
  "ניגירי",
  "מאקי",
  "אינסייד אאוט",
  "קומבינציית סושי",
  "פוקי",
  "פוקי סלמון",
  "פוקי טונה",
  "אורז סושי",
  "אצות",
  "אדממה",
  "גיוזה",
  "מוקפץ",
  "מוקפץ עוף",
  "מוקפץ בקר",
  "מוקפץ ירקות",
  "נודלס",
  "פאד תאי",
  "ראמן",
  "אטריות",
  "אורז מוקפץ",
  "עוף חמוץ מתוק",
  "עוף טריאקי",
  "עוף בקארי",
  "קארי עוף",
  "עוף קארי עם אורז",
  "קארי ירוק",
  "קארי אדום",
  "קארי תאילנדי",
  "עוף במסאלה",
  "עוף טיקה",
  "צ׳יקן טיקה",
  "עוף חמאה",
  "אורז עם עוף",
  "עוף עם תפוחי אדמה",
  "פלאפל",
  "פלאפל בפיתה",
  "פלאפל בצלחת",
  "חומוס",
  "חומוס גרגירים",
  "חומוס פול",
  "טחינה",
  "סביח",
  "סלט",
  "סלט ירקות",
  "סלט יווני",
  "סלט טונה",
  "סלט עוף",
  "ירקות",
  "מלפפון",
  "עגבניה",
  "פלפל",
  "בצל",
  "חסה",
  "כרוב",
  "גזר",
  "ברוקולי",
  "כרובית",
  "שעועית ירוקה",
  "תירס",
  "אפונה",
  "אורז",
  "אורז לבן",
  "אורז מלא",
  "פתיתים",
  "קוסקוס",
  "בורגול",
  "קינואה",
  "פסטה",
  "פסטה פסטו",
  "פסטה עגבניות",
  "פסטה בולונז",
  "ספגטי בולונז",
  "בולונז",
  "רוטב בולונז",
  "פסטה שמנת",
  "פסטה אלפרדו",
  "פסטה רוזה",
  "פסטה טונה",
  "פסטה עוף",
  "לזניה",
  "רביולי",
  "ניוקי",
  "תפוח אדמה",
  "פירה",
  "צ׳יפס",
  "בטטה",
  "עדשים",
  "שעועית",
  "חומוס מבושל",
  "מרק",
  "מרק עוף",
  "מרק ירקות",
  "קוטג׳",
  "גבינה לבנה",
  "גבינה צהובה",
  "גבינה בולגרית",
  "פטה",
  "יוגורט",
  "יוגורט חלבון",
  "מעדן חלבון",
  "מילקי",
  "חלב",
  "שוקו",
  "סקי",
  "שמנת",
  "חמאה",
  "אבקת חלבון",
  "שייק חלבון",
  "קינדר בואנו",
  "קינדר שוקולד",
  "קינדר ג׳וי",
  "קינדר קאנטרי",
  "M&M",
  "M&M בוטנים",
  "M&M שוקולד",
  "סניקרס",
  "טוויקס",
  "מארס",
  "קיטקט",
  "אוראו",
  "נוטלה",
  "פסק זמן",
  "כיף כף",
  "קליק",
  "טורטית",
  "שוקולד",
  "שוקולד חלב",
  "שוקולד מריר",
  "קרמבו",
  "גלידה",
  "ארטיק",
  "מגנום",
  "קורנטו",
  "במבה",
  "במבה נוגט",
  "ביסלי",
  "דוריטוס",
  "תפוצ׳יפס",
  "פרינגלס",
  "בייגלה",
  "פופקורן",
  "גרעינים",
  "אגוזים",
  "שקדים",
  "קשיו",
  "חטיף חלבון",
  "גרנולה",
  "קורנפלקס",
  "חמאת בוטנים",
  "בננה",
  "תפוח",
  "תפוז",
  "ענבים",
  "אבטיח",
  "מלון",
  "תותים",
  "מנגו",
  "אננס",
  "אפרסק",
  "אגס",
  "תמרים",
  "צימוקים",
  "אבוקדו",
  "קפה",
  "נס קפה",
  "קפה שחור",
  "תה",
  "מיץ",
  "קולה",
  "זירו",
  "מים",
  "סודה"
];

function getTaskStatus(task) {
  return task.status || (task.done ? "done" : "not_done");
}

function isTaskDone(task) {
  return getTaskStatus(task) === "done";
}

function getTaskPriority(task) {
  return task.priority || "normal";
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


function getFoodSuggestionMatch(name) {
  const cleanedName = cleanFoodName(name);
  const normalized = normalizeFoodText(cleanedName || name);
  if (!normalized) return null;
  return FOOD_SUGGESTIONS.find((item) => normalized.includes(normalizeFoodText(item))) || null;
}

function getSavedFoodMatch(savedFoods, name) {
  const cleanedName = cleanFoodName(name);
  const normalized = normalizeFoodText(cleanedName || name);
  if (!normalized) return null;
  return savedFoods.find((item) => {
    const productName = normalizeFoodText(item.name);
    return productName && (normalized.includes(productName) || productName.includes(normalized));
  }) || null;
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
  const [newTaskPriority, setNewTaskPriority] = useState("normal");
  const [taskFilter, setTaskFilter] = useState("open");
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
    const extractedGrams = extractGramsFromName(foodForm.name);
    const savedMatch = getSavedFoodMatch(savedFoods, foodForm.name);
    const suggestionMatch = getFoodSuggestionMatch(foodForm.name);
    setFoodForm((prev) => {
      const next = {
        ...prev,
        grams: prev.grams || (extractedGrams ? String(extractedGrams) : prev.grams),
      };

      if (!prev.name.trim()) {
        next.autoNote = "";
      } else if (savedMatch) {
        next.autoNote = `זוהה מוצר שמור בספר: ${savedMatch.name}. אפשר לפתוח את ספר המוצרים ולהוסיף אותו בלחיצה אחת.`;
      } else if (suggestionMatch) {
        next.autoNote = `זוהה מאכל מהרשימה: ${suggestionMatch}. מלא את הפרטים לפי האריזה/המידע שיש לך.`;
      } else {
        next.autoNote = "";
      }

      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [foodForm.name, foodForm.grams, savedFoods]);

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
    const next = [...tasks, { id: uid(), text, status: "not_done", statusText: "", priority: newTaskPriority, done: false, createdAt: Date.now(), due }];
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

  const updateTaskPriority = (id, priority) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, priority } : t));
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
            newTaskPriority={newTaskPriority}
            setNewTaskPriority={setNewTaskPriority}
            taskFilter={taskFilter}
            setTaskFilter={setTaskFilter}
            addTask={addTask}
            toggleTask={toggleTask}
            updateTaskStatus={updateTaskStatus}
            updateTaskStatusText={updateTaskStatusText}
            updateTaskPriority={updateTaskPriority}
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

function isDueToday(due) {
  return Boolean(due && due.date === getDateKey());
}

function taskDueTime(task) {
  return task.due ? new Date(`${task.due.date}T${task.due.time || "23:59"}`).getTime() : Infinity;
}

function taskPriorityRank(task) {
  const p = getTaskPriority(task);
  if (p === "high") return 0;
  if (p === "normal") return 1;
  return 2;
}

function sortTasksSmart(a, b) {
  const aDone = isTaskDone(a);
  const bDone = isTaskDone(b);
  if (aDone !== bDone) return aDone ? 1 : -1;
  const aOverdue = !aDone && isOverdue(a.due);
  const bOverdue = !bDone && isOverdue(b.due);
  if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
  const aDue = taskDueTime(a);
  const bDue = taskDueTime(b);
  if (aDue !== bDue) return aDue - bDue;
  const aPr = taskPriorityRank(a);
  const bPr = taskPriorityRank(b);
  if (aPr !== bPr) return aPr - bPr;
  return (a.createdAt || 0) - (b.createdAt || 0);
}

function formatDue(due) {
  if (!due || !due.date) return "";
  const txt = formatShortDate(due.date);
  return due.time ? `${txt} · ${due.time}` : txt;
}

function TasksView({
  tasks, newTaskText, setNewTaskText, newTaskPriority, setNewTaskPriority, taskFilter, setTaskFilter,
  addTask, toggleTask, updateTaskStatus, updateTaskStatusText, updateTaskPriority, deleteTask, clearDoneTasks,
  showDueFields, setShowDueFields, dueDateInput, setDueDateInput, dueTimeInput, setDueTimeInput,
}) {
  const activeTasks = tasks.filter((t) => !isTaskDone(t)).slice().sort(sortTasksSmart);
  const doneTasks = tasks.filter((t) => isTaskDone(t)).slice().sort(sortTasksSmart);
  const overdueTasks = activeTasks.filter((t) => isOverdue(t.due));
  const todayTasks = activeTasks.filter((t) => isDueToday(t.due));
  const highTasks = activeTasks.filter((t) => getTaskPriority(t) === "high");

  const filterOptions = [
    { key: "open", label: `פתוחות (${activeTasks.length})` },
    { key: "today", label: `היום (${todayTasks.length})` },
    { key: "high", label: `דחופות (${highTasks.length})` },
    { key: "done", label: `בוצעו (${doneTasks.length})` },
    { key: "all", label: `הכל (${tasks.length})` },
  ];

  const shownTasks = (() => {
    if (taskFilter === "today") return todayTasks;
    if (taskFilter === "high") return highTasks;
    if (taskFilter === "done") return doneTasks;
    if (taskFilter === "all") return tasks.slice().sort(sortTasksSmart);
    return activeTasks;
  })();

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

        <div className="mb-2">
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="w-full rounded-xl px-3 py-2 outline-none text-sm"
            style={{ background: palette.bg, border: `1px solid ${palette.border}`, color: palette.ink }}
          >
            <option value="normal">עדיפות רגילה</option>
            <option value="high">עדיפות דחופה</option>
            <option value="low">עדיפות נמוכה</option>
          </select>
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

      {tasks.length > 0 && (
        <Card>
          <div className="grid grid-cols-4 gap-2 text-center mb-3">
            <MiniStat label="פתוחות" value={activeTasks.length} />
            <MiniStat label="היום" value={todayTasks.length} />
            <MiniStat label="דחופות" value={highTasks.length} danger={highTasks.length > 0} />
            <MiniStat label="באיחור" value={overdueTasks.length} danger={overdueTasks.length > 0} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filterOptions.map((f) => {
              const active = taskFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setTaskFilter(f.key)}
                  className="rounded-xl px-3 py-1.5 text-xs whitespace-nowrap"
                  style={{
                    background: active ? palette.tasksAccent : palette.bg,
                    color: active ? "#fff" : palette.mutedInk,
                    border: `1px solid ${active ? palette.tasksAccent : palette.border}`,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {doneTasks.length > 0 && (
            <button onClick={clearDoneTasks} className="text-xs flex items-center gap-1 mt-3" style={{ color: palette.mutedInk }}>
              <RotateCcw size={12} /> נקה משימות שבוצעו
            </button>
          )}
        </Card>
      )}

      {tasks.length === 0 && (
        <p className="text-sm text-center mt-8" style={{ color: palette.mutedInk }}>
          הרשימה פנויה. מה הדבר הראשון שצריך לעשות היום?
        </p>
      )}

      {tasks.length > 0 && shownTasks.length === 0 && (
        <p className="text-sm text-center mt-6" style={{ color: palette.mutedInk }}>
          אין משימות להצגה בסינון הזה.
        </p>
      )}

      {shownTasks.length > 0 && (
        <div className="space-y-2 mb-4">
          {shownTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onStatusChange={(status) => updateTaskStatus(task.id, status)}
              onStatusTextChange={(statusText) => updateTaskStatusText(task.id, statusText)}
              onPriorityChange={(priority) => updateTaskPriority(task.id, priority)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, danger }) {
  return (
    <div className="rounded-xl py-2 px-1" style={{ background: danger ? "#F7E5E2" : palette.tasksAccentSoft }}>
      <p className="text-base font-semibold" style={{ color: danger ? palette.danger : palette.tasksAccent }}>{value}</p>
      <p className="text-[10px]" style={{ color: palette.mutedInk }}>{label}</p>
    </div>
  );
}

function TaskRow({ task, onToggle, onStatusChange, onStatusTextChange, onPriorityChange, onDelete }) {
  const status = getTaskStatus(task);
  const done = status === "done";
  const priority = getTaskPriority(task);
  const overdue = !done && isOverdue(task.due);
  const priorityColor = priority === "high" ? palette.danger : priority === "low" ? palette.mutedInk : palette.tasksAccent;

  return (
    <div className="rounded-xl px-3 py-2.5" style={{ background: palette.surface, border: `1px solid ${overdue ? palette.danger : palette.border}` }}>
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
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {task.due && task.due.date && (
              <span className="text-[11px] flex items-center gap-1" style={{ color: overdue ? palette.danger : palette.mutedInk }}>
                <Calendar size={11} /> {formatDue(task.due)}{overdue ? " · באיחור" : ""}
              </span>
            )}
            <span className="text-[11px]" style={{ color: priorityColor }}>
              {TASK_PRIORITY[priority] || TASK_PRIORITY.normal}
            </span>
          </div>
        </div>
        <button onClick={onDelete} style={{ color: palette.mutedInk }}>
          <X size={16} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 pr-8">
        <label className="text-[11px]" style={{ color: palette.mutedInk }}>
          סטטוס
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 outline-none text-xs"
            style={{ background: done ? palette.tasksAccentSoft : palette.bg, border: `1px solid ${palette.border}`, color: done ? palette.tasksAccent : palette.ink }}
          >
            <option value="not_done">לא בוצע</option>
            <option value="done">בוצע</option>
          </select>
        </label>

        <label className="text-[11px]" style={{ color: palette.mutedInk }}>
          עדיפות
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="mt-1 w-full rounded-xl px-3 py-2 outline-none text-xs"
            style={{ background: palette.bg, border: `1px solid ${palette.border}`, color: priorityColor }}
          >
            <option value="normal">רגילה</option>
            <option value="high">דחופה</option>
            <option value="low">נמוכה</option>
          </select>
        </label>
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
          כתוב מאכל וכמות בגרמים, למשל: שווארמה 200 גרם, פיצה, סושי או קינדר בואנו. האפליקציה תזהה מאכלים מהרשימה ותשלים גרמים מהטקסט, ואת הפרטים אפשר למלא/לערוך לפני שמירה.
        </p>
        <div className="space-y-2">
          <input
            value={foodForm.name}
            onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
            placeholder="מה אכלת? למשל: שווארמה / פיצה / סושי / M&M"
            list="food-suggestions"
            className="w-full rounded-xl px-3 py-2 outline-none"
            style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
          />
          <datalist id="food-suggestions">
            {savedFoods.map((p) => <option key={`saved-${p.id}`} value={p.name} />)}
            {FOOD_SUGGESTIONS.map((item) => <option key={`food-${item}`} value={item} />)}
          </datalist>
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
          <div>
            <p className="text-base font-medium flex items-center gap-1.5">
              <BookOpen size={18} style={{ color: palette.foodAccent }} /> ספר מוצרים
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: palette.mutedInk }}>כל מוצר שתשמור כאן יופיע גם בהשלמה האוטומטית.</p>
          </div>
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
              עדיין אין מוצרים שמורים. הוסיפו מוצר כדי לרשום אותו בלחיצה אחת בכל פעם; מוצרים שמורים יופיעו גם בהשלמה האוטומטית.
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
