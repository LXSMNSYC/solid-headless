import {
  createSignal,
  createEffect,
  onCleanup,
  JSX,
  createComponent,
  mergeProps,
} from 'solid-js';
import {
  omitProps,
} from 'solid-use';
import createDynamic from '../../utils/create-dynamic';
import {
  createRef,
  DynamicNode,
  DynamicProps,
  HeadlessPropsWithRef,
  ValidConstructor,
} from '../../utils/dynamic-prop';
import {
  createFeedArticleFocusNavigator,
  FeedContentContext,
} from './FeedContentContext';
import {
  useFeedContext,
} from './FeedContext';
import { FEED_CONTENT_TAG } from './tags';

export type FeedContentProps<T extends ValidConstructor = 'div'> = HeadlessPropsWithRef<T>;

export function FeedContent<T extends ValidConstructor = 'div'>(
  props: FeedContentProps<T>,
): JSX.Element {
  const context = useFeedContext('FeedContent');
  const controller = createFeedArticleFocusNavigator(context.ownerID);

  const [internalRef, setInternalRef] = createSignal<DynamicNode<T>>();

  createEffect(() => {
    const ref = internalRef();
    if (ref instanceof HTMLElement) {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey) {
          switch (e.key) {
            case 'Home':
              context.focusPrev();
              break;
            case 'End':
              context.focusNext();
              break;
            default:
              break;
          }
        }
      };

      ref.addEventListener('keydown', onKeyDown);
      onCleanup(() => {
        ref.removeEventListener('keydown', onKeyDown);
      });
    }
  });

  return createComponent(FeedContentContext.Provider, {
    value: controller,
    get children() {
      return createDynamic(
        () => props.as ?? ('div' as T),
        mergeProps(
          omitProps(props, ['as']),
          FEED_CONTENT_TAG,
          {
            id: context.contentID,
            role: 'feed',
            'aria-labelledby': context.labelID,
            get 'aria-busy'() {
              return context.busy;
            },
            ref: createRef<T>(props, (e) => {
              setInternalRef(() => e);
              controller.setRef(e);
            }),
          },
        ) as DynamicProps<T>,
      );
    },
  });
}
