import { HeightEntry } from './HeightEntry';

export function IFrameHeightEntry(props) {
  return [
    ...HeightEntry({
      ...props,
      description: '容器的高度（像素px）',
      isDefaultVisible: (field) => field.type === 'iframe',
    }),
  ];
}
