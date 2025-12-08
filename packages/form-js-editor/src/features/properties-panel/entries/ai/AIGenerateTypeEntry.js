import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from '../../hooks';
import { get } from 'min-dash';

// Default options that can be overridden
const DEFAULT_GENERATE_TYPE_OPTIONS = [
  { value: 'none', label: '不生成' },
  { value: 'text', label: '文本生成' },
  { value: 'options', label: '选项生成' },
  { value: 'validation', label: '验证规则生成' },
];

/**
 * @typedef {Object} AIGenerateTypeEntryProps
 * @property {Object} field - The form field
 * @property {Function} editField - Function to edit the field
 * @property {() => Array<{value: string, label: string}>} [getOptions] - Function that returns the options
 */

/**
 * AI 生成类型选择
 * @param {AIGenerateTypeEntryProps} props
 */
export function AIGenerateTypeEntry(props) {
  const { editField, field, getOptions } = props;

  const entries = [
    {
      id: 'ai-generate-type',
      component: AIGenerateType,
      editField,
      field,
      getOptions: getOptions || (() => DEFAULT_GENERATE_TYPE_OPTIONS),
      isEdited: isSelectEntryEdited,
    },
  ];

  return entries;
}

function AIGenerateType(props) {
  const { field, editField, id, getOptions } = props;

  const debounce = useService('debounce');
  const path = ['aiGenerateType'];

  const getValue = () => {
    return get(field, path, 'none');
  };

  const setValue = (value) => {
    return editField(field, path, value || 'none');
  };

  return SelectEntry({
    debounce,
    element: field,
    id,
    label: 'AI 生成类型',
    getOptions,
    getValue,
    setValue,
    isEdited: props.isEdited,
  });
}

// Allow configuration of default options
AIGenerateTypeEntry.configure = (options = {}) => {
  if (options.generateTypeOptions) {
    DEFAULT_GENERATE_TYPE_OPTIONS.length = 0;
    DEFAULT_GENERATE_TYPE_OPTIONS.push(...options.generateTypeOptions);
  }
  return AIGenerateTypeEntry;
};

AIGenerateTypeEntry.isVisible = () => true;
