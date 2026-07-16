import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors } from '../shared/theme';
import { BottomModal, IconButton, GhostBtn, ChromeBtn, Checkbox, Toggle, sharedStyles } from '../shared/UIKit';

/* data: { name, items: [{ text, checked, required }] } */
export const EditChecklistModal = ({ visible, data, onClose, onSave }) => {
  const [name, setName] = useState(data.name);
  const [items, setItems] = useState(data.items);
  const [newItem, setNewItem] = useState('');
  useEffect(() => { setName(data.name); setItems(data.items); }, [data, visible]);

  const addItem = () => { if (!newItem.trim()) return; setItems([...items, { text: newItem, checked: false, required: false }]); setNewItem(''); };
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const toggleRequired = (i) => setItems(items.map((it, idx) => (idx === i ? { ...it, required: !it.required } : it)));

  return (
    <BottomModal visible={visible} onClose={onClose}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff' }}>Edit Checklist</Text>
        <IconButton icon="✕" onPress={onClose} size={28} />
      </View>
      <Text style={sharedStyles.fieldLabel}>Name</Text>
      <TextInput style={sharedStyles.fieldInput} value={name} onChangeText={setName} placeholderTextColor={colors.textDim} />
      <Text style={sharedStyles.fieldLabel}>Checklist items</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput style={[sharedStyles.fieldInput, { flex: 1 }]} value={newItem} onChangeText={setNewItem} placeholder="Add your list items here" placeholderTextColor={colors.textDim} />
        <ChromeBtn text="Add +" onPress={addItem} />
      </View>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <Checkbox checked={item.checked} onToggle={() => {}} />
          <Text style={{ fontSize: 12.5, color: '#fff', flex: 1 }}>{item.text}</Text>
          <Text style={{ fontSize: 10, color: colors.textDim }}>Required?</Text>
          <Toggle on={item.required} onToggle={() => toggleRequired(i)} />
          <IconButton icon="🗑" danger size={26} onPress={() => removeItem(i)} />
        </View>
      ))}
      <View style={sharedStyles.modalActions}>
        <GhostBtn text="Cancel" onPress={onClose} />
        <ChromeBtn text="Save" onPress={() => onSave({ name, items })} />
      </View>
    </BottomModal>
  );
};

export const EDIT_CHECKLIST_DEMO = {
  name: 'Checklist 1R',
  items: [
    { text: 'Biais Daily identifié', checked: true, required: false },
    { text: 'Structure H1 dans le même sens que le biais', checked: true, required: false },
    { text: 'Pas de liquidité', checked: true, required: true },
  ],
};

export default function EditChecklistModalDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <EditChecklistModal visible={visible} data={EDIT_CHECKLIST_DEMO} onClose={() => setVisible(false)} onSave={() => setVisible(false)} />
    </View>
  );
}
