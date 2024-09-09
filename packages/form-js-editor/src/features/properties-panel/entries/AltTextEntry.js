import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function AltTextEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'alt',
    component: AltText,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => ['image'].includes(field.type),
  });

  return entries;
}

function AltText(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['alt'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: '备选案文',
    tooltip: '用于屏幕阅读器无障碍访问的描述性文本。',
    setValue,
    singleLine: true,
    variables,
  });
}
