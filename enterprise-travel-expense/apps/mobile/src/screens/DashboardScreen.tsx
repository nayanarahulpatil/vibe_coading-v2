import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../theme';

export default function DashboardScreen() {
  const dispatch = useDispatch();

  const kpis = [
    { label: 'Pending Approvals', value: '3', color: theme.colors.warning },
    { label: 'Total Expenses', value: '$4,250', color: theme.colors.accentPrimary },
    { label: 'Recent Trips', value: '2', color: theme.colors.success },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={styles.header}>Welcome, Demo User</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -theme.spacing.lg, paddingHorizontal: theme.spacing.lg }}>
        {kpis.map((kpi, index) => (
          <Card key={index} style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
            <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
          </Card>
        ))}
      </ScrollView>

      <Text style={[styles.header, { marginTop: theme.spacing.xl }]}>Recent Actions</Text>
      <Card style={{ marginBottom: theme.spacing.xl }}>
        <Text style={{ color: theme.colors.textSecondary }}>You're all caught up!</Text>
      </Card>

      <Button variant="danger" onPress={() => dispatch(logout())}>Logout</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgPrimary },
  header: { fontSize: 20, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.lg },
  kpiCard: { width: 160, marginRight: theme.spacing.md, marginBottom: theme.spacing.md },
  kpiLabel: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  kpiValue: { fontSize: 28, fontWeight: '700' },
});
