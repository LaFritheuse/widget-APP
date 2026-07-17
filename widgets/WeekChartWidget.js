import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { colors } from '../shared/theme';
import { ScalePressable, GlassCard, ChevronIcon, sharedStyles } from '../shared/UIKit';
import { formatWeekRangeFr, dayLabelFr } from '../shared/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedRect = Animated.createAnimatedComponent(Rect);

/* Barre animée : withTiming + ease-out (pas de rebond), dégradé argenté commun */
const AnimatedBar = ({ x, width, targetBaseValue, targetTopValue = 0, maxY, drawHeight, topPadding = 14, stacked }) => {
  const targetBasePx = (targetBaseValue / maxY) * drawHeight;
  const targetTopPx = stacked ? (targetTopValue / maxY) * drawHeight : 0;
  const animatedBase = useSharedValue(0);
  const animatedTop = useSharedValue(0);

  useEffect(() => {
    const config = { duration: 420, easing: Easing.out(Easing.cubic) };
    animatedBase.value = withTiming(targetBasePx, config);
    animatedTop.value = withTiming(targetTopPx, config);
  }, [targetBasePx, targetTopPx]);

  const baseProps = useAnimatedProps(() => ({ height: Math.max(0, animatedBase.value), y: topPadding + drawHeight - animatedBase.value }));
  const topProps = useAnimatedProps(() => ({ height: Math.max(0, animatedTop.value), y: topPadding + drawHeight - animatedBase.value - animatedTop.value }));
  const capProps = useAnimatedProps(() => ({ height: Math.min(animatedBase.value, 4), y: topPadding + drawHeight - Math.min(animatedBase.value, 4) }));

  return (
    <G>
      {stacked && <AnimatedRect x={x} width={width} fill={colors.glassStrong} rx={4} animatedProps={topProps} />}
      <AnimatedRect x={x} width={width} fill="url(#chartBarGrad)" rx={4} animatedProps={baseProps} />
      <AnimatedRect x={x} width={width} fill="url(#chartBarGrad)" animatedProps={capProps} />
    </G>
  );
};

/* data: [{ weekStart: Date|ISO, values: [{base, top?}] (7 entrées, Dim→Sam) }]
   — le widget calcule seul le libellé de semaine, les initiales des jours
   et quelle colonne est "aujourd'hui" à partir de weekStart ; l'app n'a
   jamais besoin de composer un texte de plage de dates ni de marquer
   "isToday" à la main pour chaque semaine. */
