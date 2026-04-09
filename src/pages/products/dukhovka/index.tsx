import { CategoryPage } from '../../../widgets/products/category-page';
import { getCategoryBySlug } from '../../../data/products';

export const DukhovkaPage = () => {
  const category = getCategoryBySlug('dukhovka')!;
  return <CategoryPage category={category} />;
};
