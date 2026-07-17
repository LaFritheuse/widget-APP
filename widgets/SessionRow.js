import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../shared/theme';
import { ScalePressable, GlassCard, GhostBtn, IconButton, ConfirmDeleteRow, sharedStyles } from '../shared/UIKit';
import { useToast } from '../shared/ToastProvider';

/* data: { name, symbol, dateStart, dateEnd, remainingDays, progressPct } */
export const SessionRow = ({ data, onView, onPlay, onStats, onEdit, onCopy, onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  return (
    <GlassCard delay={300}>
      <View style={styles.srow}>
        <ScalePressable onPress={onPlay} style={styles.playBtnWrap}>
          <LinearGradient colors={[colors.silver1, colors.silver2]} style={styles.playBtn}><Text style={{ fontSize: 12 }}>▶️</Text></LinearGradient>
        </ScalePressable>
        <View style={{ flex: 1 }}>
          <Text style={sharedStyles.srowName}>{data.name}</Text>
          <Text style={sharedStyles.srowMeta}>{data.symbol} · {data.dateStart} – {data.dateEnd}</Text>
        </View>
      </View>

      {!confirming && (
        <View style={styles.srowActions}>
          <GhostBtn text="View Session" onPress={onView} />
          <IconButton icon="📊" onPress={onStats} />
          <IconButton icon="✏️" onPress={onEdit} />
          <IconButton icon="📋" onPress={onCopy} />
          <IconButton icon="🗑️" danger onPress={() => setConfirming(true)} />
        </View>
      )}
      <ConfirmDeleteRow
        visible={confirming}
        label="Supprimer cette session ?"
        onCancel={() => setConfirming(false)}
        onConfirm={() => { setConfirming(false); onDelete && onDelete(); }}
      />

      <View style={sharedStyles.progressTrack}>
        <LinearGradient colors={[colors.silver1, colors.silver3]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[sharedStyles.progressFill, { width: `${data.progressPct}%` }]} />
      </View>
      <Text style={{ fontSize: 10.5, color: colors.textDim, marginTop: 6 }}>Remaining days: {data.remainingDays}</Text>
    </GlassCard>
  );
};

export const SESSION_ROW_DEMO = {
  name: 'H4', symbol: 'EURUSD', dateStart: '01/15/2024', dateEnd: '02/13/2025',
  remainingDays: 328, progressPct: 32,
};

const styles = StyleSheet.create({
  srow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playBtnWrap: { borderRadius: 17, overflow: 'hidden' },
  playBtn: { width: 34, height: 34, justifyContent: 'center', alignItems: 'center' },
  srowActions: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' },
});

export default function SessionRowDemo() {
  const showToast = useToast();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <SessionRow
        data={SESSION_ROW_DEMO}
        onView={() => {}}
        onPlay={() => showToast('Session lancée ▶️')}
        onStats={() => showToast('Analytics ouvertes')}
        onEdit={() => showToast('Mode édition')}
        onCopy={() => showToast('Session dupliquée')}
        onDelete={() => showToast('Session supprimée')}
      />
    </View>
  );
}
