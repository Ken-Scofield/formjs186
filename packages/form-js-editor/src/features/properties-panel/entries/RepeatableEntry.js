import { simpleRangeIntegerEntryFactory, simpleBoolEntryFactory } from './factories';

export function RepeatableEntry(props) {
  const { field, getService } = props;

  const { type } = field;

  const formFieldDefinition = getService('formFields').get(type);

  if (!formFieldDefinition || !formFieldDefinition.config.repeatable) {
    return [];
  }

  const entries = [
    simpleRangeIntegerEntryFactory({
      id: 'defaultRepetitions',
      path: ['defaultRepetitions'],
      label: '默认项目数',
      min: 1,
      max: 20,
      props,
    }),
    simpleBoolEntryFactory({
      id: 'allowAddRemove',
      path: ['allowAddRemove'],
      label: '允许添加/删除项目',
      props,
    }),
    simpleBoolEntryFactory({
      id: 'disableCollapse',
      path: ['disableCollapse'],
      label: '禁用折叠',
      props,
    }),
  ];

  if (!field.disableCollapse) {
    const nonCollapseItemsEntry = simpleRangeIntegerEntryFactory({
      id: 'nonCollapsedItems',
      path: ['nonCollapsedItems'],
      label: '非重叠项目数',
      min: 1,
      defaultValue: 5,
      props,
    });

    entries.push(nonCollapseItemsEntry);
  }

  return entries;
}
