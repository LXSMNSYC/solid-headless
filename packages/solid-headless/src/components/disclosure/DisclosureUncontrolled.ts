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
  HeadlessDisclosureRootChildren,
  HeadlessDisclosureRootProps,
  HeadlessDisclosureUncontrolledOptions,
} from '../../headless/disclosure';
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
import {
  DisclosureContext,
} from './DisclosureContext';
import { DISCLOSURE_TAG } from './tags';

type DisclosureUncontrolledBaseProps =
  & HeadlessDisclosureUncontrolledOptions
  & HeadlessDisclosureRootChildren;

export type DisclosureUncontrolledProps<T extends ValidConstructor = typeof Fragment> =
  HeadlessProps<T, DisclosureUncontrolledBaseProps>;

export function DisclosureUncontrolled<T extends ValidConstructor = typeof Fragment>(
  props: DisclosureUncontrolledProps<T>,
): JSX.Element {
  const ownerID = createUniqueId();
  const buttonID = createUniqueId();
  const panelID = createUniqueId();

  return createComponent(DisclosureContext.Provider, {
    value: {
      ownerID,
      buttonID,
      panelID,
    },
    get children() {
      return createDynamic(
        () => props.as ?? (Fragment as T),
        mergeProps(
          omitProps(props, [
            'defaultOpen',
            'as',
            'children',
            'disabled',
            'onChange',
          ]),
          DISCLOSURE_TAG,
          createDisabled(() => props.disabled),
          {
            get children() {
              return createComponent(HeadlessDisclosureRoot, {
                get defaultOpen() {
                  return props.defaultOpen;
                },
                get disabled() {
                  return props.disabled;
                },
                get children() {
                  return props.children;
                },
                onChange: props.onChange,
              } as HeadlessDisclosureRootProps);
            },
          },
        ) as DynamicProps<T>,
      );
    },
  });
}
