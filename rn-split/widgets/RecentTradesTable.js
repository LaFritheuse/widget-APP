import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, GhostBtn, sharedStyles } from '../shared/UIKit';

/* data: [{ name, symbol, date, roi }] */
export const RecentTradesTable = ({ data, onJournal }) => (
  <GlassCard delay={460}>
    <View style={sharedStyles.tableHeadRow}>
      <Text style={[sharedStyles.cardLabel, { marginBottom: 0 }]}>RECENT TRADES</Text>
      <GhostBtn text="Journal" onPress={onJournal} />
    </View>
    <View style={styles.tableHead}>
      <Text style={[styles.thTxt, { flex: 1 }]}>Name</Text>
      <Text style={[styles.thTxt, { flex: 1.4 }]}>Symbol</Text>
      <Text style={[styles.thTxt, { flex: 1 }]}>Date</Text>
      <Text style={[styles.thTxt, { flex: 1.2, textAlign: 'right' }]}>ROI</Text>
    </View>
    {data.map((row, i) => (
      <View key={i} style={styles.tableRow}>
        <Text style={[styles.tdTxt, { flex: 1 }]}>{row.name}</Text>
        <Text style={[styles.tdTxt, { flex: 1.4 }]}>{row.symbol}</Text>
        <Text style={[styles.tdTxt, { flex: 1 }]}>{row.date}</Text>
        <Text style={[styles.tdTxt, { flex: 1.2, textAlign: 'right', fontWeight: '800', color: row.roi >= 0 ? colors.green : colors.red }]}>
          {row.roi >= 0 ? '+' : ''}${row.roi.toFixed(2)}
        </Text>
      </View>
    ))}
  </GlassCard>
);

export const RECENT_TRADES_DEMO = [
  { name: 'H4', symbol: 'EURUSD', date: '22/03', roi: 319.97 },
  { name: 'H4', symbol: 'EURUSD', date: '01/03', roi: -98.80 },
  { name: 'H4', symbol: 'EURUSD', date: '16/02', roi: -99.80 },
];

const styles = StyleSheet.create({
  tableHead: { flexDirection: 'row', marginTop: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  thTxt: { fontSize: 9, color: colors.textDim, fontWeight: '700', textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  tdTxt: { fontSize: 11.5, color: '#fff' },
});

export default function RecentTradesTableDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <RecentTradesTable data={RECENT_TRADES_DEMO} onJournal={() => {}} />
    </View>
  );
}
