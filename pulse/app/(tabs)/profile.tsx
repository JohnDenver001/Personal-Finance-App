import { View, Text, ScrollView, Pressable, Switch, StyleSheet, useColorScheme } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useAuthStore } from '@/stores/auth-store';
import { useBudgetStore } from '@/stores/budget-store';
import { useTransactionStore } from '@/stores/transaction-store';
import { COLORS } from '@/constants/colors';
import { SPACING, RADIUS } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';
import { PROGRESSION_LEVELS, FINANCIAL_FOCUS_OPTIONS } from '@/constants';
import type { Category } from '@/types';

/**
 * Profile screen  PRD: User info, preferences, category management,
 * progression levels, and settings.
 */
export default function ProfileScreen() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { monthlyIncome, monthlyBudgetLimit, setBudget } = useBudgetStore();
  const { categories, addCategory, deleteCategory } = useTransactionStore();

  const [editingIncome, setEditingIncome] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [incomeValue, setIncomeValue] = useState(monthlyIncome.toString());
  const [budgetValue, setBudgetValue] = useState(monthlyBudgetLimit.toString());
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const currency = user?.preferences.currency ?? 'USD';
  const focusOption = FINANCIAL_FOCUS_OPTIONS.find(
    (o) => o.value === user?.preferences.financial_focus,
  );

  // Determine current progression level (simplified)
  const currentLevel = PROGRESSION_LEVELS[0];

  const handleSaveIncome = useCallback(() => {
    const val = parseFloat(incomeValue);
    if (!isNaN(val) && val > 0) {
      setBudget(val, monthlyBudgetLimit);
      setEditingIncome(false);
    }
  }, [incomeValue, monthlyBudgetLimit, setBudget]);

  const handleSaveBudget = useCallback(() => {
    const val = parseFloat(budgetValue);
    if (!isNaN(val) && val > 0) {
      setBudget(monthlyIncome, val);
      setEditingBudget(false);
    }
  }, [budgetValue, monthlyIncome, setBudget]);

  const handleAddCategory = useCallback(() => {
    if (newCategoryName.trim()) {
      addCategory({
        id: 'cat-custom-' + Date.now(),
        user_id: user?.id ?? '',
        name: newCategoryName.trim(),
        monthly_budget_allocation: 0,
        icon: 'ellipsis-horizontal-outline',
        color: '#636E72',
      });
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  }, [newCategoryName, user?.id, addCategory]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>
          Profile
        </Text>

        {/* User Info */}
        <Card padding="base" style={styles.section}>
          <View style={styles.row}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.email, { color: themeColors.textPrimary }]}>
                {user?.email ?? 'user@example.com'}
              </Text>
              <Badge
                label={currentLevel?.name ?? 'Aware'}
                color={COLORS.primary}
              />
            </View>
          </View>
        </Card>

        {/* Financial Settings */}
        <Card padding="base" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
            Financial Settings
          </Text>

          {/* Monthly Income */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: themeColors.textSecondary }]}>
              Monthly Income
            </Text>
            {editingIncome ? (
              <View style={styles.editRow}>
                <View style={styles.editInput}>
                  <Input
                    value={incomeValue}
                    onChangeText={setIncomeValue}
                    keyboardType="decimal-pad"
                    autoFocus
                  />
                </View>
                <Button title="Save" onPress={handleSaveIncome} size="sm" />
              </View>
            ) : (
              <Pressable onPress={() => setEditingIncome(true)} style={styles.valueButton}>
                <Text style={[styles.settingValue, { color: themeColors.textPrimary }]}>
                  {formatCurrency(monthlyIncome, currency)}
                </Text>
                <Ionicons name="pencil-outline" size={16} color={themeColors.textSecondary} />
              </Pressable>
            )}
          </View>

          {/* Monthly Budget */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: themeColors.textSecondary }]}>
              Budget Limit
            </Text>
            {editingBudget ? (
              <View style={styles.editRow}>
                <View style={styles.editInput}>
                  <Input
                    value={budgetValue}
                    onChangeText={setBudgetValue}
                    keyboardType="decimal-pad"
                    autoFocus
                  />
                </View>
                <Button title="Save" onPress={handleSaveBudget} size="sm" />
              </View>
            ) : (
              <Pressable onPress={() => setEditingBudget(true)} style={styles.valueButton}>
                <Text style={[styles.settingValue, { color: themeColors.textPrimary }]}>
                  {formatCurrency(monthlyBudgetLimit, currency)}
                </Text>
                <Ionicons name="pencil-outline" size={16} color={themeColors.textSecondary} />
              </Pressable>
            )}
          </View>

          {/* Financial Focus */}
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: themeColors.textSecondary }]}>
              Financial Focus
            </Text>
            <Text style={[styles.settingValue, { color: themeColors.textPrimary }]}>
              {focusOption?.label ?? 'Balanced'}
            </Text>
          </View>
        </Card>

        {/* Categories */}
        <Card padding="base" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              Categories
            </Text>
            <Pressable
              onPress={() => setShowAddCategory(true)}
              accessibilityLabel="Add category"
              style={styles.addCategoryButton}
            >
              <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
            </Pressable>
          </View>
          {categories.map((cat: Category) => (
            <View key={cat.id} style={styles.categoryItem}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color ?? '#636E72' }]} />
              <Text style={[styles.categoryName, { color: themeColors.textPrimary }]}>
                {cat.name}
              </Text>
              <Text style={[styles.categoryBudget, { color: themeColors.textSecondary }]}>
                {formatCurrency(cat.monthly_budget_allocation, currency)}
              </Text>
              <Pressable
                onPress={() => deleteCategory(cat.id)}
                accessibilityLabel={'Delete ' + cat.name}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              </Pressable>
            </View>
          ))}
        </Card>

        {/* Logout */}
        <Button
          title="Sign Out"
          onPress={() => { void signOut(); }}
          variant="outline"
          fullWidth
        />
      </ScrollView>

      {/* Add Category Modal */}
      <Modal
        visible={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        title="Add Category"
      >
        <Input
          label="Category Name"
          placeholder="e.g. Groceries"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          autoFocus
        />
        <Button title="Add" onPress={handleAddCategory} fullWidth />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    padding: SPACING.base,
    gap: SPACING.base,
    paddingBottom: SPACING['4xl'],
  },
  title: {
    fontSize: TYPOGRAPHY.hero.fontSize,
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    gap: SPACING.sm,
  },
  email: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  settingRow: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  settingValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  valueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    minHeight: 44,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  editInput: {
    flex: 1,
  },
  addCategoryButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  categoryName: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  categoryBudget: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginRight: SPACING.sm,
  },
  deleteButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
