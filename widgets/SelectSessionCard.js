import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, ChevronIcon, sharedStyles } from '../shared/UIKit';

/* data: { name, symbol, balance } */
export const SelectSessionCard = ({ data, open, onPress }) => (
  <Pressable onPress={onPress}>
    <GlassCard delay={350} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18 }}>
      <View>
        <Text style={sharedStyles.srowName}>{data.name}</Text>
        <Text style={sharedStyles.srowMeta}>{data.symbol} · Balance {data.balance}</Text>
      </View>
      <ChevronIcon direction={open ? 'up' : 'down'} />
    </GlassCard>
  </Pressable>
);

export const SELECT_SESSION_DEMO = { name: 'H4', symbol: 'EURUSD', balance: '10,467.13' };

export default function SelectSessionCardDemo() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <SelectSessionCard data={SELECT_SESSION_DEMO} open={open} onPress={() => setOpen(!open)} />
    </View>
  );
}
