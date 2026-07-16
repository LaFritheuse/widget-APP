import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { colors } from './shared/theme';
import { ToastProvider } from './shared/ToastProvider';

import WeekChartWidgetDemo from './widgets/WeekChartWidget';
import TradesTakenCardDemo from './widgets/TradesTakenCard';
import WinRateCardDemo from './widgets/WinRateCard';
import SymbolBreakdownCardDemo from './widgets/SymbolBreakdownCard';
import RecentSessionsHeaderCardDemo from './widgets/RecentSessionsHeaderCard';
import SessionRowDemo from './widgets/SessionRow';
import SelectSessionCardDemo from './widgets/SelectSessionCard';
import SessionHeaderCardDemo from './widgets/SessionHeaderCard';
import DescriptionCardDemo from './widgets/DescriptionCard';
import ChartCarouselDemo from './widgets/ChartCarousel';
import StatTilesRowDemo from './widgets/StatTilesRow';
import RecentTradesTableDemo from './widgets/RecentTradesTable';
import StrategyCardDemo from './widgets/StrategyCard';
import AddCardDemo from './widgets/AddCard';
import ChecklistCardDemo from './widgets/ChecklistCard';
import EditStrategyModalDemo from './widgets/EditStrategyModal';
import EditChecklistModalDemo from './widgets/EditChecklistModal';
import BottomTabBarDemo from './widgets/BottomTabBar';

/* ============================================================
   App.js = sélecteur de test. Choisis un widget dans la liste du
   haut, seul lui est monté et affiché en dessous — comme ça un bug
   sur un widget ne peut pas en affecter un autre pendant le test.
   Chaque widget vit dans son propre fichier sous /widgets, et
   partage la même logique de bouton/carte via /shared/UIKit.js.
   ============================================================ */

const WIDGETS = [
  { id: 'time-winrate', label: 'Time Invested / Win Rate', Comp: WeekChartWidgetDemo },
  { id: 'trades-taken', label: 'Trades Taken', Comp: TradesTakenCardDemo },
  { id: 'win-rate', label: 'Overall Win Rate', Comp: WinRateCardDemo },
  { id: 'symbols', label: 'Trades by Symbol', Comp: SymbolBreakdownCardDemo },
  { id: 'recent-sessions', label: 'Recent Sessions header', Comp: RecentSessionsHeaderCardDemo },
  { id: 'session-row', label: 'Session Row', Comp: SessionRowDemo },
  { id: 'select-session', label: 'Select Session', Comp: SelectSessionCardDemo },
  { id: 'session-header', label: 'Session Header', Comp: SessionHeaderCardDemo },
  { id: 'description', label: 'Description', Comp: DescriptionCardDemo },
  { id: 'carousel', label: 'Chart Carousel', Comp: ChartCarouselDemo },
  { id: 'stat-tiles', label: 'Stat Tiles', Comp: StatTilesRowDemo },
  { id: 'recent-trades', label: 'Recent Trades', Comp: RecentTradesTableDemo },
  { id: 'strategy', label: 'Strategy Card', Comp: StrategyCardDemo },
  { id: 'add-card', label: 'Add Card', Comp: AddCardDemo },
  { id: 'checklist', label: 'Checklist Card', Comp: ChecklistCardDemo },
  { id: 'edit-strategy', label: 'Edit Strategy Modal', Comp: EditStrategyModalDemo },
  { id: 'edit-checklist', label: 'Edit Checklist Modal', Comp: EditChecklistModalDemo },
  { id: 'tabbar', label: 'Bottom Tab Bar', Comp: BottomTabBarDemo },
];

function AppInner() {
  const [activeId, setActiveId] = useState(WIDGETS[0].id);
  const Active = WIDGETS.find((w) => w.id === activeId).Comp;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.picker} contentContainerStyle={{ gap: 8, paddingHorizontal: 12 }}>
        {WIDGETS.map((w) => (
          <Pressable key={w.id} onPress={() => setActiveId(w.id)} style={[styles.chip, activeId === w.id && styles.chipActive]}>
            <Text style={[styles.chipTxt, activeId === w.id && styles.chipTxtActive]}>{w.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={{ flex: 1 }}>
        <Active />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  picker: { flexGrow: 0, paddingTop: 18, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  chipActive: { backgroundColor: colors.silver1, borderColor: colors.silver1 },
  chipTxt: { color: colors.textDim, fontSize: 11.5, fontWeight: '700' },
  chipTxtActive: { color: '#0a0a0b' },
});
