import {
  OptionsSourceSelectEntry,
  StaticOptionsSourceEntry,
  InputKeyOptionsSourceEntry,
  OptionsExpressionEntry,
} from '../entries';

import { getOptionsSource, OPTIONS_SOURCES } from '@bpmn-io/form-js-viewer';

import { Group, ListGroup } from '@bpmn-io/properties-panel';

import { OPTIONS_INPUTS, hasOptionsGroupsConfigured } from '../Util';

export function OptionsGroups(field, editField, getService) {
  const { type } = field;

  const formFields = getService('formFields');

  const fieldDefinition = formFields.get(type).config;

  if (!OPTIONS_INPUTS.includes(type) && !hasOptionsGroupsConfigured(fieldDefinition)) {
    return [];
  }

  const context = { editField, field };
  const id = 'valuesSource';

  /**
   * @type {Array<Group|ListGroup>}
   */
  const groups = [
    {
      id,
      label: '选项来源',
      tooltip: getValuesTooltip(),
      component: Group,
      entries: OptionsSourceSelectEntry({ ...context, id }),
    },
  ];

  const valuesSource = getOptionsSource(field);

  if (valuesSource === OPTIONS_SOURCES.INPUT) {
    const id = 'dynamicOptions';
    groups.push({
      id,
      label: '动态选项',
      component: Group,
      entries: InputKeyOptionsSourceEntry({ ...context, id }),
    });
  } else if (valuesSource === OPTIONS_SOURCES.STATIC) {
    const id = 'staticOptions';
    groups.push({
      id,
      label: '静态选项',
      component: ListGroup,
      ...StaticOptionsSourceEntry({ ...context, id }),
    });
  } else if (valuesSource === OPTIONS_SOURCES.EXPRESSION) {
    const id = 'optionsExpression';
    groups.push({
      id,
      label: '选项表达式',
      component: Group,
      entries: OptionsExpressionEntry({ ...context, id }),
    });
  }

  return groups;
}

// helpers //////////

function getValuesTooltip() {
  return (
    '"静态 "定义了一组恒定的、预定义的表格选项 \n\n' +
    '"输入数据 "定义了动态填充的选项，根据可变数据进行调整，以灵活应对不同的条件或输入 \n\n' +
    '"表达式 "定义从 FEEL 表达式中填充的选项'
  );
}
