import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { colors } from '../shared/theme';
import { GlassCard, GhostBtn, ChromeBtn, IconButton, ConfirmDeleteRow, sharedStyles } from '../shared/UIKit';
import { useToast } from '../shared/ToastProvider';
import { toPolylinePoints } from '../shared/chartMath';

/* width/height explicites obligatoires : sans elles, react-native-svg (surtout
   sur react-native-web) fait grandir le Svg pour remplir tout l'espace vertical
   disponible du parent flex:1, ce qui écrase le reste de la carte hors écran. */
const StratMiniChart = ({ points }) => (
  <Svg width="100%" height={60} viewBox="0 0 160 60" preserveAspectRatio="none" style={{ marginBottom: 8 }}>
    <Polyline points={points} fill="none" stroke={colors.silver2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/* data: { name, winRate, rr, totalTrades, equityCurve } — equityCurve =
   tableau brut de valeurs (ex: solde du compte trade après trade), pas une
   chaîne de points SVG déjà calculée. */
export const StrategyCard = ({ data, onEdit, onAnalytics, onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  const points = toPolylinePoints(data.equityCurve, { width: 160, height: 60, padding: 4 });
  return (
    <GlassCard delay={0} style={{ flex: 1 }}>
      <StratMiniChart points={points} />
      <View style={styles.stratStatsRow}>
        <View><Text style={styles.stratStatVal}>{data.winRate}%</Text><Text style={styles.stratStatLbl}>Win rate</Text></View>
        <View style={{ alignItems: 'flex-end' }}><Text style={styles.stratStatVal}>{data.rr}</Text><Text style={styles.stratStatLbl}>RR</Text></View>
      </View>
      <Text style={sharedStyles.srowName}>{data.name}</Text>
      <Text style={styles.stratStatLbl}>Total trades: {data.totalTrades}</Text>

      {!confirming && (
        <View style={[styles.srowActions, { marginTop: 10 }]}>
          <GhostBtn text="Edit" onPress={onEdit} style={{ flex: 1 }} />
          <ChromeBtn text="Analytics" onPress={onAnalytics} style={{ flex: 1 }} />
          <IconButton icon="trash" danger onPress={() => setConfirming(true)} />
        </View>
      )}
      <ConfirmDeleteRow
        visible={confirming}
        label="Supprimer cette stratégie ?"
        onCancel={() => setConfirming(false)}
        onConfirm={() => { setConfirming(false); onDelete && onDelete(); }}
      />
    </GlassCard>
  );
};

export const STRATEGY_DEMO = {
  name: '1R', winRate: 67.92, rr: 1.01, totalTrades: 53,
  equityCurve: [10000, 10120, 10180, 10310, 10380, 10460, 10520, 10570, 10600],
};

const styles = StyleSheet.create({
  stratStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stratStatVal: { fontSize: 16, fontWeight: '800', color: '#fff' },
  stratStatLbl: { fontSize: 9.5, color: colors.textDim },
  srowActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
});

export default function StrategyCardDemo() {
  const showToast = useToast();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60, flexDirection: 'row' }}>
      <StrategyCard
        data={STRATEGY_DEMO}
        onEdit={() => {}}
        onAnalytics={() => {}}
        onDelete={() => showToast('Stratégie supprimée')}
      />
    </View>
  );
}
