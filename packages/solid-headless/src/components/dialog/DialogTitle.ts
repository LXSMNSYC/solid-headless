import {
  JSX,
  mergeProps,
} from 'solid-js';
import {
  omitProps,
} from 'solid-use';
import {
  HeadlessDisclosureChildProps,
  createHeadlessDisclosureChildProps,
} from '../../headless/disclosure';
import createDynamic from '../../utils/create-dynamic';
import {
  DynamicComponent,
  DynamicProps,
  ValidConstructor,
} from '../../utils/dynamic-prop';
import {
  OmitAndMerge,
} from '../../utils/types';
import {
  useDialogContext,
} from './DialogContext';
import { DIALOG_TITLE_TAG } from './tags';

export type DialogTitleProps<T extends ValidConstructor = 'h2'> =
  OmitAndMerge<DynamicComponent<T> & HeadlessDisclosureChildProps, DynamicProps<T>>;

export function DialogTitle<T extends ValidConstructor = 'h2'>(
  props: DialogTitleProps<T>,
): JSX.Element {
  const context = useDialogContext('DialogTitle');
  return createDynamic(
    () => props.as ?? ('h2' as T),
    mergeProps(
      omitProps(props, [
        'as',
        'children',
      ]),
      DIALOG_TITLE_TAG,
      {
        id: context.titleID,
      },
      createHeadlessDisclosureChildProps(props),
    ) as DynamicProps<T>,
  );
}
