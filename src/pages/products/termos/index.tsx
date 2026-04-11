import { CategoryPage } from '../../../widgets/products/category-page';
import { getCategoryBySlug } from '../../../data/products';

export const TermosPage = () => {
  const category = getCategoryBySlug('termos')!;
  return <CategoryPage category={category} />;
};
