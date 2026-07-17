import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, sharedStyles } from '../shared/UIKit';

/* data: { totalPnl, winRate, rr, monthGL, weekGL, dailyGL } */
export const StatTilesRow = ({ data }) => {
  const tiles = [
    { label: 'Total PnL', value: data.totalPnl },
    { label: 'Win Rate', value: data.winRate },
    { label: 'R/R', value: data.rr },
    { label: 'Month G/L', value: data.monthGL },
    { label: 'Week G/L', value: data.weekGL },
    { label: 'Daily G/L', value: data.dailyGL },
  ];
  return (
    <View style={styles.row3}>
      {tiles.map((t) => (
        <GlassCard key={t.label} delay={0} tint="light" centerHighlight style={{ flexBasis: '31%', paddingVertical: 12, paddingHorizontal: 10 }}>
          <Text style={[sharedStyles.cardLabel, { marginBottom: 4 }]}>{t.label}</Text>
          <Text style={sharedStyles.tileValue}>{t.value}</Text>
        </GlassCard>
      ))}
    </View>
  );
};

export const STAT_TILES_DEMO = { totalPnl: '$101.49', winRate: '33.33%', rr: '3.05', monthGL: '$33.83', weekGL: '$16.92', dailyGL: '$12.69' };

const styles = StyleSheet.create({
  row3: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});

export default function StatTilesRowDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <StatTilesRow data={STAT_TILES_DEMO} />
    </View>
  );
}
