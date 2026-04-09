import { CategoryPage } from '../../../widgets/products/category-page';
import { getCategoryBySlug } from '../../../data/products';

export const MicrowavePage = () => {
  const category = getCategoryBySlug('microwave')!;
  return <CategoryPage category={category} />;
};
