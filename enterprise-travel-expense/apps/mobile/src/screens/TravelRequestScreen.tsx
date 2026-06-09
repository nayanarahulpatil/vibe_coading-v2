import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme';

export default function TravelRequestScreen() {
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.colors.bgPrimary }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
          Fill out the form below to request travel approval.
        </Text>
        
        <Card style={{ marginBottom: theme.spacing.xl }}>
          <Input label="Departure City" placeholder="New York, NY" />
          <Input label="Destination City" placeholder="London, UK" />
          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <View style={{ flex: 1 }}><Input label="Departure Date" placeholder="YYYY-MM-DD" /></View>
            <View style={{ flex: 1 }}><Input label="Return Date" placeholder="YYYY-MM-DD" /></View>
          </View>
          <Input label="Business Purpose" placeholder="Q3 Sales Conference" />
          <Input label="Cost Center" placeholder="SALES-200" />
        </Card>

        <Button>Submit Request</Button>
        <Button variant="secondary" style={{ marginTop: theme.spacing.md }}>Save Draft</Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
