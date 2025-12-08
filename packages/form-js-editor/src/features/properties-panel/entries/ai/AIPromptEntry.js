import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from '../../hooks';
import { get } from 'min-dash';

/**
 * @typedef {Object} AIPromptEntryProps
 * @property {Object} field - The form field
 * @property {Function} editField - Function to edit the field
 * @property {() => Array<any>} [getOptions] - Optional function that returns options
 */

/**
 * AI 提示词输入
 * @param {AIPromptEntryProps} props
 */
export function AIPromptEntry(props) {
  const { editField, field, getOptions } = props;

  const entries = [
    {
      id: 'ai-prompt',
      component: AIPrompt,
      editField,
      field,
      getOptions, // Accept but don't require getOptions
      isEdited: isTextFieldEntryEdited,
    },
  ];

  return entries;
}

function AIPrompt(props) {
  const { field, editField, id, getOptions } = props;

  const debounce = useService('debounce');
  const path = ['aiPrompt'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value || '');
  };

  return TextFieldEntry({
    debounce,
    element: field,
    id,
    label: 'AI 提示词',
    description: '输入提示词指导AI生成内容',
    getValue,
    setValue,
    isEdited: props.isEdited,
  });
}

// 只在启用了AI生成的字段上显示提示词
AIPromptEntry.isVisible = (field) => {
  return field && field.aiGenerateType && field.aiGenerateType !== 'none';
};
