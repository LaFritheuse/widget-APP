import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../shared/theme';
import { ScalePressable } from '../shared/UIKit';
import { useToast } from '../shared/ToastProvider';

/* data: { current, max, label } */
export const AddCard = ({ data, onPress }) => (
  <ScalePressable onPress={onPress} scaleTo={0.96} style={{ flex: 1 }}>
    <View style={styles.addCard}>
      <View style={styles.addCardPlus}><Text style={{ color: colors.silver1, fontSize: 18 }}>+</Text></View>
      <Text style={styles.addCardCnt}>{data.current} out of {data.max}</Text>
      <Text style={styles.addCardCta}>{data.label}</Text>
    </View>
  </ScalePressable>
);

export const ADD_STRATEGY_DEMO = { current: 1, max: 3, label: 'Create new strategy' };
export const ADD_CHECKLIST_DEMO = { current: 1, max: 3, label: 'Create new Checklist' };

const styles = StyleSheet.create({
  addCard: { flex: 1, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.16)', borderStyle: 'dashed', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.015)', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 26 },
  addCardPlus: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  addCardCnt: { fontSize: 11, color: colors.textDim },
  addCardCta: { fontSize: 12.5, fontWeight: '700', color: colors.silver1 },
});

export default function AddCardDemo() {
  const showToast = useToast();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60, flexDirection: 'row', height: 160 }}>
      <AddCard data={ADD_STRATEGY_DEMO} onPress={() => showToast('Nouvelle stratégie créée')} />
    </View>
  );
}
