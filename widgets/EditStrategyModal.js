import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors } from '../shared/theme';
import { BottomModal, IconButton, GhostBtn, ChromeBtn, sharedStyles } from '../shared/UIKit';
import { useToast } from '../shared/ToastProvider';

/* data: { name, description } */
export const EditStrategyModal = ({ visible, data, onClose, onSave }) => {
  const [name, setName] = useState(data.name);
  const [desc, setDesc] = useState(data.description || '');
  useEffect(() => { setName(data.name); setDesc(data.description || ''); }, [data, visible]);
  return (
    <BottomModal visible={visible} onClose={onClose}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff' }}>Edit Strategy</Text>
        <IconButton icon="close" onPress={onClose} size={28} />
      </View>
      <Text style={sharedStyles.fieldLabel}>Name</Text>
      <TextInput style={sharedStyles.fieldInput} value={name} onChangeText={setName} placeholderTextColor={colors.textDim} />
      <Text style={sharedStyles.fieldLabel}>Description</Text>
      <TextInput style={[sharedStyles.fieldInput, { height: 80, textAlignVertical: 'top' }]} value={desc} onChangeText={setDesc} multiline placeholder="Décris ta stratégie..." placeholderTextColor={colors.textDim} />
      <View style={sharedStyles.modalActions}>
        <GhostBtn text="Cancel" onPress={onClose} />
        <ChromeBtn text="Save" onPress={() => onSave({ name, description: desc })} />
      </View>
    </BottomModal>
  );
};

export const EDIT_STRATEGY_DEMO = { name: '1R', description: '' };

export default function EditStrategyModalDemo() {
  const [visible, setVisible] = useState(true);
  const showToast = useToast();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <EditStrategyModal
        visible={visible}
        data={EDIT_STRATEGY_DEMO}
        onClose={() => setVisible(false)}
        onSave={() => { setVisible(false); showToast('Stratégie mise à jour'); }}
      />
    </View>
  );
}
