import {
  createComponent,
  JSX,
} from 'solid-js';
import {
  ValidConstructor,
} from '../../utils/dynamic-prop';
import {
  AccordionMultipleControlled,
  AccordionMultipleControlledProps,
} from './AccordionMultipleControlled';
import {
  AccordionMultipleUncontrolled,
  AccordionMultipleUncontrolledProps,
} from './AccordionMultipleUncontrolled';
import {
  AccordionSingleControlled,
  AccordionSingleControlledProps,
} from './AccordionSingleControlled';
import {
  AccordionSingleUncontrolled,
  AccordionSingleUncontrolledProps,
} from './AccordionSingleUncontrolled';

export type AccordionProps<V, T extends ValidConstructor = 'div'> =
  | AccordionSingleControlledProps<V, T>
  | AccordionSingleUncontrolledProps<V, T>
  | AccordionMultipleControlledProps<V, T>
  | AccordionMultipleUncontrolledProps<V, T>;

function isAccordionUncontrolled<V, T extends ValidConstructor = 'div'>(
  props: AccordionProps<V, T>,
): props is AccordionSingleUncontrolledProps<V, T> | AccordionMultipleUncontrolledProps<V, T> {
  return 'defaultValue' in props;
}

function isAccordionMultiple<V, T extends ValidConstructor = 'div'>(
  props: AccordionProps<V, T>,
): props is AccordionMultipleUncontrolledProps<V, T> | AccordionMultipleControlledProps<V, T> {
  return 'multiple' in props && props.multiple;
}

export function Accordion<V, T extends ValidConstructor = 'div'>(
  props: AccordionProps<V, T>,
): JSX.Element {
  if (isAccordionUncontrolled(props)) {
    if (isAccordionMultiple(props)) {
      return createComponent(AccordionMultipleUncontrolled, props);
    }
    return createComponent(AccordionSingleUncontrolled, props);
  }
  if (isAccordionMultiple(props)) {
    return createComponent(AccordionMultipleControlled, props);
  }
  return createComponent(AccordionSingleControlled, props);
}
