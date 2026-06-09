import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme';

export default function ExpenseClaimScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={styles.subtitle}>Upload receipts for automated OCR extraction.</Text>

      <Card style={{ marginBottom: theme.spacing.xl }}>
        <Text style={styles.sectionTitle}>Receipt Capture</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.cameraZone}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>Tap to open camera</Text>
          <Text style={styles.cameraSubtext}>Or upload from gallery</Text>
        </TouchableOpacity>
      </Card>

      <Card style={{ marginBottom: theme.spacing.xl }}>
        <Text style={styles.sectionTitle}>Extracted Details</Text>
        <Input label="Merchant Name" placeholder="Will be auto-filled by OCR" />
        <Input label="Date" placeholder="YYYY-MM-DD" />
        <Input label="Total Amount" placeholder="0.00" keyboardType="decimal-pad" />
      </Card>

      <Button>Submit Claim</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bgPrimary },
  subtitle: { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.md },
  cameraZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  cameraIcon: { fontSize: 40, marginBottom: theme.spacing.sm },
  cameraText: { color: theme.colors.textPrimary, fontWeight: '500', fontSize: 16 },
  cameraSubtext: { color: theme.colors.textMuted, fontSize: 14, marginTop: theme.spacing.xs },
});
