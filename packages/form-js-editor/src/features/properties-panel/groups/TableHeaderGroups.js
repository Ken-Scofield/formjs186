import { get, isArray } from 'min-dash';

import { ColumnsExpressionEntry, HeadersSourceSelectEntry, StaticColumnsSourceEntry } from '../entries';

import { Group, ListGroup } from '@bpmn-io/properties-panel';

export function TableHeaderGroups(field, editField) {
  const { type, id: fieldId } = field;

  if (type !== 'table') {
    return [];
  }

  const areStaticColumnsEnabled = isArray(get(field, ['columns']));

  /**
   * @type {Array<Group>}
   */
  const groups = [
    {
      id: `${fieldId}-columnsSource`,
      label: '标题源',
      tooltip: TOOLTIP_TEXT,
      component: Group,
      entries: [...HeadersSourceSelectEntry({ field, editField }), ...ColumnsExpressionEntry({ field, editField })],
    },
  ];

  if (areStaticColumnsEnabled) {
    const id = `${fieldId}-columns`;

    groups.push({
      id,
      label: '标题项目',
      component: ListGroup,
      ...StaticColumnsSourceEntry({ field, editField, id }),
    });
  }

  return groups;
}

// helpers //////////

const TOOLTIP_TEXT = `"项目列表 "定义了一组恒定的、预定义的表单选项。

"表达式 "定义从 FEEL 表达式中填充的选项。
`;
