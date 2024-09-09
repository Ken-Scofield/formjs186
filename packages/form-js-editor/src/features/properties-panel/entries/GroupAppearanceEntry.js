import { simpleBoolEntryFactory } from './factories';

export function GroupAppearanceEntry(props) {
  const { field } = props;

  const { type } = field;

  if (!['group', 'dynamiclist'].includes(type)) {
    return [];
  }

  const entries = [
    simpleBoolEntryFactory({
      id: 'showOutline',
      path: ['showOutline'],
      label: '显示轮廓',
      props,
    }),
  ];

  return entries;
}
