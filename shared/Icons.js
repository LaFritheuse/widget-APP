import React from 'react';
import Svg, { Path, Line, Polyline, Rect, Circle } from 'react-native-svg';

/* Petit set d'icônes trait fin (style outline), pensé pour rester
   monochrome et cohérent avec la DA verre/chrome — pas d'emoji colorés
   qui jurent avec le reste de l'interface. Chaque icône se colore via
   `color`, comme n'importe quel texte de l'app. */

const strokeIcon = (children) => ({ size = 18, color = '#c8ced6', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </Svg>
);

const ICONS = {
  play: ({ size = 18, color = '#c8ced6' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <Path d="M6 4l14 8-14 8V4z" />
    </Svg>
  ),
  edit: strokeIcon(<>
    <Path d="M12 20h9" />
    <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </>),
  copy: strokeIcon(<>
    <Rect x="9" y="9" width="12" height="12" rx="2" />
    <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>),
  stats: strokeIcon(<>
    <Line x1="18" y1="20" x2="18" y2="10" />
    <Line x1="12" y1="20" x2="12" y2="4" />
    <Line x1="6" y1="20" x2="6" y2="14" />
  </>),
  trash: strokeIcon(<>
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <Line x1="10" y1="11" x2="10" y2="17" />
    <Line x1="14" y1="11" x2="14" y2="17" />
  </>),
  close: strokeIcon(<>
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </>),
  home: strokeIcon(<>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </>),
  folder: strokeIcon(
    <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  ),
  refresh: strokeIcon(<>
    <Polyline points="23 4 23 10 17 10" />
    <Polyline points="1 20 1 14 7 14" />
    <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </>),
  check: strokeIcon(<Polyline points="20 6 9 17 4 12" />),
  award: strokeIcon(<>
    <Circle cx="12" cy="8" r="7" />
    <Polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </>),
};

export const Icon = ({ name, size, color, strokeWidth }) => {
  const Cmp = ICONS[name];
  return Cmp ? <Cmp size={size} color={color} strokeWidth={strokeWidth} /> : null;
};
