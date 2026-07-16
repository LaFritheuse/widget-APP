import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, ChevronIcon, sharedStyles } from '../shared/UIKit';
import { useToast } from '../shared/ToastProvider';

/* data: { name, symbol, balance } */
export const SelectSessionCard = ({ data, open, onPress }) => (
  <Pressable onPress={onPress}>
    <GlassCard delay={350}>
      <View style={styles.row}>
        <View>
          <Text style={sharedStyles.srowName}>{data.name}</Text>
          <Text style={sharedStyles.srowMeta}>{data.symbol} · Balance {data.balance}</Text>
        </View>
        <ChevronIcon direction={open ? 'up' : 'down'} />
      </View>
    </GlassCard>
  </Pressable>
);

export const SELECT_SESSION_DEMO = { name: 'H4', symbol: 'EURUSD', balance: '10,467.13' };

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

export default function SelectSessionCardDemo() {
  const [open, setOpen] = useState(false);
  const showToast = useToast();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <SelectSessionCard
        data={SELECT_SESSION_DEMO}
        open={open}
        onPress={() => { setOpen((o) => !o); showToast('Sélection de session'); }}
      />
    </View>
  );
}
