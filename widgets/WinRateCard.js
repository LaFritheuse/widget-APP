import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, sharedStyles } from '../shared/UIKit';
import { Icon } from '../shared/Icons';

/* data: { value } */
export const WinRateCard = ({ data, style }) => (
  <GlassCard delay={150} style={style}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Icon name="award" size={11} color={colors.textDim} />
      <Text style={[sharedStyles.cardLabel, { marginBottom: 0 }]}>OVERALL WIN RATE</Text>
    </View>
    <Text style={[sharedStyles.bigValue, { marginTop: 6 }]}>{data.value}%</Text>
  </GlassCard>
);

export const WIN_RATE_DEMO = { value: 64.29 };

export default function WinRateCardDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <WinRateCard data={WIN_RATE_DEMO} />
    </View>
  );
}
