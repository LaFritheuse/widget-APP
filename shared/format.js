/* Formatage centralisé — les widgets reçoivent des NOMBRES bruts (pas des
   chaînes déjà mises en forme), pour que l'app qui branche les vraies
   statistiques n'ait jamais à reproduire cette logique côté appelant. */

export const formatMoney = (value) => `$${Math.abs(value).toFixed(2)}`;

export const formatSignedMoney = (value) => `${value >= 0 ? '+' : '-'}${formatMoney(value)}`;

export const formatThousands = (value) => Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatPct = (value, digits = 2) => `${value.toFixed(digits)}%`;

export const formatR = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}R`;

export const formatDateShort = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const formatDateUS = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

export const daysAgo = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const diffMs = Date.now() - d.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

const DAY_LABELS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTH_LABELS_FR_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export const dayLabelFr = (date) => DAY_LABELS_FR[(date instanceof Date ? date : new Date(date)).getDay()];

/* "12 juil. – 18 juil." à partir d'une seule date de début de semaine —
   l'app n'a besoin de fournir qu'une date, pas un texte déjà composé. */
export const formatWeekRangeFr = (weekStart) => {
  const start = weekStart instanceof Date ? weekStart : new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${start.getDate()} ${MONTH_LABELS_FR_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTH_LABELS_FR_SHORT[end.getMonth()]}`;
};
