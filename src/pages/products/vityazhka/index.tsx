import { CategoryPage } from '../../../widgets/products/category-page';
import { getCategoryBySlug } from '../../../data/products';

export const VityazhkaPage = () => {
  const category = getCategoryBySlug('vityazhka')!;
  return <CategoryPage category={category} />;
};
