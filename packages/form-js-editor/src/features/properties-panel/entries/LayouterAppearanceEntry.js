import { simpleSelectEntryFactory } from './factories';

export function LayouterAppearanceEntry(props) {
  const { field } = props;

  if (!['group', 'dynamiclist'].includes(field.type)) {
    return [];
  }

  const entries = [
    simpleSelectEntryFactory({
      id: 'verticalAlignment',
      path: ['verticalAlignment'],
      label: '垂直排列',
      optionsArray: [
        { value: 'start', label: '顶部对齐' },
        { value: 'center', label: '居中对齐' },
        { value: 'end', label: '底部对齐' },
      ],
      props,
    }),
  ];

  return entries;
}
