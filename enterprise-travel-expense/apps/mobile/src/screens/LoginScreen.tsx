import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { theme } from '../theme';

export default function LoginScreen() {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bgPrimary }}>
      <LinearGradient
        colors={[theme.colors.bgPrimary, theme.colors.bgTertiary]}
        style={styles.container}
      >
        <View style={styles.topSection}>
          <Text style={styles.title}>Enterprise T&E</Text>
          <Text style={styles.subtitle}>Streamline your travel & expenses.</Text>
        </View>

        <View style={styles.formSection}>
          <Input label="Corporate Email" placeholder="name@enterprise.com" keyboardType="email-address" autoCapitalize="none" />
          <Button onPress={() => dispatch(login())} style={{ marginTop: theme.spacing.xl }}>
            Continue with SSO
          </Button>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: theme.spacing.xl },
  topSection: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 36, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  subtitle: { fontSize: 18, color: theme.colors.textSecondary },
  formSection: { paddingBottom: theme.spacing.xl },
});
