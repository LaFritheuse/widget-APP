/* Transforme un tableau de valeurs brutes (ex: solde du compte au fil du
   temps) en chaîne de points SVG "x,y x,y ..." mise à l'échelle d'un
   viewBox — l'app fournit juste les valeurs, jamais des coordonnées écran
   déjà calculées. */
export const toPolylinePoints = (values, { width, height, padding = 6 }) => {
  if (!values || values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * stepX;
      const y = padding + (1 - (v - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
};
