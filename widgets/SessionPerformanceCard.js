import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '../shared/theme';
import { GlassCard, ScalePressable, sharedStyles } from '../shared/UIKit';
import { formatR } from '../shared/format';

/* Statistique classique des journaux de trading (performance par session
   Asia/London/New York). Interaction : un sélecteur segmenté avec
   indicateur glissant, même langage visuel que la tab bar du bas. */
const SESSIONS = ['Asia', 'London', 'New York'];
const SEG_WIDTH = 88;

/* data: { [session]: { winRate, trades, avgR } } — avgR = NOMBRE brut
   (ex: 1.4), mis en forme "1.40R" par le widget. */
export const SessionPerformanceCard = ({ data, initialSession = 'London' }) => {
  const [active, setActive] = useState(initialSession);
  const indicatorX = useSharedValue(SESSIONS.indexOf(initialSession) * SEG_WIDTH);
  const stats = data[active];

  const select = (session, index) => {
    setActive(session);
    indicatorX.value = withTiming(index * SEG_WIDTH, { duration: 220, easing: Easing.out(Easing.cubic) });
  };

  const indicatorStyle = useAnimatedStyle(() => ({ transform: [{ translateX: indicatorX.value }] }));

  return (
    <GlassCard delay={0}>
      <Text style={sharedStyles.cardLabel}>WIN RATE BY SESSION</Text>
      <View style={styles.segTrack}>
        <Animated.View style={[styles.segIndicator, indicatorStyle]} />
        {SESSIONS.map((s, i) => (
          <ScalePressable key={s} onPress={() => select(s, i)} style={{ width: SEG_WIDTH }}>
            <View style={styles.segItem}>
              <Text style={[styles.segTxt, active === s && styles.segTxtActive]}>{s}</Text>
            </View>
          </ScalePressable>
        ))}
      </View>
      <View style={styles.statsRow}>
        <View>
          <Text style={styles.val}>{stats.winRate}%</Text>
          <Text style={styles.lbl}>Win rate</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.val}>{stats.trades}</Text>
          <Text style={styles.lbl}>Trades</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.val}>{formatR(stats.avgR)}</Text>
          <Text style={styles.lbl}>Avg R</Text>
        </View>
      </View>
    </GlassCard>
  );
};

export const SESSION_PERF_DEMO = {
  Asia: { winRate: 48, trades: 22, avgR: 0.6 },
  London: { winRate: 71, trades: 54, avgR: 1.4 },
  'New York': { winRate: 59, trades: 38, avgR: 0.9 },
};

const styles = StyleSheet.create({
  segTrack: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 99, padding: 3, marginTop: 4 },
  segIndicator: { position: 'absolute', top: 3, bottom: 3, left: 3, width: SEG_WIDTH, backgroundColor: colors.silver1, borderRadius: 99 },
  segItem: { paddingVertical: 8, alignItems: 'center' },
  segTxt: { fontSize: 11.5, fontWeight: '700', color: colors.textDim },
  segTxtActive: { color: '#0a0a0b' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  val: { fontSize: 16, fontWeight: '800', color: '#fff' },
  lbl: { fontSize: 9.5, color: colors.textDim, marginTop: 2 },
});

export default function SessionPerformanceCardDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <SessionPerformanceCard data={SESSION_PERF_DEMO} />
    </View>
  );
}
