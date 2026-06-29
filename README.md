# Tomer DayBoard

אפליקציית לוח יום אישית עם משימות, תזונה, מים, משקל והיסטוריה.

## הרצה מקומית

```bash
npm install
npm run dev
```

## העלאה ל-Vercel

- Framework Preset: Vite
- Build Command: npm run build
- Output Directory: dist

חשוב: בפרויקט הזה אין `package-lock.json` כדי ש-Vercel יתקין את החבילות מחדש מה-registry הציבורי של npm.


עדכון: נוספה רשימת מאכלים רחבה להשלמה אוטומטית, כולל שווארמה, פיצה, סושי ועוד. מוצרים שנשמרים בספר המוצרים מופיעים גם בהשלמה האוטומטית.
