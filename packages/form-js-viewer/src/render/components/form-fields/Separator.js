import { formFieldClasses } from '../Util';
import { Label } from '../Label';

const type = 'separator';

export function Separator(props) {
  const { field, domId } = props;
  const { label } = field;
  return (
    <div class={formFieldClasses(type)}>
      <Label htmlFor={domId} label={label} />
      {/* kim:*/}
      <hr />
    </div>
  );
}

Separator.config = {
  type,
  keyed: false,
  label: '分割线',
  group: 'presentation',
  propertiesPanelEntries: ['label'],
  create: (options = {}) => ({
    ...options,
  }),
};
