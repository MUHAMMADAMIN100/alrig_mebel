import { CategoryPage } from '../../../widgets/products/category-page';
import { getCategoryBySlug } from '../../../data/products';

export const WashingMachinePage = () => {
  const category = getCategoryBySlug('washing-machine')!;
  return <CategoryPage category={category} />;
};
