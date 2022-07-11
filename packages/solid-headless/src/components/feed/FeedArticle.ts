import {
  createComponent,
  createEffect,
  createSignal,
  createUniqueId,
  JSX,
  mergeProps,
  onCleanup,
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
  FeedArticleContext,
} from './FeedArticleContext';
import {
  useFeedContentContext,
} from './FeedContentContext';
import {
  useFeedContext,
} from './FeedContext';

export type FeedArticleProps<T extends ValidConstructor = 'article'> =
  HeadlessPropsWithRef<T, { index: number }>;

export function FeedArticle<T extends ValidConstructor = 'article'>(
  props: FeedArticleProps<T>,
): JSX.Element {
  const rootContext = useFeedContext('FeedArticle');
  const contentContext = useFeedContentContext('FeedArticle');

  const [internalRef, setInternalRef] = createSignal<DynamicNode<T>>();

  createEffect(() => {
    const ref = internalRef();
    if (ref instanceof HTMLElement) {
      const onKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'PageUp':
            contentContext.focusPrev(ref);
            break;
          case 'PageDown':
            contentContext.focusNext(ref);
            break;
          default:
            break;
        }
      };

      ref.addEventListener('keydown', onKeyDown);
      onCleanup(() => {
        ref.removeEventListener('keydown', onKeyDown);
      });
    }
  });

  const ownerID = createUniqueId();
  const labelID = createUniqueId();
  const descriptionID = createUniqueId();

  return createComponent(FeedArticleContext.Provider, {
    value: {
      ownerID,
      labelID,
      descriptionID,
    },
    get children() {
      return createDynamic(
        () => props.as ?? ('article' as T),
        mergeProps(
          omitProps(props, ['as']),
          {
            id: ownerID,
            'aria-labelledby': labelID,
            'aria-describedby': descriptionID,
            'data-sh-feed-article': rootContext.ownerID,
            tabindex: 0,
            get 'aria-posinset'() {
              return props.index + 1;
            },
            get 'aria-setsize'() {
              return rootContext.size;
            },
            ref: createRef<T>(props, (e) => {
              setInternalRef(() => e);
            }),
          },
        ) as DynamicProps<T>,
      );
    },
  });
}