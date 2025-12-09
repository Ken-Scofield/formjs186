import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from '../../hooks';
import { get } from 'min-dash';

const PATH = ['aiImageVerification'];

const VERIFICATION_TYPES = [
  { value: 'email', label: '邮箱' },
  { value: 'phone', label: '手机号' },
  { value: 'idcard', label: '身份证' },
  { value: 'custom', label: '自定义' },
];

export function AIImageVerificationToggle(props) {
  const { field, editField, id } = props;
  const debounce = useService('debounce');

  const getValue = () => {
    return get(field, [...PATH, 'enabled'], false) ? 'true' : 'false';
  };

  const setValue = (value) => {
    const current = get(field, PATH, {});
    const newValue = value === 'true';

    // Only update if the value actually changes
    if (newValue === current.enabled) {
      return;
    }

    const updates = {
      ...current,
      enabled: newValue,
    };

    if (newValue) {
      updates.sourceType = 'expression';
      updates.verificationType = VERIFICATION_TYPES[0].value;
      updates.value = '=';
    }

    editField(field, PATH, updates);
  };

  return SelectEntry({
    id,
    element: field,
    label: '开启AI图片验证',
    getValue,
    setValue,
    getOptions: () => [
      { value: 'true', label: '开启' },
      { value: 'false', label: '关闭' },
    ],
    debounce,
  });
}

function VerificationTypeSelect(props) {
  const { field, editField, id } = props;
  const debounce = useService('debounce');

  const getValue = () => {
    return get(field, [...PATH, 'verificationType'], VERIFICATION_TYPES[0].value);
  };

  const setValue = (value) => {
    const current = get(field, PATH, {});
    // Only update if the value actually changes
    if (value === current.verificationType) {
      return;
    }
    editField(field, PATH, {
      ...current,
      verificationType: value,
    });
  };

  return SelectEntry({
    id: `${id}-verification-type`,
    element: field,
    label: '验证类型',
    getValue,
    setValue,
    getOptions: () => VERIFICATION_TYPES,
    debounce,
  });
}

function SourceTypeSelect(props) {
  const { field, id } = props;
  const debounce = useService('debounce');

  return SelectEntry({
    id: `${id}-source-type`,
    element: field,
    label: '数据来源',
    getValue: () => 'expression',
    setValue: () => {}, // No-op since it's read-only
    getOptions: () => [{ value: 'expression', label: '表达式' }],
    debounce,
    disabled: true,
  });
}

function ValueInput(props) {
  const { field, editField, id } = props;
  const debounce = useService('debounce');

  const getValue = () => {
    return get(field, [...PATH, 'value'], '=');
  };

  const setValue = (value) => {
    const current = get(field, PATH, {});
    // Only update if the value actually changes
    if (value === current.value) {
      return;
    }
    editField(field, PATH, {
      ...current,
      value: value || '=',
    });
  };

  return {
    id: `${id}-value`,
    element: field,
    label: '表达式值',
    type: 'text',
    getValue,
    setValue,
    debounce,
    placeholder: '输入表达式，例如: =${someValue}',
    validate: (value) => {
      if (!value || value.trim() === '') {
        return '请输入表达式';
      }
      if (!value.startsWith('=')) {
        return '表达式应以 = 开头';
      }
      return null;
    },
  };
}

export function AIImageVerificationEntry(props) {
  const { field, editField, id } = props;
  const isEnabled = get(field, [...PATH, 'enabled'], false);

  const entries = [
    {
      id: `${id}-toggle`,
      component: AIImageVerificationToggle,
      field,
      editField,
      isEdited: isSelectEntryEdited,
    },
  ];

  if (isEnabled) {
    entries.push(
      {
        id: `${id}-verification-type`,
        component: VerificationTypeSelect,
        field,
        editField,
        isEdited: isSelectEntryEdited,
      },
      {
        id: `${id}-source-type`,
        component: SourceTypeSelect,
        field,
        editField,
        isEdited: isSelectEntryEdited,
      },
      {
        id: `${id}-value`,
        component: ValueInput,
        field,
        editField,
        isEdited: () => false,
      },
    );
  }

  return entries;
}
