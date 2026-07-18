import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, ScalePressable, ChevronIcon } from '../shared/UIKit';
import { useToast } from '../shared/ToastProvider';

/* "PnL Calendar" — feature phare des trading journals (TradesViz, TradeZella,
   P&L Ledger...) : un mois en grille, chaque jour teinté selon son P&L,
   navigable, et tapotable pour le détail. Même DA que le reste (cartes
   verre, argent/chrome, vert/rouge sémantiques). */

const DAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTH_LABELS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const PNL_CAP = 300;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DayCell = ({ day, pnl, isToday, size, onPress }) => {
  const hasTrade = pnl !== undefined;
  const alpha = hasTrade ? 0.16 + Math.min(1, Math.abs(pnl) / PNL_CAP) * 0.55 : 0;
  const bg = !hasTrade ? 'rgba(255,255,255,0.03)' : pnl >= 0 ? `rgba(23,201,116,${alpha})` : `rgba(239,74,92,${alpha})`;
  return (
    <ScalePressable onPress={onPress} scaleTo={0.9} disabled={!hasTrade} style={{ width: size, height: size }}>
      <View style={[styles.cell, { backgroundColor: bg }, isToday && styles.cellToday]}>
        <Text style={[styles.cellDay, isToday && styles.cellDayToday]}>{day}</Text>
        {hasTrade && (
          <Text style={[styles.cellPnl, { color: pnl >= 0 ? colors.green : colors.red }]} numberOfLines={1}>
            {pnl >= 0 ? '+' : ''}{Math.round(pnl)}
          </Text>
        )}
      </View>
    </ScalePressable>
  );
};

/* getMonthData(year, month) => { [jourDuMois]: pnl } */
export const PnLCalendarHeatmap = ({ getMonthData, onDayPress }) => {
  const [monthOffset, setMonthOffset] = useState(0);
  /* flexBasis en % + aspectRatio:1 dans une ligne qui wrap n'est pas fiable
     sur react-native-web (observé : seulement 3 cases par ligne au lieu de
     7, largeur ~2.3x trop grande). On mesure la largeur réelle disponible
     via onLayout et on calcule une taille de case en pixels exacts —
     garantit toujours 7 colonnes, carrées, collées. La valeur de repli
     (avant la première mesure) est basée sur l'écran pour éviter un flash. */
  const [gridWidth, setGridWidth] = useState(SCREEN_WIDTH - 64);
  const cellSize = gridWidth / 7;

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isCurrentMonth = monthOffset === 0;

  const monthData = useMemo(() => getMonthData(year, month), [year, month, getMonthData]);
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthTotal = Object.values(monthData).reduce((sum, v) => sum + v, 0);

  return (
    <GlassCard delay={0}>
      <View style={styles.head}>
        <ScalePressable onPress={() => setMonthOffset((m) => m - 1)} style={styles.navBtn}>
          <ChevronIcon direction="left" />
        </ScalePressable>
        <Text style={styles.monthLabel}>{MONTH_LABELS[month]} {year}</Text>
        <ScalePressable disabled={isCurrentMonth} onPress={() => setMonthOffset((m) => m + 1)} style={styles.navBtn}>
          <ChevronIcon direction="right" disabled={isCurrentMonth} />
        </ScalePressable>
      </View>

      <View style={styles.weekRow} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
        {DAY_LABELS.map((d) => <Text key={d} style={[styles.weekLabel, { width: cellSize }]}>{d}</Text>)}
      </View>
      <View style={styles.grid}>
        {cells.map((d, i) => (d === null
          ? <View key={`empty-${i}`} style={{ width: cellSize, height: cellSize }} />
          : (
            <DayCell
              key={d}
              day={d}
              size={cellSize}
              pnl={monthData[d]}
              isToday={isCurrentMonth && d === today.getDate()}
              onPress={() => onDayPress && onDayPress(d, monthData[d])}
            />
          )))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLbl}>Total du mois</Text>
        <Text style={[styles.footerVal, { color: monthTotal >= 0 ? colors.green : colors.red }]}>
          {monthTotal >= 0 ? '+' : ''}${monthTotal.toFixed(2)}
        </Text>
      </View>
    </GlassCard>
  );
};

/* Démo : données pseudo-aléatoires mais stables (dérivées de la date, pas de Math.random) */
const demoMonthData = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const seed = (year * 97 + month * 31 + d * 13) % 10;
    if (seed < 3) continue;
    const magnitude = ((seed * 47) % 280) + 20;
    data[d] = seed % 2 === 0 ? magnitude : -magnitude * 0.6;
  }
  return data;
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  navBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  monthLabel: { fontSize: 13, fontWeight: '700', color: colors.silver1 },
  weekRow: { flexDirection: 'row' },
  weekLabel: { textAlign: 'center', fontSize: 9, color: colors.textDim, fontWeight: '700', marginBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  /* Case = carré en pixels exacts (voir cellSize plus haut), sans marge ni
     padding : les cases se touchent de tous les côtés comme une vraie
     mosaïque de calendrier. */
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cellToday: { borderWidth: 1.5, borderColor: colors.chrome },
  cellDay: { fontSize: 11, color: colors.silver2, fontWeight: '600' },
  cellDayToday: { color: colors.chrome, fontWeight: '800' },
  cellPnl: { fontSize: 11, fontWeight: '800', marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  footerLbl: { fontSize: 10.5, color: colors.textDim, fontWeight: '700', textTransform: 'uppercase' },
  footerVal: { fontSize: 15, fontWeight: '800' },
});

export default function PnLCalendarHeatmapDemo() {
  const showToast = useToast();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <PnLCalendarHeatmap
        getMonthData={demoMonthData}
        onDayPress={(day, pnl) => showToast(`Day ${day}: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`)}
      />
    </View>
  );
}
