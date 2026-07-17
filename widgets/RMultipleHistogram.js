import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../shared/theme';
import { GlassCard, sharedStyles } from '../shared/UIKit';
import { formatR } from '../shared/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BUCKET_DEFS = [
  { label: '≤-2R', test: (r) => r <= -1.5, tone: 'down' },
  { label: '-1R', test: (r) => r > -1.5 && r <= -0.5, tone: 'down' },
  { label: '0R', test: (r) => r > -0.5 && r <= 0.5, tone: 'neutral' },
  { label: '+1R', test: (r) => r > 0.5 && r <= 1.5, tone: 'up' },
  { label: '+2R', test: (r) => r > 1.5 && r <= 2.5, tone: 'up' },
  { label: '+3R', test: (r) => r > 2.5, tone: 'up' },
];

const toneColor = (tone) => (tone === 'up' ? colors.green : tone === 'down' ? colors.red : colors.silver2);

/* Le widget calcule lui-même la distribution par tranche et l'expectancy —
   l'app n'a qu'à fournir la liste brute des R-multiples de chaque trade
   fermé, pas des buckets ou une expectancy déjà calculés. */
/* rMultiples: number[] (ex: [1.2, -0.8, 2.1, -1.5, 0.3, ...]) */
export const RMultipleHistogram = ({ rMultiples }) => {
  const buckets = BUCKET_DEFS.map((b) => ({
    label: b.label,
    tone: b.tone,
    count: rMultiples.filter(b.test).length,
  }));
  const expectancy = rMultiples.length ? rMultiples.reduce((sum, r) => sum + r, 0) / rMultiples.length : 0;

  const CHART_W = SCREEN_WIDTH - 64, CHART_H = 150, TOP_PAD = 16, X_AXIS_H = 20;
  const DRAW_H = CHART_H - X_AXIS_H - TOP_PAD;
  const maxCount = Math.max(1, ...buckets.map((b) => b.count));
  const stepX = CHART_W / buckets.length;
  const barW = Math.min(30, stepX * 0.55);

  return (
    <GlassCard delay={0}>
      <View style={styles.head}>
        <Text style={[sharedStyles.cardLabel, { marginBottom: 0 }]}>R-MULTIPLE DISTRIBUTION</Text>
        <Text style={styles.expectancy}>Expectancy {formatR(expectancy)}</Text>
      </View>
      <Svg width={CHART_W} height={CHART_H}>
        <Line x1={0} x2={CHART_W} y1={TOP_PAD + DRAW_H} y2={TOP_PAD + DRAW_H} stroke={colors.cardBorder} strokeWidth={1} />
        {buckets.map((b, i) => {
          const h = (b.count / maxCount) * DRAW_H;
          const x = i * stepX + (stepX - barW) / 2;
          const y = TOP_PAD + DRAW_H - h;
          return (
            <React.Fragment key={b.label}>
              {b.count > 0 && <Rect x={x} y={y} width={barW} height={Math.max(3, h)} rx={4} fill={toneColor(b.tone)} opacity={0.85} />}
              <SvgText x={x + barW / 2} y={CHART_H - 4} fill={colors.textDim} fontSize="10" textAnchor="middle">{b.label}</SvgText>
              {b.count > 0 && (
                <SvgText x={x + barW / 2} y={y - 6} fill={colors.silver1} fontSize="10" fontWeight="700" textAnchor="middle">{b.count}</SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </GlassCard>
  );
};

export const R_MULTIPLE_DEMO = [
  1.2, -0.8, 2.1, -1.5, 0.3, 1.8, -2.2, 1.1, 0.9, -1.1,
  2.6, -0.6, 1.4, 0.2, -1.8, 1.6, 3.1, -0.4, 1.0, 2.3,
  -1.2, 0.8, 1.7, -0.9, 2.0, 1.3, -1.6, 0.5, 1.9, -0.7,
  2.8, 1.5, -2.5, 0.1, 1.2,
];

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  expectancy: { fontSize: 12, fontWeight: '800', color: colors.silver1 },
});

export default function RMultipleHistogramDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <RMultipleHistogram rMultiples={R_MULTIPLE_DEMO} />
    </View>
  );
}
