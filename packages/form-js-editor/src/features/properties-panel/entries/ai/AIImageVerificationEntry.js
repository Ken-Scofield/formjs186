import { SelectEntry, isSelectEntryEdited, FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from '../../hooks';
import { get } from 'min-dash';
import { FeelExpressionLanguage } from '@bpmn-io/form-js-viewer';

const PATH = ['aiImageVerification'];

const VERIFICATION_TYPES = [
  { value: 'kfjddz', label: '对中照' },
  { value: 'kfjdgh', label: '工号牌' },
  { value: 'kfjdhz', label: '回执单' },
  { value: 'kfjdtj', label: '台阶照' },
  { value: 'kfjdyd', label: '硬度照' },
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

    // Set default values when enabling
    if (newValue) {
      updates.sourceType = 'default';
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

  const expression = get(field, [...PATH, 'value'], '');
  // const verificationType = get(field, [...PATH, 'verificationType'], '');
  const sourceType = get(field, [...PATH, 'sourceType'], 'default');
  // Initialize the expression language
  const expressionLanguage = new FeelExpressionLanguage();
  // Get options based on the expression
  const getOptions = () => {
    if (sourceType === 'default') {
      return VERIFICATION_TYPES;
    }
    // If source is expression, evaluate it
    try {
      if (expression && expression.startsWith('=')) {
        // const expressionLanguage = new FeelExpressionLanguage();
        if (!expressionLanguage || !expressionLanguage.isExpression(expression)) {
          return [];
        }
        const evaluatedValue = expressionLanguage.evaluate(expression, {});

        if (Array.isArray(evaluatedValue)) {
          const vvvs = evaluatedValue.map((item) => ({
            value: item.value || '',
            label: item.label || '',
          }));
          return vvvs;
        }
        return [];
      }
    } catch (error) {
      console.error('Error evaluating expression:');
      return [];
    }

    // Fallback to default options if expression is invalid
    return VERIFICATION_TYPES;
  };

  const getValue = () => {
    return get(field, [...PATH, 'verificationType'], '');
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
    getOptions,
    debounce,
  });
}

const SOURCE_TYPES = [
  { value: 'default', label: '默认值' },
  { value: 'expression', label: '表达式' },
];

function SourceTypeSelect(props) {
  const { field, id, editField } = props;
  const debounce = useService('debounce');

  const getValue = () => get(field, [...PATH, 'sourceType'], 'default');

  const setValue = (value) => {
    const current = get(field, PATH, {});
    editField(field, PATH, {
      ...current,
      sourceType: value,
      // Reset value when switching source type
      value: value === 'default' ? '' : '=',
    });
  };

  return SelectEntry({
    id: `${id}-source-type`,
    element: field,
    label: '数据来源',
    getValue,
    setValue,
    getOptions: () => SOURCE_TYPES,
    debounce,
    disabled: false, // cancel disable
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

  return FeelEntry({
    id: `${id}-value`,
    element: field,
    label: '表达式值',
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
  });
}

export function AIImageVerificationEntry(props) {
  const { field, editField, id } = props;
  const isEnabled = get(field, [...PATH, 'enabled'], false);
  const sourceType = get(field, [...PATH, 'sourceType'], 'default');
  const entries = [
    {
      id: `${id}-toggle`,
      component: AIImageVerificationToggle,
      field,
      editField,
      isEdited: isSelectEntryEdited,
      isDefaultVisible: (field) => field.type === 'image-upload',
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
        isDefaultVisible: (field) => field.type === 'image-upload',
      },
      {
        id: `${id}-source-type`,
        component: SourceTypeSelect,
        field,
        editField,
        isEdited: isSelectEntryEdited,
        isDefaultVisible: (field) => field.type === 'image-upload',
      },
    );

    // Only show value input when source type is expression
    if (sourceType === 'expression') {
      entries.push({
        id: `${id}-value`,
        component: ValueInput,
        field,
        editField,
        isEdited: isFeelEntryEdited,
        isDefaultVisible: (field) => field.type === 'image-upload',
      });
    }
  }

  return entries;
}
