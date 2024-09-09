import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function ImageSourceEntry(props) {
  const { editField, field } = props;

  const entries = [];
  entries.push({
    id: 'source',
    component: Source,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'image',
  });

  return entries;
}

function Source(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['source'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    description: '表达式或静态值（链接/数据 URI）',
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: '图片来源',
    tooltip: '链接到托管图像，或直接使用数据 URI 将图像数据嵌入表单。',
    setValue,
    singleLine: true,
    variables,
  });
}
