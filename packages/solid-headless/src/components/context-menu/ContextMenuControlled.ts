import {
  createComponent,
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
  ContextMenuContext,
} from './ContextMenuContext';
import { CONTEXT_MENU_TAG } from './tags';
import {
  ContextMenuBaseProps,
} from './types';

export type ContextMenuControlledBaseProps =
  & ContextMenuBaseProps
  & HeadlessDisclosureControlledOptions;

export type ContextMenuControlledProps<T extends ValidConstructor = 'div'> =
  HeadlessProps<T, ContextMenuControlledBaseProps>;

export function ContextMenuControlled<T extends ValidConstructor = 'div'>(
  props: ContextMenuControlledProps<T>,
): JSX.Element {
  const ownerID = createUniqueId();
  const boundaryID = createUniqueId();
  const panelID = createUniqueId();

  const fsp = useFocusStartPoint();

  return createComponent(ContextMenuContext.Provider, {
    value: {
      ownerID,
      boundaryID,
      panelID,
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
            'onOpen',
            'onClose',
          ]),
          CONTEXT_MENU_TAG,
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
