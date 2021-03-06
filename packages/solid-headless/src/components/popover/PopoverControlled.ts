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
  HeadlessDisclosureControlledOptions,
  HeadlessDisclosureRoot,
} from '../../headless/disclosure';
import createDynamic from '../../utils/create-dynamic';
import {
  DynamicProps,
  HeadlessProps,
  ValidConstructor,
} from '../../utils/dynamic-prop';
import {
  createDisabled,
} from '../../utils/state-props';
import useFocusStartPoint from '../../utils/use-focus-start-point';
import {
  PopoverContext,
} from './PopoverContext';
import { POPOVER_TAG } from './tags';
import {
  PopoverBaseProps,
} from './types';

export type PopoverControlledProps<T extends ValidConstructor = 'div'> =
  HeadlessProps<T, PopoverBaseProps & HeadlessDisclosureControlledOptions>;

export function PopoverControlled<T extends ValidConstructor = 'div'>(
  props: PopoverControlledProps<T>,
): JSX.Element {
  const [hovering, setHovering] = createSignal(false);
  const ownerID = createUniqueId();
  const buttonID = createUniqueId();
  const panelID = createUniqueId();

  const fsp = useFocusStartPoint();

  return createComponent(PopoverContext.Provider, {
    value: {
      ownerID,
      buttonID,
      panelID,
      get hovering() {
        return hovering();
      },
      set hovering(value: boolean) {
        setHovering(value);
      },
    },
    get children() {
      return createDynamic(
        () => props.as ?? ('div' as T),
        mergeProps(
          omitProps(props, [
            'isOpen',
            'as',
            'children',
            'disabled',
            'onChange',
          ]),
          POPOVER_TAG,
          createDisabled(() => props.disabled),
          {
            get children() {
              return createComponent(HeadlessDisclosureRoot, {
                get isOpen() {
                  return props.isOpen;
                },
                get disabled() {
                  return props.disabled;
                },
                onChange(value) {
                  if (value) {
                    fsp.save();
                    props.onOpen?.();
                  }
                  props.onChange?.(value);
                  if (!value) {
                    props.onClose?.();
                    fsp.load();
                  }
                },
                get children() {
                  return props.children;
                },
              });
            },
          },
        ) as DynamicProps<T>,
      );
    },
  });
}
