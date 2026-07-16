import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, FadeInDown, runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from './theme';

/* ============================================================
   UIKit — logique de bouton (ripple + scale) et de carte "verre"
   partagée par TOUS les widgets. Si un comportement de bouton doit
   changer, il ne se change qu'ici, une seule fois.
   ============================================================ */

/* Petit cercle de ripple, se détruit après son animation */
const RippleCircle = ({ x, y, onDone }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0.45);
  useEffect(() => {
    scale.value = withTiming(3.2, { duration: 480, easing: Easing.out(Easing.cubic) });
    opacity.value = withTiming(0, { duration: 480, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(onDone)();
    });
  }, []);
  const style = useAnimatedStyle(() => ({
    position: 'absolute', left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.55)', opacity: opacity.value, transform: [{ scale: scale.value }],
  }));
  return <Animated.View pointerEvents="none" style={style} />;
};

/* Bouton de base : scale au press + ripple visuel au point de tap.
   Le `style` (ex: flex:1 dans une rangée) est appliqué au VRAI
   conteneur extérieur, pas seulement au Pressable interne. */
export const ScalePressable = ({ children, style, onPress, scaleTo = 0.92, disabled }) => {
  const scale = useSharedValue(1);
  const idRef = useRef(0);
  const [ripples, setRipples] = useState([]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = (e) => {
    if (disabled) return;
    scale.value = withSpring(scaleTo, { damping: 15, stiffness: 300 });
    const { locationX, locationY } = e.nativeEvent;
    const id = idRef.current++;
    setRipples((r) => [...r, { id, x: locationX, y: locationY }]);
  };
  const handlePressOut = () => { if (!disabled) scale.value = withSpring(1, { damping: 12, stiffness: 250 }); };
  const removeRipple = (id) => setRipples((r) => r.filter((rp) => rp.id !== id));

  return (
    <Animated.View style={[style, animatedStyle, { overflow: 'hidden' }]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} disabled={disabled} style={{ flex: 1 }}>
        {children}
        {ripples.map((r) => <RippleCircle key={r.id} x={r.x} y={r.y} onDone={() => removeRipple(r.id)} />)}
      </Pressable>
    </Animated.View>
  );
};

export const GlassCard = ({ children, style, delay = 0 }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(380).easing(Easing.out(Easing.cubic))} style={[styles.cardWrapper, style]}>
    <BlurView intensity={25} tint="dark" style={styles.cardBlur}>
      <LinearGradient colors={['rgba(255,255,255,0.45)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardHighlight} />
      {children}
    </BlurView>
  </Animated.View>
);

export const SectionLabel = ({ text, style }) => <Text style={[styles.sectionTitle, style]}>{text}</Text>;

export const Pill = ({ text, tone }) => {
  const bg = tone === 'up' ? 'rgba(23,201,116,0.16)' : tone === 'down' ? 'rgba(239,74,92,0.16)' : 'rgba(255,255,255,0.08)';
  const color = tone === 'up' ? colors.green : tone === 'down' ? colors.red : colors.silver1;
  return <View style={[styles.pill, { backgroundColor: bg }]}><Text style={[styles.pillText, { color }]}>{text}</Text></View>;
};

export const IconButton = ({ icon, danger, onPress, size = 32 }) => (
  <ScalePressable onPress={onPress}>
    <View style={[styles.iconBtn, { width: size, height: size, borderRadius: size / 2 }, danger && { borderColor: 'rgba(239,74,92,0.3)' }]}>
      <Text style={[styles.iconBtnText, danger && { color: colors.red }]}>{icon}</Text>
    </View>
  </ScalePressable>
);

export const ChromeBtn = ({ text, onPress, style }) => (
  <ScalePressable onPress={onPress} style={style}>
    <LinearGradient colors={[colors.silver1, colors.silver2]} style={styles.btnChrome}>
      <Text style={styles.btnChromeText} numberOfLines={1}>{text}</Text>
    </LinearGradient>
  </ScalePressable>
);

export const GhostBtn = ({ text, onPress, style }) => (
  <ScalePressable onPress={onPress} style={style}>
    <View style={styles.btnGhost}><Text style={styles.btnGhostText} numberOfLines={1}>{text}</Text></View>
  </ScalePressable>
);

export const ChevronIcon = ({ direction = 'right', disabled }) => {
  const { Svg, Path } = require('react-native-svg');
  const rotation = direction === 'left' ? '180deg' : direction === 'down' ? '90deg' : direction === 'up' ? '-90deg' : '0deg';
  return (
    <View style={{ transform: [{ rotate: rotation }] }}>
      <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={disabled ? colors.textDim : colors.chrome} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 18l6-6-6-6" />
      </Svg>
    </View>
  );
};

export const Checkbox = ({ checked, onToggle }) => (
  <ScalePressable onPress={onToggle} scaleTo={0.8}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkboxMark}>✓</Text>}
    </View>
  </ScalePressable>
);

