import { simpleBoolEntryFactory } from './factories';

export function SelectEntries(props) {
  const entries = [
    simpleBoolEntryFactory({
      id: 'searchable',
      path: ['searchable'],
      label: '可搜索',
      props,
      isDefaultVisible: (field) => field.type === 'select',
    }),
  ];

  return entries;
}
