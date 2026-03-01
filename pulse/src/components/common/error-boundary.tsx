import { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Error boundary that catches render errors and shows a fallback UI */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary caught error', { error: error.message, errorInfo });
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={styles.container} accessibilityRole="alert">
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message ?? 'An unexpected error occurred'}
          </Text>
          <Button title="Try Again" onPress={this.handleRetry} variant="primary" />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING['2xl'],
  },
  title: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '600',
    color: COLORS.danger,
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: TYPOGRAPHY.body.fontSize,
    color: '#757575',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});
