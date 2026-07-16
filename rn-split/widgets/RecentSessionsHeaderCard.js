import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../shared/theme';
import { GlassCard, ChromeBtn, sharedStyles } from '../shared/UIKit';

/* data: { current, max } */
export const RecentSessionsHeaderCard = ({ data, onNewSession }) => (
  <GlassCard delay={250}>
    <View style={sharedStyles.tableHeadRow}>
      <Text style={[sharedStyles.cardLabel, { marginBottom: 0 }]}>RECENT SESSIONS</Text>
      <ChromeBtn text="+ New Session" onPress={onNewSession} />
    </View>
    <Text style={{ fontSize: 11, color: colors.textDim, marginTop: 10 }}>{data.current} out of {data.max} sessions</Text>
    <View style={sharedStyles.progressTrack}>
      <LinearGradient colors={[colors.silver1, colors.silver3]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[sharedStyles.progressFill, { width: `${(data.current / data.max) * 100}%` }]} />
    </View>
  </GlassCard>
);

export const RECENT_SESSIONS_DEMO = { current: 3, max: 10 };

export default function RecentSessionsHeaderCardDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <RecentSessionsHeaderCard data={RECENT_SESSIONS_DEMO} onNewSession={() => {}} />
    </View>
  );
}
