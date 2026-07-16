import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, ChromeBtn, Pill, sharedStyles } from '../shared/UIKit';

/* data: { name, strategy, symbol, balance, daysRemaining } */
export const SessionHeaderCard = ({ data, onGoToChart }) => (
  <GlassCard delay={400}>
    <View style={sharedStyles.tableHeadRow}>
      <View>
        <Text style={sharedStyles.srowName}>{data.name}</Text>
        <Text style={sharedStyles.srowMeta}>{data.strategy} · {data.symbol}</Text>
      </View>
      <Text style={sharedStyles.bigValue}>{data.balance}</Text>
    </View>
    <View style={{ marginTop: 10, flexDirection: 'row' }}><Pill text={`${data.daysRemaining} days remaining`} tone="neutral" /></View>
    <ChromeBtn text="Go to chart →" style={{ marginTop: 14, alignSelf: 'flex-start' }} onPress={onGoToChart} />
  </GlassCard>
);

export const SESSION_HEADER_DEMO = { name: 'H4', strategy: 'No strategy', symbol: 'EURUSD', balance: '$10,101.49', daysRemaining: 328 };

export default function SessionHeaderCardDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <SessionHeaderCard data={SESSION_HEADER_DEMO} onGoToChart={() => {}} />
    </View>
  );
}
