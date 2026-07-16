import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors } from '../shared/theme';

const TAB_ITEM_WIDTH = 56;

const TabIconComponent = ({ icon, isActive, animType }) => {
  const animValue = useSharedValue(0);
  useEffect(() => {
    if (!isActive) { animValue.value = 0; return; }
    animValue.value = 0;
    if (animType === 'pulse') animValue.value = withSequence(withTiming(1.3, { duration: 150 }), withTiming(1, { duration: 150 }));
    if (animType === 'shake') animValue.value = withSequence(withTiming(-4, { duration: 50 }), withTiming(4, { duration: 100 }), withTiming(0, { duration: 50 }));
    if (animType === 'spin') animValue.value = withTiming(360, { duration: 400 });
    if (animType === 'check') animValue.value = withSequence(withTiming(-20, { duration: 150 }), withTiming(0, { duration: 150 }));
    if (animType === 'bars') animValue.value = withSequence(withTiming(1.4, { duration: 150 }), withTiming(1, { duration: 150 }));
  }, [isActive, animType]);

  const animatedStyle = useAnimatedStyle(() => {
    if (animType === 'pulse') return { transform: [{ scale: animValue.value || 1 }] };
    if (animType === 'shake') return { transform: [{ translateX: animValue.value }] };
    if (animType === 'spin' || animType === 'check') return { transform: [{ rotate: `${animValue.value}deg` }] };
    if (animType === 'bars') return { transform: [{ scaleY: animValue.value || 1 }] };
    return {};
  });

  /* Boîte de taille fixe pour toutes les icônes + fontSize réduite pour
     l'emoji couleur 📊 qui rend naturellement plus gros que les symboles
     monochromes (▦ ▤ ⟲ ✓) — évite les tailles visuellement incohérentes. */
  const isColorEmoji = icon === '📊';
  return (
    <Animated.View style={[styles.tabIconBox, animatedStyle]}>
      <Text style={[styles.tabIcon, isColorEmoji && styles.tabIconEmoji, isActive && { color: colors.silver1 }]}>{icon}</Text>
    </Animated.View>
  );
};

export const TAB_DEFS = [
  { id: 'Dashboard', icon: '▦', anim: 'pulse' },
  { id: 'Sessions', icon: '▤', anim: 'shake' },
  { id: 'Strategies', icon: '⟲', anim: 'spin' },
  { id: 'Checklists', icon: '✓', anim: 'check' },
  { id: 'Analytics', icon: '📊', anim: 'bars' },
];

export const BottomTabBar = ({ activeTab, onTabPress }) => {
  const indicatorPos = useSharedValue(TAB_DEFS.findIndex((t) => t.id === activeTab) * TAB_ITEM_WIDTH);

  const handlePress = (index, id) => {
    indicatorPos.value = withTiming(index * TAB_ITEM_WIDTH, { duration: 260, easing: Easing.out(Easing.cubic) });
    onTabPress(id);
  };
  const indicatorStyle = useAnimatedStyle(() => ({ transform: [{ translateX: indicatorPos.value }] }));

  return (
    <View style={styles.tabbarWrap}>
      <BlurView intensity={40} tint="dark" style={styles.tabbar}>
        <Animated.View style={[styles.tabIndicator, indicatorStyle]} />
        {TAB_DEFS.map((tab, i) => (
          <Pressable key={tab.id} onPress={() => handlePress(i, tab.id)} style={styles.tabItem}>
            <TabIconComponent icon={tab.icon} isActive={activeTab === tab.id} animType={tab.anim} />
            <Text style={[styles.tabLabel, activeTab === tab.id && { color: colors.silver1 }]}>{tab.id}</Text>
          </Pressable>
        ))}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabbarWrap: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  tabbar: { flexDirection: 'row', backgroundColor: 'rgba(18,19,22,0.6)', borderRadius: 99, padding: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)', overflow: 'hidden' },
  tabItem: { width: TAB_ITEM_WIDTH, alignItems: 'center', paddingVertical: 8, zIndex: 2 },
  tabIconBox: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  tabIcon: { fontSize: 16, color: colors.textDim, textAlign: 'center', lineHeight: 20 },
  tabIconEmoji: { fontSize: 13 },
  tabLabel: { fontSize: 8, fontWeight: '700', color: colors.textDim },
  tabIndicator: { position: 'absolute', top: 6, bottom: 6, left: 6, width: TAB_ITEM_WIDTH, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 99, zIndex: 1 },
});

export default function BottomTabBarDemo() {
  const [active, setActive] = React.useState('Dashboard');
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <BottomTabBar activeTab={active} onTabPress={setActive} />
    </View>
  );
}
