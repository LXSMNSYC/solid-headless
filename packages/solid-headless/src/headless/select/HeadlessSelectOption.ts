import {
  createComponent,
  createMemo,
  JSX,
} from 'solid-js';
import {
  HeadlessSelectOptionContext,
  HeadlessSelectOptionProperties,
  useHeadlessSelectOption,
  useHeadlessSelectOptionProperties,
} from './useHeadlessSelectOption';

export type HeadlessSelectOptionRenderProp = (
  (properties: HeadlessSelectOptionProperties) => JSX.Element
);

function isHeadlessSelectOptionRenderProp(
  children: JSX.Element | HeadlessSelectOptionRenderProp,
): children is HeadlessSelectOptionRenderProp {
  return typeof children === 'function' && children.length > 0;
}

export interface HeadlessSelectOptionProps<T> {
  value: T;
  disabled?: boolean,
  children?: JSX.Element | HeadlessSelectOptionRenderProp;
}

export function HeadlessSelectOption<T>(
  props: HeadlessSelectOptionProps<T>,
): JSX.Element {
  const properties = useHeadlessSelectOption(
    () => props.value,
    () => !!props.disabled,
  );
  return (
    createComponent(HeadlessSelectOptionContext.Provider, {
      value: properties,
      get children() {
        return createMemo(() => {
          const body = props.children;
          if (isHeadlessSelectOptionRenderProp(body)) {
            return body(properties);
          }
          return body;
        });
      },
    })
  );
}

export function createHeadlessSelectOptionProps<T>(
  props: HeadlessSelectOptionProps<T>,
): { children?: JSX.Element | HeadlessSelectOptionRenderProp } {
  return {
    get children() {
      return createComponent(HeadlessSelectOption, {
        get value() {
          return props.value;
        },
        get disabled() {
          return props.disabled;
        },
        get children() {
          return props.children;
        },
      });
    },
  };
}

export interface HeadlessSelectOptionChildProps {
  children?: JSX.Element | HeadlessSelectOptionRenderProp;
}

export function HeadlessSelectOptionChild(
  props: HeadlessSelectOptionChildProps,
): JSX.Element {
  const properties = useHeadlessSelectOptionProperties();
  return createMemo(() => {
    const body = props.children;
    if (isHeadlessSelectOptionRenderProp(body)) {
      return body(properties);
    }
    return body;
  });
}

export function createHeadlessSelectOptionChildProps(
  props: HeadlessSelectOptionChildProps,
): HeadlessSelectOptionChildProps {
  return {
    get children() {
      return createComponent(HeadlessSelectOptionChild, {
        get children() {
          return props.children;
        },
      });
    },
  };
}