export const Toggle = ({ on, onToggle }) => {
  const pos = useSharedValue(on ? 14 : 1);
  useEffect(() => { pos.value = withTiming(on ? 14 : 1, { duration: 180, easing: Easing.out(Easing.cubic) }); }, [on]);
  const knobStyle = useAnimatedStyle(() => ({ transform: [{ translateX: pos.value }] }));
  return (
    <ScalePressable onPress={onToggle} scaleTo={0.92}>
      <View style={[styles.toggleTrack, on && styles.toggleTrackOn]}>
        <Animated.View style={[styles.toggleKnob, on && { backgroundColor: colors.green }, knobStyle]} />
      </View>
    </ScalePressable>
  );
};

/* Confirmation de suppression générique — "Annuler / Oui" avec cooldown de 1s.
   "ready" ne dépend que de la fin réelle de l'animation (callback natif),
   jamais d'un setTimeout séparé, pour éviter toute désynchronisation. */
export const ConfirmDeleteRow = ({ visible, label, onCancel, onConfirm }) => {
  const [ready, setReady] = useState(false);
  const fill = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setReady(false);
      fill.value = 0;
      fill.value = withTiming(1, { duration: 1000, easing: Easing.linear }, (finished) => {
        if (finished) runOnJS(setReady)(true);
      });
    } else {
      fill.value = 0;
    }
  }, [visible]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  if (!visible) return null;
  return (
    <View style={styles.confirmRow}>
      <Text style={styles.confirmTxt}>{label}</Text>
      <GhostBtn text="Annuler" onPress={onCancel} style={{ flexShrink: 0 }} />
      <ScalePressable onPress={() => ready && onConfirm()} disabled={!ready}>
        <View style={[styles.confirmYesBtn, ready && styles.confirmYesBtnReady]}>
          <Animated.View style={[styles.confirmYesFill, fillStyle]} />
          <Text style={styles.confirmYesTxt}>Oui</Text>
        </View>
      </ScalePressable>
    </View>
  );
};

export const BottomModal = ({ visible, onClose, children }) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable style={styles.modalBody} onPress={(e) => e.stopPropagation()}>
        {children}
      </Pressable>
    </Pressable>
  </Modal>
);

/* Styles communs réutilisés par plusieurs widgets (cartes, textes, boutons).
   Chaque widget peut importer `sharedStyles` en plus de ses styles propres. */
export const sharedStyles = StyleSheet.create({
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', color: colors.silver2, marginVertical: 20, marginLeft: 4 },
  cardWrapper: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.glass },
  cardBlur: { padding: 16 },
  cardHighlight: { position: 'absolute', top: 0, left: 14, right: 14, height: 1.5, opacity: 0.8 },
  cardLabel: { fontSize: 10, color: colors.textDim, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 },
  bigValue: { fontSize: 22, fontWeight: '800', color: '#fff' },
  tileValue: { fontSize: 15, fontWeight: '800', color: '#fff' },
  srowName: { fontSize: 14, fontWeight: '800', color: '#fff' },
  srowMeta: { fontSize: 10.5, color: colors.textDim, marginTop: 2 },
  descTxt: { fontSize: 12, color: colors.textDim, lineHeight: 18 },
  tableHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { width: 14, backgroundColor: colors.silver1 },
  fieldLabel: { fontSize: 11, color: colors.textDim, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  fieldInput: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, color: '#fff', fontSize: 13.5 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 },
});

const styles = StyleSheet.create({
  ...sharedStyles,
  pill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 99 },
  pillText: { fontSize: 10.5, fontWeight: '800' },
  btnChrome: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 99 },
  btnChromeText: { color: '#000', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  btnGhost: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 99 },
  btnGhostText: { color: colors.silver1, fontSize: 12, fontWeight: '700' },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center' },
  iconBtnText: { color: colors.silver2, fontSize: 14 },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: colors.silver1, borderColor: 'transparent' },
  checkboxMark: { fontSize: 11, color: '#0a0a0b', fontWeight: '800' },
  toggleTrack: { width: 34, height: 20, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center' },
  toggleTrackOn: { backgroundColor: 'rgba(23,201,116,0.25)', borderColor: 'rgba(23,201,116,0.4)' },
  toggleKnob: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.silver2 },
  confirmRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  confirmTxt: { fontSize: 11.5, color: colors.textDim, flex: 1 },
  confirmYesBtn: { position: 'relative', overflow: 'hidden', backgroundColor: 'rgba(239,74,92,0.18)', borderWidth: 1, borderColor: 'rgba(239,74,92,0.4)', borderRadius: 99, paddingVertical: 8, paddingHorizontal: 14, opacity: 0.45 },
  confirmYesBtnReady: { opacity: 1 },
  confirmYesFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: 'rgba(239,74,92,0.35)' },
  confirmYesTxt: { color: colors.red, fontSize: 11.5, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalBody: { backgroundColor: '#0e0f12', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
});
