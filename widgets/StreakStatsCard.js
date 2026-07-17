import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, Pill, sharedStyles } from '../shared/UIKit';

/* data: { currentStreak: number (positif = victoires, négatif = pertes), bestWinStreak, worstLossStreak } */
export const StreakStatsCard = ({ data }) => {
  const n = Math.abs(data.currentStreak);
  const isWinning = data.currentStreak >= 0;
  const streakLabel = `${n} ${isWinning ? 'win' : 'loss'}${n > 1 ? (isWinning ? 's' : 'es') : ''} in a row`;

  return (
    <GlassCard delay={0}>
      <Text style={sharedStyles.cardLabel}>CURRENT STREAK</Text>
      <View style={{ marginTop: 4 }}>
        <Pill text={streakLabel} tone={isWinning ? 'up' : 'down'} />
      </View>
      <View style={styles.row}>
        <View>
          <Text style={[styles.val, { color: colors.green }]}>{data.bestWinStreak}</Text>
          <Text style={styles.lbl}>Best win streak</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.val, { color: colors.red }]}>{data.worstLossStreak}</Text>
          <Text style={styles.lbl}>Worst loss streak</Text>
        </View>
      </View>
    </GlassCard>
  );
};

export const STREAK_DEMO = { currentStreak: 3, bestWinStreak: 7, worstLossStreak: 4 };

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  val: { fontSize: 18, fontWeight: '800' },
  lbl: { fontSize: 9.5, color: colors.textDim, marginTop: 2 },
});

export default function StreakStatsCardDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <StreakStatsCard data={STREAK_DEMO} />
    </View>
  );
}
