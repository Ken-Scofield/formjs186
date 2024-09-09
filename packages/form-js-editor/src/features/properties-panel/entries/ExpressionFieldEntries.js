import { FeelEntry, isFeelEntryEdited, SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService, useVariables } from '../hooks';

export function ExpressionFieldEntries(props) {
  const { editField, field, id } = props;

  const entries = [];

  entries.push({
    id: `${id}-expression`,
    component: ExpressionFieldExpression,
    isEdited: isFeelEntryEdited,
    editField,
    field,
    isDefaultVisible: (field) => field.type === 'expression',
  });

  entries.push({
    id: `${id}-computeOn`,
    component: ExpressionFieldComputeOn,
    isEdited: isSelectEntryEdited,
    editField,
    field,
    isDefaultVisible: (field) => field.type === 'expression',
  });

  return entries;
}

function ExpressionFieldExpression(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');
  const variables = useVariables().map((name) => ({ name }));

  const getValue = () => field.expression || '';

  const setValue = (value) => {
    editField(field, ['expression'], value);
  };

  return FeelEntry({
    debounce,
    description: '定义一个表达式来计算该字段值',
    element: field,
    feel: 'required',
    getValue,
    id,
    label: '目标值',
    setValue,
    variables,
  });
}

function ExpressionFieldComputeOn(props) {
  const { editField, field, id } = props;

  const getValue = () => field.computeOn || '';

  const setValue = (value) => {
    editField(field, ['computeOn'], value);
  };

  const getOptions = () => [
    { value: 'change', label: '值变化' },
    { value: 'presubmit', label: '提交表单' },
  ];

  return SelectEntry({
    id,
    label: '计算时机',
    getValue,
    setValue,
    getOptions,
  });
}
