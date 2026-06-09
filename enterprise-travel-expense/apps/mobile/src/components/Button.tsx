import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({ children, onPress, variant = 'primary', style }) => {
  if (variant === 'primary') {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={style}>
        <LinearGradient
          colors={[theme.colors.accentPrimary, theme.colors.accentSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, styles.primaryShadow]}
        >
          <Text style={styles.textPrimary}>{children}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const bgColors = {
    secondary: theme.colors.bgTertiary,
    danger: theme.colors.error,
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      style={[
        styles.button, 
        { backgroundColor: bgColors[variant] },
        variant === 'secondary' && { borderWidth: 1, borderColor: theme.colors.border },
        style
      ]}
    >
      <Text style={styles.textPrimary}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryShadow: {
    shadowColor: theme.colors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  }
});
