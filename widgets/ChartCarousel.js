import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import Svg, { Rect, Line, Polygon, Polyline, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { colors } from '../shared/theme';
import { GlassCard, sharedStyles } from '../shared/UIKit';
import { toPolylinePoints } from '../shared/chartMath';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const EquityCurveChart = ({ points }) => {
  const pathLength = 700;
  const strokeOffset = useSharedValue(pathLength);
  useEffect(() => { strokeOffset.value = withDelay(200, withTiming(0, { duration: 1100, easing: Easing.out(Easing.cubic) })); }, [points]);
  const animatedLineProps = useAnimatedProps(() => ({ strokeDashoffset: strokeOffset.value }));
  const fillPoints = `${points} 300,110 0,110`;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 110" preserveAspectRatio="none">
      <Defs>
        <SvgLinearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={colors.silver1} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={colors.silver1} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <Polygon points={fillPoints} fill="url(#eqFill)" />
      <AnimatedPolyline points={points} fill="none" stroke={colors.silver2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={pathLength} animatedProps={animatedLineProps} />
    </Svg>
  );
};

/* Réplique fidèle du 2e slide SVG du HTML (rects statiques rouge/vert par
   groupe) plutôt qu'une réinterprétation "données" — le HTML ne dérive pas
   ces formes d'un jeu de données, ce sont des rects codés en dur. */
const MonthlyPerformanceChart = () => (
  <Svg width="100%" height="100%" viewBox="0 0 300 110">
    <Line x1="0" y1="55" x2="300" y2="55" stroke={colors.cardBorder} strokeWidth={1} strokeDasharray="4,4" />
    <Rect x={20} y={35} width={70} height={20} rx={4} fill={colors.red} opacity={0.85} />
    <Rect x={20} y={55} width={40} height={18} rx={4} fill={colors.green} opacity={0.85} />
    <Rect x={115} y={40} width={55} height={15} rx={4} fill={colors.red} opacity={0.85} />
    <Rect x={115} y={55} width={30} height={18} rx={4} fill={colors.green} opacity={0.85} />
    <Rect x={210} y={45} width={30} height={10} rx={4} fill={colors.red} opacity={0.85} />
    <Rect x={210} y={55} width={65} height={18} rx={4} fill={colors.green} opacity={0.85} />
  </Svg>
);

const DailyPerformanceChart = () => (
  <Svg width="100%" height="100%" viewBox="0 0 300 110">
    <Line x1="0" y1="55" x2="300" y2="55" stroke={colors.cardBorder} strokeWidth={1} strokeDasharray="4,4" />
    <Rect x={14} y={30} width={26} height={25} rx={4} fill={colors.green} opacity={0.9} />
    <Rect x={52} y={55} width={26} height={14} rx={4} fill={colors.red} opacity={0.85} />
    <Rect x={90} y={55} width={26} height={10} rx={4} fill={colors.red} opacity={0.85} />
    <Rect x={128} y={38} width={26} height={17} rx={4} fill={colors.green} opacity={0.9} />
    <Rect x={166} y={55} width={26} height={7} rx={4} fill={colors.red} opacity={0.85} />
    <Rect x={204} y={20} width={26} height={35} rx={4} fill={colors.green} opacity={0.9} />
  </Svg>
);

/* data: { equityCurve: number[] } — tableau brut de valeurs de solde, pas
   une chaîne de points SVG déjà calculée. */
export const ChartCarousel = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const labels = ['Equity Curve', 'Monthly Performance', 'Daily Performance'];
  const slideW = SCREEN_WIDTH - 64;
  const equityPoints = toPolylinePoints(data.equityCurve, { width: 300, height: 110, padding: 8 });

  return (
    <GlassCard delay={450}>
      <Text style={[sharedStyles.cardLabel, { marginBottom: 8 }]}>{labels[activeIndex]}</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / slideW))}
      >
        <View style={{ width: slideW, height: 110 }}><EquityCurveChart points={equityPoints} /></View>
        <View style={{ width: slideW, height: 110 }}><MonthlyPerformanceChart /></View>
        <View style={{ width: slideW, height: 110 }}><DailyPerformanceChart /></View>
      </ScrollView>
      <View style={sharedStyles.dots}>
        {[0, 1, 2].map((i) => <View key={i} style={[sharedStyles.dot, i === activeIndex && sharedStyles.dotActive]} />)}
      </View>
    </GlassCard>
  );
};

export const CHART_CAROUSEL_DEMO = {
  equityCurve: [10000, 9945, 9982, 9930, 10065, 9938, 9820, 9705, 9786, 10020, 10182, 10064],
};

export default function ChartCarouselDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <ChartCarousel data={CHART_CAROUSEL_DEMO} />
    </View>
  );
}
