import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors } from '../shared/theme';
import { GlassCard, ScalePressable, sharedStyles } from '../shared/UIKit';

/* Le drawdown (recul par rapport au plus haut d'equity) est l'une des
   statistiques de gestion du risque les plus suivies dans les journaux de
   trading. Interaction : un petit interrupteur $/% fait un fondu enchaîné
   sur la valeur au lieu d'un simple changement instantané. */
/* data: { currentDD: {abs, pct}, maxDD: {abs, pct}, recoveryDays } */
export const MaxDrawdownCard = ({ data }) => {
  const [mode, setMode] = useState('abs');
  const fmt = (v) => (mode === 'abs' ? `-$${Math.abs(v.abs).toFixed(2)}` : `-${Math.abs(v.pct).toFixed(1)}%`);

  return (
    <GlassCard delay={0}>
      <View style={styles.head}>
        <Text style={[sharedStyles.cardLabel, { marginBottom: 0 }]}>CURRENT DRAWDOWN</Text>
        <View style={styles.toggle}>
          {['abs', 'pct'].map((m) => (
            <ScalePressable key={m} onPress={() => setMode(m)} scaleTo={0.9}>
              <View style={[styles.toggleOpt, mode === m && styles.toggleOptActive]}>
                <Text style={[styles.toggleTxt, mode === m && styles.toggleTxtActive]}>{m === 'abs' ? '$' : '%'}</Text>
              </View>
            </ScalePressable>
          ))}
        </View>
      </View>
      <Animated.View key={mode} entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
        <Text style={[sharedStyles.bigValue, styles.bigValue]}>{fmt(data.currentDD)}</Text>
      </Animated.View>
      <View style={styles.row}>
        <View>
          <Text style={styles.val}>{fmt(data.maxDD)}</Text>
          <Text style={styles.lbl}>Max drawdown</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.val}>{data.recoveryDays}d</Text>
          <Text style={styles.lbl}>Time to recover</Text>
        </View>
      </View>
    </GlassCard>
  );
};

export const DRAWDOWN_DEMO = {
  currentDD: { abs: 84.20, pct: 0.8 },
  maxDD: { abs: 312.60, pct: 3.1 },
  recoveryDays: 4,
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 99, padding: 2 },
  toggleOpt: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 99 },
  toggleOptActive: { backgroundColor: colors.silver1 },
  toggleTxt: { fontSize: 11, fontWeight: '800', color: colors.textDim },
  toggleTxtActive: { color: '#0a0a0b' },
  bigValue: { color: colors.red, marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  val: { fontSize: 16, fontWeight: '800', color: '#fff' },
  lbl: { fontSize: 9.5, color: colors.textDim, marginTop: 2 },
});

export default function MaxDrawdownCardDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <MaxDrawdownCard data={DRAWDOWN_DEMO} />
    </View>
  );
}
