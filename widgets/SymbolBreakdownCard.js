import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../shared/theme';
import { GlassCard, sharedStyles } from '../shared/UIKit';

const HorizontalBarRow = ({ label, pct, count }) => {
  const widthAnim = useSharedValue(0);
  useEffect(() => { widthAnim.value = withTiming(pct, { duration: 420, easing: Easing.out(Easing.cubic) }); }, [pct]);
  const styleAnim = useAnimatedStyle(() => ({ width: `${widthAnim.value}%` }));
  return (
    <View style={styles.hbarRow}>
      <Text style={styles.hbarLabel} numberOfLines={1}>{label}</Text>
      <View style={styles.hbarTrack}>
        <Animated.View style={[styles.hbarFillWrap, styleAnim]}>
          <LinearGradient colors={[colors.silver3, colors.silver1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 7 }} />
        </Animated.View>
      </View>
      <Text style={styles.hbarCount}>{count}</Text>
    </View>
  );
};

/* data: [{ symbol, count }] — count brut par symbole ; le widget normalise
   lui-même la largeur des barres par rapport au plus gros total, l'app n'a
   pas besoin de calculer un pourcentage. */
export const SymbolBreakdownCard = ({ data }) => {
  const maxCount = Math.max(1, ...data.map((row) => row.count));
  return (
    <GlassCard delay={200}>
      <Text style={sharedStyles.cardLabel}>TRADES BY SYMBOL</Text>
      {data.map((row) => (
        <HorizontalBarRow key={row.symbol} label={row.symbol} pct={(row.count / maxCount) * 96} count={row.count} />
      ))}
    </GlassCard>
  );
};

export const SYMBOLS_DEMO = [
  { symbol: 'EURUSD', count: 82 },
  { symbol: 'GBPUSD', count: 24 },
  { symbol: 'XAUUSD', count: 14 },
  { symbol: 'USDJPY', count: 7 },
];

const styles = StyleSheet.create({
  hbarRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  hbarLabel: { fontSize: 11.5, fontWeight: '700', color: '#fff', width: 60 },
  hbarTrack: { flex: 1, height: 13, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
  hbarFillWrap: { height: '100%', borderRadius: 7 },
  hbarCount: { fontSize: 10.5, color: colors.textDim, width: 40, textAlign: 'right' },
});

export default function SymbolBreakdownCardDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <SymbolBreakdownCard data={SYMBOLS_DEMO} />
    </View>
  );
}
