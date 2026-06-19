import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../theme';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    name?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        const name = this.props.name || 'App';
        console.warn(`[ErrorBoundary:${name}]`, error.message, info.componentStack);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.icon}>♫</Text>
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.message}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Text>
                        <TouchableOpacity style={styles.retryBtn} onPress={this.handleRetry} activeOpacity={0.8}>
                            <Text style={styles.retryText}>TRY AGAIN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.void,
        justifyContent: 'center',
        alignItems: 'center',
        padding: THEME.spacing.xl,
    },
    content: {
        alignItems: 'center',
        maxWidth: 300,
    },
    icon: {
        fontSize: 48,
        color: THEME.colors.accentGold,
        marginBottom: THEME.spacing.lg,
        opacity: 0.6,
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        color: THEME.colors.white,
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: THEME.spacing.sm,
    },
    message: {
        fontSize: 13,
        color: THEME.colors.gray[400],
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: THEME.spacing.xl,
    },
    retryBtn: {
        backgroundColor: THEME.colors.accent,
        paddingHorizontal: THEME.spacing.xl,
        paddingVertical: THEME.spacing.md,
        borderRadius: THEME.borderRadius.lg,
    },
    retryText: {
        color: THEME.colors.white,
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 3,
    },
});
