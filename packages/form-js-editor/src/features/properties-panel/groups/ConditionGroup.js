import { ConditionEntry } from '../entries';

export function ConditionGroup(field, editField) {
  const { type } = field;

  if (type === 'default') {
    return null;
  }

  const entries = [...ConditionEntry({ field, editField })];

  return {
    id: 'condition',
    label: '显示条件', // Condition
    entries,
  };
}