export const WeekChartWidget = ({ title, data, stacked, unit }) => {
  const [weekIdx, setWeekIdx] = useState(0);
  const week = data[weekIdx];
  const weekStart = week.weekStart instanceof Date ? week.weekStart : new Date(week.weekStart);
  const today = new Date();
  const maxVal = Math.max(...week.values.map((d) => (stacked ? d.base + (d.top || 0) : d.base)));
  const currentMaxY = unit === '%' ? 100 : Math.max(10, Math.ceil(maxVal / 10) * 10);
  const CHART_W = SCREEN_WIDTH - 64, CHART_H = 160, Y_AXIS_W = 32, TOP_PAD = 14;
  const DRAW_H = CHART_H - 24 - TOP_PAD, DRAW_W = CHART_W - Y_AXIS_W, BAR_W = 20;

  return (
    <GlassCard delay={50}>
      <Text style={sharedStyles.cardLabel}>{title}</Text>
      <View style={styles.chartHeader}>
        <ScalePressable disabled={weekIdx === data.length - 1} onPress={() => setWeekIdx(weekIdx + 1)} style={styles.navBtn}>
          <ChevronIcon direction="left" disabled={weekIdx === data.length - 1} />
        </ScalePressable>
        <Text style={styles.weekLabel}>{formatWeekRangeFr(weekStart)}</Text>
        <ScalePressable disabled={weekIdx === 0} onPress={() => setWeekIdx(weekIdx - 1)} style={styles.navBtn}>
          <ChevronIcon direction="right" disabled={weekIdx === 0} />
        </ScalePressable>
      </View>
      <Svg width={CHART_W} height={CHART_H}>
        <Defs>
          <SvgLinearGradient id="chartBarGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.silver1} />
            <Stop offset="100%" stopColor={colors.silver3} />
          </SvgLinearGradient>
        </Defs>
        {[currentMaxY, currentMaxY / 2, 0].map((val, i) => {
          const yPos = TOP_PAD + i * (DRAW_H / 2);
          return (
            <G key={`grid-${i}`}>
              <Line x1={Y_AXIS_W} x2={CHART_W} y1={yPos} y2={yPos} stroke={colors.cardBorder} strokeWidth={1} strokeDasharray={val === 0 ? '' : '4,4'} />
              <SvgText x={0} y={val === 0 ? yPos - 4 : yPos + 4} fill={colors.textDim} fontSize="10">{val}{unit}</SvgText>
            </G>
          );
        })}
        {week.values.map((item, i) => {
          const stepX = DRAW_W / 7;
          const xPos = Y_AXIS_W + i * stepX + (stepX - BAR_W) / 2;
          const cellDate = new Date(weekStart);
          cellDate.setDate(weekStart.getDate() + i);
          const isToday = cellDate.toDateString() === today.toDateString();
          return (
            <G key={`bar-${i}`}>
              <AnimatedBar x={xPos} width={BAR_W} targetBaseValue={item.base} targetTopValue={item.top || 0} maxY={currentMaxY} drawHeight={DRAW_H} topPadding={TOP_PAD} stacked={stacked} />
              <SvgText x={xPos + BAR_W / 2} y={CHART_H - 2} fill={isToday ? colors.chrome : colors.textDim} fontSize="10" textAnchor="middle" fontWeight={isToday ? 'bold' : 'normal'}>{dayLabelFr(cellDate)}</SvgText>
            </G>
          );
        })}
      </Svg>
    </GlassCard>
  );
};

export const TIME_INVESTED_WEEKS = [
  { weekStart: '2026-07-12', values: [
    { base: 5, top: 22 }, { base: 12, top: 8 }, { base: 1, top: 0 },
    { base: 15, top: 5 }, { base: 38, top: 15 }, { base: 22, top: 8 }, { base: 0, top: 0 },
  ]},
  { weekStart: '2026-07-05', values: [
    { base: 9, top: 8 }, { base: 9, top: 5 }, { base: 8, top: 4 },
    { base: 8, top: 3 }, { base: 10, top: 1 }, { base: 14, top: 6 }, { base: 10, top: 4 },
  ]},
  { weekStart: '2026-06-28', values: [
    { base: 12, top: 5 }, { base: 20, top: 10 }, { base: 35, top: 5 },
    { base: 22, top: 8 }, { base: 10, top: 3 }, { base: 5, top: 0 }, { base: 25, top: 6 },
  ]},
];

export const WIN_RATE_WEEKS = [
  { weekStart: '2026-07-12', values: [
    { base: 0 }, { base: 58 }, { base: 0 }, { base: 71 }, { base: 82 }, { base: 40 }, { base: 0 },
  ]},
  { weekStart: '2026-07-05', values: [
    { base: 60 }, { base: 55 }, { base: 50 }, { base: 66 }, { base: 72 }, { base: 48 }, { base: 63 },
  ]},
  { weekStart: '2026-06-28', values: [
    { base: 44 }, { base: 70 }, { base: 90 }, { base: 65 }, { base: 52 }, { base: 30 }, { base: 78 },
  ]},
];

const styles = StyleSheet.create({
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  weekLabel: { fontSize: 13, fontWeight: '700', color: colors.silver1 },
});

/* Démo autonome : renomme ce fichier en App.js pour le tester seul */
export default function WeekChartWidgetDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <WeekChartWidget title="TIME INVESTED BY DAY" data={TIME_INVESTED_WEEKS} stacked unit="m" />
      <View style={{ height: 12 }} />
      <WeekChartWidget title="WIN RATE BY DAY" data={WIN_RATE_WEEKS} stacked={false} unit="%" />
    </View>
  );
}
