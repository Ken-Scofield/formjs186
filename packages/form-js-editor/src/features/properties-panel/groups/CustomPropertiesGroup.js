import { ListGroup } from '@bpmn-io/properties-panel';

import { has } from 'min-dash';

import { CustomValueEntry } from '../entries';

export function CustomPropertiesGroup(field, editField) {
  const { properties = {}, type } = field;

  if (type === 'default') {
    return null;
  }

  const addEntry = (event) => {
    event.stopPropagation();

    let index = Object.keys(properties).length + 1;

    while (`key${index}` in properties) {
      index++;
    }

    editField(field, ['properties'], { ...properties, [`key${index}`]: 'value' });
  };

  const validateFactory = (key) => {
    return (value) => {
      if (value === key) {
        return;
      }

      if (typeof value !== 'string' || value.length === 0) {
        return 'Must not be empty.';
      }

      if (has(properties, value)) {
        return 'Must be unique.';
      }
    };
  };

  const items = Object.keys(properties).map((key, index) => {
    const removeEntry = (event) => {
      event.stopPropagation();

      return editField(field, ['properties'], removeKey(properties, key));
    };

    const id = `property-${index}`;

    return {
      autoFocusEntry: id + '-key',
      entries: CustomValueEntry({
        editField,
        field,
        idPrefix: id,
        index,
        validateFactory,
      }),
      id,
      label: key || '',
      remove: removeEntry,
    };
  });

  return {
    add: addEntry,
    component: ListGroup,
    id: 'custom-values',
    items,
    label: '自定义属性', // Custom properties
    tooltip: '直接在表单模式中添加属性，这对在自定义任务应用程序和表单呈现器中配置功能非常有用。',
    shouldSort: false,
  };
}

// helpers //////////

/**
 * Returns copy of object without key.
 *
 * @param {Object} properties
 * @param {string} oldKey
 *
 * @returns {Object}
 */
export function removeKey(properties, oldKey) {
  return Object.entries(properties).reduce((newProperties, entry) => {
    const [key, value] = entry;

    if (key === oldKey) {
      return newProperties;
    }

    return {
      ...newProperties,
      [key]: value,
    };
  }, {});
}
