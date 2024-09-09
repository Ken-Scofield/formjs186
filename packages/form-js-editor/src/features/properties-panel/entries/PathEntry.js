import { get } from 'min-dash';

import { useService } from '../hooks';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import { isProhibitedPath, isValidDotPath, hasIntegerPathSegment } from '../Util';
import { useCallback } from 'preact/hooks';

export function PathEntry(props) {
  const { editField, field, getService } = props;

  const { type } = field;

  const entries = [];

  const formFieldDefinition = getService('formFields').get(type);

  if (formFieldDefinition && formFieldDefinition.config.pathed) {
    entries.push({
      id: 'path',
      component: Path,
      editField: editField,
      field: field,
      isEdited: isTextFieldEntryEdited,
    });
  }

  return entries;
}

function Path(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');
  const pathRegistry = useService('pathRegistry');
  const fieldConfig = useService('formFields').get(field.type).config;
  const isRepeating = fieldConfig.repeatable && field.isRepeating;

  const path = ['path'];

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
      if (!value && isRepeating) {
        return '不得为空！';
      }

      // Early return for empty value in non-repeating cases or if the field path hasn't changed
      if ((!value && !isRepeating) || value === field.path) {
        return null;
      }

      // Validate dot-separated path format
      if (!isValidDotPath(value)) {
        const msg = isRepeating ? '必须是变量或以点分隔的路径' : '必须为空、变量或以点分隔的路径';
        return msg;
      }

      // Check for integer segments in the path
      if (hasIntegerPathSegment(value)) {
        return '不得包含数字路径段。';
      }

      // Check for special prohibited paths
      if (isProhibitedPath(value)) {
        return '不得是禁行路径。';
      }

      // Check for path collisions
      const options = {
        replacements: {
          [field.id]: value.split('.'),
        },
      };

      const canClaim = pathRegistry.executeRecursivelyOnFields(field, ({ field, isClosed, isRepeatable }) => {
        const path = pathRegistry.getValuePath(field, options);
        return pathRegistry.canClaimPath(path, { isClosed, isRepeatable, claimerId: field.id });
      });

      if (!canClaim) {
        return '不得导致两条绑定路径冲突';
      }

      // If all checks pass
      return null;
    },
    [field, isRepeating, pathRegistry],
  );

  const tooltip = isRepeating
    ? '将该组件的子组件路由到表单变量中，也可以留空，以便在根层级路由。'
    : '将该组件的子代路由到表单变量中。';

  return TextFieldEntry({
    debounce,
    description: '该组件子变量的路径。',
    element: field,
    getValue,
    id,
    label: '路径',
    tooltip,
    setValue,
    validate,
  });
}
