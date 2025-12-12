import { AIGenerateTypeEntry, AIPromptEntry, AIImageVerificationEntry } from '../entries/ai';

// Default supported field types
const DEFAULT_SUPPORTED_TYPES = ['textfield', 'textarea', 'number', 'image-upload'];

// AI Helper Group
export function AIHelperGroup(field, editField, getService) {
  const { type: fieldType, aiGenerateType = '' } = field;

  // Check if the field type is supported
  const isSupported = fieldType && DEFAULT_SUPPORTED_TYPES.includes(fieldType);

  if (!isSupported) {
    return null;
  }

  // Get entries
  const entries = [];

  // Add AI Generation Type entry (Suspend use here)
  // entries.push(...AIGenerateTypeEntry({ field, editField }));

  // Add prompt entry if AI generation is enabled
  if (aiGenerateType && aiGenerateType !== 'none') {
    entries.push(...AIPromptEntry({ field, editField }));
  }

  // Add AI Image Verification entry
  entries.push(...AIImageVerificationEntry({ field, editField, id: 'ai-image-verification' }));

  if (entries.length === 0) {
    return null;
  }

  return {
    id: 'ai-helper',
    label: 'AI 助手',
    entries,
  };
}

// Configuration function to customize supported types and options
AIHelperGroup.configure = (options = {}) => {
  if (options.supportedTypes) {
    DEFAULT_SUPPORTED_TYPES.length = 0;
    DEFAULT_SUPPORTED_TYPES.push(...options.supportedTypes);
  }

  // Configure the AIGenerateTypeEntry with custom options if provided
  if (options.generateTypeOptions) {
    AIGenerateTypeEntry.configure({ generateTypeOptions: options.generateTypeOptions });
  }
  return AIHelperGroup;
};
