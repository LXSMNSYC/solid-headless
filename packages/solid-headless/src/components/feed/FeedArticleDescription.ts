import {
  JSX,
  mergeProps,
} from 'solid-js';
import {
  omitProps,
} from 'solid-use';
import createDynamic from '../../utils/create-dynamic';
import {
  DynamicProps,
  HeadlessProps,
  ValidConstructor,
} from '../../utils/dynamic-prop';
import {
  useFeedArticleContext,
} from './FeedArticleContext';
import { FEED_ARTICLE_DESCRIPTION_TAG } from './tags';

export type FeedArticleDescriptionProps<T extends ValidConstructor = 'p'> = HeadlessProps<T>;

export function FeedArticleDescription<T extends ValidConstructor = 'p'>(
  props: FeedArticleDescriptionProps<T>,
): JSX.Element {
  const context = useFeedArticleContext('FeedArticleDescription');
  return createDynamic(
    () => props.as ?? ('p' as T),
    mergeProps(
      omitProps(props, ['as']),
      FEED_ARTICLE_DESCRIPTION_TAG,
      {
        id: context.descriptionID,
      },
    ) as DynamicProps<T>,
  );
}
