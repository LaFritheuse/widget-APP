import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../shared/theme';
import { GlassCard, sharedStyles } from '../shared/UIKit';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const toneColor = (tone) => (tone === 'up' ? colors.green : tone === 'down' ? colors.red : colors.silver2);

/* data: { expectancy: string, buckets: [{ label, count, tone: 'up'|'down'|'neutral' }] } */
export const RMultipleHistogram = ({ data }) => {
  const CHART_W = SCREEN_WIDTH - 64, CHART_H = 150, TOP_PAD = 16, X_AXIS_H = 20;
  const DRAW_H = CHART_H - X_AXIS_H - TOP_PAD;
  const maxCount = Math.max(1, ...data.buckets.map((b) => b.count));
  const stepX = CHART_W / data.buckets.length;
  const barW = Math.min(30, stepX * 0.55);

  return (
    <GlassCard delay={0}>
      <View style={styles.head}>
        <Text style={[sharedStyles.cardLabel, { marginBottom: 0 }]}>R-MULTIPLE DISTRIBUTION</Text>
        <Text style={styles.expectancy}>{data.expectancy}</Text>
      </View>
      <Svg width={CHART_W} height={CHART_H}>
        <Line x1={0} x2={CHART_W} y1={TOP_PAD + DRAW_H} y2={TOP_PAD + DRAW_H} stroke={colors.cardBorder} strokeWidth={1} />
        {data.buckets.map((b, i) => {
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

export const R_MULTIPLE_DEMO = {
  expectancy: 'Expectancy +0.42R',
  buckets: [
    { label: '≤-2R', count: 3, tone: 'down' },
    { label: '-1R', count: 9, tone: 'down' },
    { label: '0R', count: 2, tone: 'neutral' },
    { label: '+1R', count: 14, tone: 'up' },
    { label: '+2R', count: 8, tone: 'up' },
    { label: '+3R', count: 5, tone: 'up' },
  ],
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  expectancy: { fontSize: 12, fontWeight: '800', color: colors.silver1 },
});

export default function RMultipleHistogramDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <RMultipleHistogram data={R_MULTIPLE_DEMO} />
    </View>
  );
}
