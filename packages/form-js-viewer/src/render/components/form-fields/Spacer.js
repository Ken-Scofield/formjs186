import { formFieldClasses } from '../Util';

const type = 'spacer';

export function Spacer(props) {
  const { field } = props;
  const { height = 60 } = field;

  return <div class={formFieldClasses(type)} style={{ height: height }} />;
}

Spacer.config = {
  type,
  keyed: false,
  label: '间隔',
  group: 'presentation',
  create: (options = {}) => ({
    height: 60,
    ...options,
  }),
};
