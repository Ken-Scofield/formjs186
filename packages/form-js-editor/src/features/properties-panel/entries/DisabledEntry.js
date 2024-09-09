import { get } from 'min-dash';

import { INPUTS } from '../Util';

import { ToggleSwitchEntry, isToggleSwitchEntryEdited } from '@bpmn-io/properties-panel';

export function DisabledEntry(props) {
  const { editField, field } = props;

  const entries = [];

  entries.push({
    id: 'disabled',
    component: Disabled,
    editField: editField,
    field: field,
    isEdited: isToggleSwitchEntryEdited,
    isDefaultVisible: (field) => INPUTS.includes(field.type),
  });

  return entries;
}

function Disabled(props) {
  const { editField, field, id } = props;

  const path = ['disabled'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return ToggleSwitchEntry({
    element: field,
    getValue,
    id,
    label: '禁用',
    tooltip: '最终用户无法编辑字段，也不会提交数据。优先于只读。',
    inline: true,
    setValue,
  });
}
