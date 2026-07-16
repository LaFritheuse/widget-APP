import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../shared/theme';
import { GlassCard, GhostBtn, Checkbox, sharedStyles } from '../shared/UIKit';

/* data: { name, createdDaysAgo, items: [{ text, checked }] } */
export const ChecklistCard = ({ data, onEdit, onToggleItem }) => (
  <GlassCard delay={0} style={{ flex: 1 }}>
    <View style={sharedStyles.tableHeadRow}>
      <View>
        <Text style={sharedStyles.srowName}>{data.name}</Text>
        <Text style={styles.metaTxt}>Created {data.createdDaysAgo} days ago</Text>
      </View>
      <GhostBtn text="Edit" onPress={onEdit} />
    </View>
    {data.items.map((item, i) => (
      <View key={i} style={styles.checkItem}>
        <Checkbox checked={item.checked} onToggle={() => onToggleItem(i)} />
        <Text style={styles.checkItemTxt}>{item.text}</Text>
      </View>
    ))}
  </GlassCard>
);

export const CHECKLIST_DEMO = {
  name: 'Checklist 1R', createdDaysAgo: 12,
  items: [
    { text: 'Biais Daily identifié', checked: true },
    { text: 'Structure H1 dans le même sens que le biais', checked: true },
    { text: 'Pas de liquidité', checked: false },
  ],
};

const styles = StyleSheet.create({
  metaTxt: { fontSize: 9.5, color: colors.textDim },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 10 },
  checkItemTxt: { fontSize: 12.5, color: '#fff', flex: 1 },
});

export default function ChecklistCardDemo() {
  const [items, setItems] = useState(CHECKLIST_DEMO.items);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60, flexDirection: 'row' }}>
      <ChecklistCard
        data={{ ...CHECKLIST_DEMO, items }}
        onEdit={() => {}}
        onToggleItem={(i) => setItems((its) => its.map((it, idx) => (idx === i ? { ...it, checked: !it.checked } : it)))}
      />
    </View>
  );
}
