import { get, isString } from 'min-dash';

import { hasIntegerPathSegment, isValidDotPath } from '../Util';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

export function TableDataSourceEntry(props) {
  const { editField, field } = props;

  const entries = [];
  entries.push({
    id: 'dataSource',
    component: Source,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'table',
  });

  return entries;
}

function Source(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['dataSource'];

  const getValue = () => {
    return get(field, path, field.id);
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    description: '指定填充表格的来源',
    element: field,
    feel: 'required',
    getValue,
    id,
    label: '数据源',
    tooltip:
      '输入包含表格数据的表单输入变量，或定义表达式以动态填充数据。',
    setValue,
    singleLine: true,
    variables,
    validate,
  });
}

// helper ////////////////

/**
 * @param {string|void} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (!isString(value) || value.length === 0) {
    return '不能是空！';
  }

  if (value.startsWith('=')) {
    return null;
  }

  if (!isValidDotPath(value)) {
    return '必须是变量或以点分隔的路径。';
  }

  if (hasIntegerPathSegment(value)) {
    return '不得包含数字路径段。';
  }

  return null;
};
