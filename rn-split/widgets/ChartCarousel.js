import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G, Path, Polygon, Polyline, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { colors } from '../shared/theme';
import { GlassCard, sharedStyles } from '../shared/UIKit';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const EquityCurveChart = ({ points }) => {
  const pathLength = 700;
  const strokeOffset = useSharedValue(pathLength);
  useEffect(() => { strokeOffset.value = withDelay(200, withTiming(0, { duration: 1100, easing: Easing.out(Easing.cubic) })); }, [points]);
  const animatedLineProps = useAnimatedProps(() => ({ strokeDashoffset: strokeOffset.value }));
  const fillPoints = `${points} 300,110 0,110`;
  return (
    <Svg viewBox="0 0 300 110" preserveAspectRatio="none">
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

const MonthlyPerformanceChart = ({ data }) => {
  const rowH = 90 / data.length;
  return (
    <Svg viewBox="0 0 300 100">
      <Line x1="0" y1="50" x2="300" y2="50" stroke={colors.cardBorder} strokeWidth={1} strokeDasharray="4,4" />
      {data.map((m, i) => {
        const y = 6 + i * rowH;
        const lossW = Math.min(90, m.loss * 0.5);
        const gainW = Math.min(90, m.gain * 0.5);
        return (
          <G key={m.month}>
            <Rect x={150 - lossW} y={y} width={lossW} height={rowH - 8} rx={4} fill={colors.red} opacity={0.85} />
            <Rect x={150} y={y} width={gainW} height={rowH - 8} rx={4} fill={colors.green} opacity={0.85} />
            <SvgText x={4} y={y + (rowH - 8) / 2 + 4} fill={colors.textDim} fontSize="9">{m.month}</SvgText>
          </G>
        );
      })}
    </Svg>
  );
};

const DailyPerformanceChart = ({ data }) => {
  const max = Math.max(...data.map((d) => Math.abs(d.value)));
  const colW = 300 / data.length;
  return (
    <Svg viewBox="0 0 300 100">
      <Line x1="0" y1="50" x2="300" y2="50" stroke={colors.cardBorder} strokeWidth={1} strokeDasharray="4,4" />
      {data.map((d, i) => {
        const h = (Math.abs(d.value) / max) * 40;
        const x = i * colW + colW * 0.25;
        const w = colW * 0.5;
        const isUp = d.value >= 0;
        return <Rect key={d.day} x={x} y={isUp ? 50 - h : 50} width={w} height={h} rx={4} fill={isUp ? colors.green : colors.red} opacity={0.9} />;
      })}
    </Svg>
  );
};

/* data: { equityPoints: 'x,y x,y ...', monthly: [{month,gain,loss}], daily: [{day,value}] } */
export const ChartCarousel = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const labels = ['Equity Curve', 'Monthly Performance', 'Daily Performance'];
  const slideW = SCREEN_WIDTH - 64;

  return (
    <GlassCard delay={450}>
      <Text style={[sharedStyles.cardLabel, { marginBottom: 8 }]}>{labels[activeIndex]}</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / slideW))}
      >
        <View style={{ width: slideW, height: 110 }}><EquityCurveChart points={data.equityPoints} /></View>
        <View style={{ width: slideW, height: 110 }}><MonthlyPerformanceChart data={data.monthly} /></View>
        <View style={{ width: slideW, height: 110 }}><DailyPerformanceChart data={data.daily} /></View>
      </ScrollView>
      <View style={sharedStyles.dots}>
        {[0, 1, 2].map((i) => <View key={i} style={[sharedStyles.dot, i === activeIndex && sharedStyles.dotActive]} />)}
      </View>
    </GlassCard>
  );
};

export const CHART_CAROUSEL_DEMO = {
  equityPoints: '0,55 26,18 53,40 79,30 106,65 132,82 159,95 185,100 212,86 238,52 265,30 300,40',
  monthly: [{ month: 'Jan', gain: 400, loss: 600 }, { month: 'Feb', gain: 250, loss: 400 }, { month: 'Mar', gain: 400, loss: 200 }],
  daily: [{ day: 'Sun', value: 120 }, { day: 'Mon', value: -60 }, { day: 'Tue', value: -40 }, { day: 'Wed', value: 90 }, { day: 'Thu', value: -30 }, { day: 'Fri', value: 150 }],
};

export default function ChartCarouselDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingTop: 60 }}>
      <ChartCarousel data={CHART_CAROUSEL_DEMO} />
    </View>
  );
}
