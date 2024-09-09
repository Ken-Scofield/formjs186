import { get } from 'min-dash';

import { useService, useVariables } from '../hooks';

import { FeelTemplatingEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';

const HTTPS_PATTERN = /^(https):\/\/*/i; // eslint-disable-line no-useless-escape

export function IFrameUrlEntry(props) {
  const { editField, field } = props;

  const entries = [];
  entries.push({
    id: 'url',
    component: Url,
    editField: editField,
    field: field,
    isEdited: isFeelEntryEdited,
    isDefaultVisible: (field) => field.type === 'iframe',
  });

  return entries;
}

function Url(props) {
  const { editField, field, id } = props;

  const debounce = useService('debounce');

  const variables = useVariables().map((name) => ({ name }));

  const path = ['url'];

  const getValue = () => {
    return get(field, path, '');
  };

  const setValue = (value) => {
    return editField(field, path, value);
  };

  return FeelTemplatingEntry({
    debounce,
    element: field,
    feel: 'optional',
    getValue,
    id,
    label: '网址',
    setValue,
    singleLine: true,
    tooltip: getTooltip(),
    validate,
    variables,
  });
}

// helper //////////////////////

function getTooltip() {
  return (
    <>
      <p>输入 HTTPS URL 到源，或通过模板或表达式动态填充（例如，从变量中传递值）。 变量）。</p>
      <p>请确保 URL 安全，因为它可能会带来安全风险。</p>
      <p>
        并非所有外部资源都能在 iFrame 中显示。请在{' '}
        <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options">
          X-FRAME-OPTIONS 文档
        </a>
        中了解更多信息.
      </p>
    </>
  );
}

/**
 * @param {string|void} value
 * @returns {string|null}
 */
const validate = (value) => {
  if (!value || value.startsWith('=')) {
    return;
  }

  if (!HTTPS_PATTERN.test(value)) {
    return '出于安全考虑，URL 必须以 "https "开头。';
  }
};
