import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, sharedStyles } from '../shared/UIKit';

/* Statistiques classiques des apps de trading journal (profit factor,
   expectancy, avg win/loss, best/worst trade) — même famille visuelle que
   Stat Tiles (teinte claire + reflet centré). */
/* data: { profitFactor, expectancy, avgWin, avgLoss, bestTrade, worstTrade } */
export const AdvancedStatsRow = ({ data }) => {
  const tiles = [
    { label: 'Profit Factor', value: data.profitFactor },
    { label: 'Expectancy', value: data.expectancy },
    { label: 'Avg Win', value: data.avgWin, tone: 'up' },
    { label: 'Avg Loss', value: data.avgLoss, tone: 'down' },
    { label: 'Best Trade', value: data.bestTrade, tone: 'up' },
    { label: 'Worst Trade', value: data.worstTrade, tone: 'down' },
  ];
  return (
    <View style={styles.row3}>
      {tiles.map((t) => (
        <GlassCard key={t.label} delay={0} tint="light" centerHighlight style={{ flexBasis: '31%', paddingVertical: 12, paddingHorizontal: 10 }}>
          <Text style={[sharedStyles.cardLabel, { marginBottom: 4 }]}>{t.label}</Text>
          <Text style={[sharedStyles.tileValue, t.tone === 'up' && { color: colors.green }, t.tone === 'down' && { color: colors.red }]}>{t.value}</Text>
        </GlassCard>
      ))}
    </View>
  );
};

export const ADVANCED_STATS_DEMO = {
  profitFactor: '1.87', expectancy: '+0.42R', avgWin: '+$186.40', avgLoss: '-$79.20', bestTrade: '+$612.00', worstTrade: '-$210.50',
};

const styles = StyleSheet.create({
  row3: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});

export default function AdvancedStatsRowDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <AdvancedStatsRow data={ADVANCED_STATS_DEMO} />
    </View>
  );
}
