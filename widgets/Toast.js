import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors } from '../shared/theme';

export const Toast = ({ visible, message }) => {
  const op = useSharedValue(0);
  const ty = useSharedValue(10);
  useEffect(() => {
    if (visible) { op.value = withTiming(1, { duration: 180 }); ty.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) }); }
    else { op.value = withTiming(0, { duration: 150 }); ty.value = withTiming(10, { duration: 150 }); }
  }, [visible]);
  const animStyle = useAnimatedStyle(() => ({ opacity: op.value, transform: [{ translateY: ty.value }] }));
  return (
    <Animated.View pointerEvents="none" style={[styles.toast, animStyle]}>
      <BlurView intensity={30} tint="dark" style={styles.toastBlur}>
        <Text style={styles.toastTxt}>{message}</Text>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: { position: 'absolute', bottom: 100, alignSelf: 'center', zIndex: 100, overflow: 'hidden', borderRadius: 99, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  toastBlur: { backgroundColor: 'rgba(20,21,24,0.75)', padding: 10, paddingHorizontal: 16, borderRadius: 99 },
  toastTxt: { color: colors.silver1, fontSize: 12, fontWeight: '700' },
});
