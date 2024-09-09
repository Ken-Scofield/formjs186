import { get, set } from 'min-dash';

import {
  CheckboxEntry,
  isCheckboxEntryEdited,
  isFeelEntryEdited,
  FeelNumberEntry,
  isTextFieldEntryEdited,
  TextFieldEntry,
  SelectEntry,
} from '@bpmn-io/properties-panel';

import { useService, useVariables } from '../hooks';

import { INPUTS } from '../Util';

const VALIDATION_TYPE_OPTIONS = {
  custom: {
    value: '',
    label: '自定义',
  },
  email: {
    value: 'email',
    label: '邮件',
  },
  phone: {
    value: 'phone',
    label: '手机',
  },
};

export function ValidationGroup(field, editField) {
  const { type } = field;
  const validate = get(field, ['validate'], {});
  const isCustomValidation = [undefined, VALIDATION_TYPE_OPTIONS.custom.value].includes(validate.validationType);

  const onChange = (key) => {
    return (value) => {
      const validate = get(field, ['validate'], {});

      editField(field, ['validate'], set(validate, [key], value));
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, ['validate', key]);
    };
  };

  let entries = [
    {
      id: 'required',
      component: Required,
      getValue,
      field,
      isEdited: isCheckboxEntryEdited,
      onChange,
      isDefaultVisible: (field) => INPUTS.includes(field.type),
    },
  ];

  entries.push({
    id: 'validationType',
    component: ValidationType,
    getValue,
    field,
    editField,
    isEdited: isTextFieldEntryEdited,
    onChange,
    isDefaultVisible: (field) => field.type === 'textfield',
  });

  entries.push(
    {
      id: 'minLength',
      component: MinLength,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) =>
        INPUTS.includes(field.type) && (type === 'textarea' || (type === 'textfield' && isCustomValidation)),
    },
    {
      id: 'maxLength',
      component: MaxLength,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) =>
        INPUTS.includes(field.type) && (type === 'textarea' || (type === 'textfield' && isCustomValidation)),
    },
  );

  entries.push({
    id: 'pattern',
    component: Pattern,
    getValue,
    field,
    isEdited: isTextFieldEntryEdited,
    onChange,
    isDefaultVisible: (field) => INPUTS.includes(field.type) && type === 'textfield' && isCustomValidation,
  });

  entries.push(
    {
      id: 'min',
      component: Min,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) => field.type === 'number',
    },
    {
      id: 'max',
      component: Max,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
      isDefaultVisible: (field) => field.type === 'number',
    },
  );

  return {
    id: 'validation',
    label: '验证',
    entries,
  };
}

function Required(props) {
  const { field, getValue, id, onChange } = props;

  return CheckboxEntry({
    element: field,
    getValue: getValue('required'),
    id,
    label: '必须',
    setValue: onChange('required'),
  });
}

function MinLength(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue: getValue('minLength'),
    id,
    label: '最小长度',
    min: 0,
    setValue: onChange('minLength'),
    variables,
  });
}

function MaxLength(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue: getValue('maxLength'),
    id,
    label: '最大长度',
    min: 0,
    setValue: onChange('maxLength'),
    variables,
  });
}

function Pattern(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  return TextFieldEntry({
    debounce,
    element: field,
    getValue: getValue('pattern'),
    id,
    label: '自定义正则表达式',
    setValue: onChange('pattern'),
  });
}

function Min(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    id,
    label: '最小值',
    step: 'any',
    getValue: getValue('min'),
    setValue: onChange('min'),
    variables,
  });
}

function Max(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  return FeelNumberEntry({
    debounce,
    element: field,
    feel: 'optional',
    id,
    label: '最大值',
    step: 'any',
    getValue: getValue('max'),
    setValue: onChange('max'),
    variables,
  });
}

function ValidationType(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = useService('debounce');

  const setValue = (validationType) => {
    onChange('validationType')(validationType || undefined);
  };

  return SelectEntry({
    debounce,
    element: field,
    getValue: getValue('validationType'),
    id,
    label: '验证模式',
    setValue,
    getOptions: () => Object.values(VALIDATION_TYPE_OPTIONS),
    tooltip:
      getValue('validationType')() === VALIDATION_TYPE_OPTIONS.phone.value
        ? '内置电话验证模式基于 E.164 标准，不含空格。例如：+491234567890'
        : undefined,
  });
}
