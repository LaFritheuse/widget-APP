import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, IconButton, sharedStyles } from '../shared/UIKit';

/* data: { text } */
export const DescriptionCard = ({ data, onEdit }) => (
  <GlassCard delay={430}>
    <View style={sharedStyles.tableHeadRow}>
      <Text style={[sharedStyles.cardLabel, { marginBottom: 0 }]}>DESCRIPTION</Text>
      <IconButton icon="✎" onPress={onEdit} />
    </View>
    <Text style={sharedStyles.descTxt}>{data.text}</Text>
  </GlassCard>
);

export const DESCRIPTION_DEMO = { text: 'Session H4 sur EURUSD, focus continuation de tendance après retest de zone de liquidité.' };

export default function DescriptionCardDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <DescriptionCard data={DESCRIPTION_DEMO} onEdit={() => {}} />
    </View>
  );
}
