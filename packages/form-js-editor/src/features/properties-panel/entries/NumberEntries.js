import {
  NumberFieldEntry,
  isNumberFieldEntryEdited,
  TextFieldEntry,
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';
import { get } from 'min-dash';
import { useService } from '../hooks';
import { countDecimals, isValidNumber } from '../Util';

import Big from 'big.js';
import { useCallback } from 'preact/hooks';

export function NumberEntries(props) {
  const { editField, field, id } = props;

  const entries = [];

  entries.push({
    id: id + '-decimalDigits',
    component: NumberDecimalDigits,
    isEdited: isNumberFieldEntryEdited,
    editField,
    field,
    isDefaultVisible: (field) => field.type === 'number',
  });

  entries.push({
    id: id + '-step',
    component: NumberArrowStep,
    isEdited: isTextFieldEntryEdited,
    editField,
    field,
    isDefaultVisible: (field) => field.type === 'number',
  });

  return entries;
}

function NumberDecimalDigits(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const getValue = (e) => get(field, ['decimalDigits']);

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, ['decimalDigits'], value);
  };

  return NumberFieldEntry({
    debounce,
    label: '小数位数',
    element: field,
    step: 'any',
    getValue,
    id,
    setValue,
    validate: validateNumberEntries,
  });
}

function NumberArrowStep(props) {
  const { editField, field, id } = props;

  const { decimalDigits } = field;

  const debounce = useService('debounce');

  const getValue = (e) => {
    let value = get(field, ['increment']);

    if (!isValidNumber(value)) return null;

    return value;
  };

  const clearLeadingZeroes = (value) => {
    if (!value) return value;
    const trimmed = value.replace(/^0+/g, '');
    return (trimmed.startsWith('.') ? '0' : '') + trimmed;
  };

  const setValue = (value, error) => {
    if (error) {
      return;
    }

    editField(field, ['increment'], clearLeadingZeroes(value));
  };

  const decimalDigitsSet = decimalDigits || decimalDigits === 0;

  const validate = useCallback(
    (value) => {
      if (value === undefined || value === null) {
        return;
      }

      if (!isValidNumber(value)) {
        return '应为有效数字！';
      }

      if (Big(value).cmp(0) <= 0) {
        return '应大于零！';
      }

      if (decimalDigitsSet) {
        const minimumValue = Big(`1e-${decimalDigits}`);

        if (Big(value).cmp(minimumValue) < 0) {
          return `至少应为 ${minimumValue.toString()}.`;
        }

        if (countDecimals(value) > decimalDigits) {
          return `不应包含超过 ${decimalDigits} 小数位！`;
        }
      }
    },
    [decimalDigitsSet, decimalDigits],
  );

  return TextFieldEntry({
    debounce,
    label: '增量',
    element: field,
    getValue,
    id,
    setValue,
    validate,
  });
}

// helpers //////////

/**
 * @param {number|void} value
 * @returns {string|void}
 */
const validateNumberEntries = (value) => {
  if (typeof value !== 'number') {
    return;
  }

  if (!Number.isInteger(value)) {
    return '应为一个整数！';
  }

  if (value < 0) {
    return '应大于或等于零！';
  }
};
