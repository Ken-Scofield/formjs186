import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

export function ConditionEntry(props) {
  const { editField, field } = props;

  return [
    {
      id: 'conditional-hide',
      component: Condition,
      editField: editField,
      field: field,
      isEdited: isFeelEntryEdited,
    },
  ];
}

function Condition(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['conditional', 'hide'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    if (!value) {
      return editField(field, 'conditional', undefined);
    }

    return editField(field, 'conditional', { hide: value });
  };

  let label = '隐藏条件';
  let description = '隐藏字段的条件';

  // special case for expression fields which do not render
  if (field.type === 'expression') {
    label = '停用条件';
    description = '停用字段的条件';
  }

  return FeelEntry({
    debounce,
    description,
    element: field,
    feel: 'required',
    getValue,
    id,
    label,
    setValue,
    variables,
  });
}
