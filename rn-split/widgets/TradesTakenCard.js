import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, sharedStyles } from '../shared/UIKit';

/* data: { total, buys, sells } */
export const TradesTakenCard = ({ data, style }) => {
  const buyPct = Math.round((data.buys / data.total) * 100);
  return (
    <GlassCard delay={100} style={style}>
      <Text style={sharedStyles.cardLabel}>TRADES TAKEN</Text>
      <Text style={sharedStyles.bigValue}>{data.total}</Text>
      <View style={styles.splitTrack}>
        <View style={{ flex: buyPct, backgroundColor: colors.green }} />
        <View style={{ flex: 100 - buyPct, backgroundColor: colors.red }} />
      </View>
      <View style={styles.splitLabels}>
        <Text style={[styles.splitTxt, { color: colors.green }]}>{data.buys} buys</Text>
        <Text style={[styles.splitTxt, { color: colors.red }]}>{data.sells} sells</Text>
      </View>
    </GlassCard>
  );
};

export const TRADES_TAKEN_DEMO = { total: 127, buys: 59, sells: 68 };

const styles = StyleSheet.create({
  splitTrack: { height: 6, borderRadius: 3, flexDirection: 'row', overflow: 'hidden', marginTop: 12 },
  splitLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  splitTxt: { fontSize: 10.5, fontWeight: '700' },
});

export default function TradesTakenCardDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <TradesTakenCard data={TRADES_TAKEN_DEMO} />
    </View>
  );
}
