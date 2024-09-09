import { isString, get } from 'min-dash';

import { hasIntegerPathSegment, isProhibitedPath, isValidDotPath } from '../Util';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useCallback } from 'preact/hooks';

export function KeyEntry(props) {
  const { editField, field, getService } = props;

  const entries = [];

  entries.push({
    id: 'key',
    component: Key,
    editField: editField,
    field: field,
    isEdited: isTextFieldEntryEdited,
    isDefaultVisible: (field) => {
      const formFields = getService('formFields');
      const { config } = formFields.get(field.type);
      return config.keyed;
    },
  });

  return entries;
}

function Key(props) {
  const { editField, field, id } = props;

  const pathRegistry = useService('pathRegistry');

  const debounce = useService('debounce');

  const path = ['key'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    return editField(field, path, value);
  };

  const validate = useCallback(
    (value) => {
      if (value === field.key) {
        return null;
      }

      if (!isString(value) || value.length === 0) {
        return '不能为空';
      }

      if (!isValidDotPath(value)) {
        return '必须是变量或以点分隔的路径。';
      }

      if (hasIntegerPathSegment(value)) {
        return '不得包含数字路径段。';
      }

      if (isProhibitedPath(value)) {
        return '不得是禁行路径。';
      }

      const replacements = {
        [field.id]: value.split('.'),
      };

      const oldPath = pathRegistry.getValuePath(field);
      const newPath = pathRegistry.getValuePath(field, { replacements });

      // unclaim temporarily to avoid self-conflicts
      pathRegistry.unclaimPath(oldPath);
      const canClaim = pathRegistry.canClaimPath(newPath, { isClosed: true, claimerId: field.id });
      pathRegistry.claimPath(oldPath, { isClosed: true, claimerId: field.id });

      return canClaim ? null : '不得与其他键/路径分配冲突。';
    },
    [field, pathRegistry],
  );

  return TextFieldEntry({
    debounce,
    description: '绑定表单变量',
    element: field,
    getValue,
    id,
    label: '键',
    tooltip:
      '使用唯一的 "键 "来链接表单元素和相关的输入/输出数据。处理嵌套数据时，应在使用前在用户任务的输入映射中将其分解。',
    setValue,
    validate,
  });
}
