import {
  createComponent,
  createSignal,
  createUniqueId,
  JSX,
  mergeProps,
} from 'solid-js';
import {
  omitProps,
} from 'solid-use';
import {
  HeadlessDisclosureRoot,
  HeadlessDisclosureControlledOptions,
} from '../../headless/disclosure';
import {
  HeadlessSelectRoot,
  HeadlessSelectRootProps,
  HeadlessSelectMultipleControlledOptions,
} from '../../headless/select';
import createDynamic from '../../utils/create-dynamic';
import {
  DynamicProps,
  HeadlessProps,
  ValidConstructor,
} from '../../utils/dynamic-prop';
import Fragment from '../../utils/Fragment';
import {
  createDisabled,
} from '../../utils/state-props';
import useFocusStartPoint from '../../utils/use-focus-start-point';
import {
  ListboxContext,
} from './ListboxContext';
import { LISTBOX_TAG } from './tags';
import {
  ListboxBaseProps,
  ListboxMultipleBaseProps,
} from './types';

// MCSCD = Multiple, Controlled Select, Controlled Disclosure

type ListboxMCSCDBaseProps<V> =
  & ListboxBaseProps
  & ListboxMultipleBaseProps<V>
  & Omit<HeadlessSelectMultipleControlledOptions<V>, 'onChange'>
  & Omit<HeadlessDisclosureControlledOptions, 'onChange'>
  & { children?: JSX.Element };

export type ListboxMCSCDProps<V, T extends ValidConstructor = typeof Fragment> =
  HeadlessProps<T, ListboxMCSCDBaseProps<V>>;

export function ListboxMCSCD<V, T extends ValidConstructor = typeof Fragment>(
  props: ListboxMCSCDProps<V, T>,
): JSX.Element {
  const [hovering, setHovering] = createSignal(false);
  const ownerID = createUniqueId();
  const labelID = createUniqueId();
  const buttonID = createUniqueId();
  const optionsID = createUniqueId();

  const fsp = useFocusStartPoint();

  return createComponent(ListboxContext.Provider, {
    value: {
      multiple: true,
      ownerID,
      labelID,
      buttonID,
      optionsID,
      get horizontal() {
        return props.horizontal;
      },
      get hovering() {
        return hovering();
      },
      set hovering(value: boolean) {
        setHovering(value);
      },
    },
    get children() {
      return createDynamic(
        () => props.as ?? (Fragment as T),
        mergeProps(
          omitProps(props, [
            'as',
            'children',
            'disabled',
            'horizontal',
            'isOpen',
            'multiple',
            'onDisclosureChange',
            'onSelectChange',
            'toggleable',
            'value',
          ]),
          LISTBOX_TAG,
          {
            'aria-labelledby': labelID,
          },
          createDisabled(() => props.disabled),
          {
            get children() {
              return createComponent(HeadlessSelectRoot, {
                multiple: true,
                onChange: props.onSelectChange,
                get toggleable() {
                  return props.toggleable;
                },
                get value() {
                  return props.value;
                },
                get disabled() {
                  return props.disabled;
                },
                get children() {
                  return createComponent(HeadlessDisclosureRoot, {
                    onChange(value) {
                      if (value) {
                        fsp.save();
                      }
                      props.onDisclosureChange?.(value);
                      if (!value) {
                        fsp.load();
                      }
                    },
                    get isOpen() {
                      return props.isOpen;
                    },
                    get disabled() {
                      return props.disabled;
                    },
                    get children() {
                      return props.children;
                    },
                  });
                },
              } as HeadlessSelectRootProps<V>);
            },
          },
        ) as DynamicProps<T>,
      );
    },
  });
}
