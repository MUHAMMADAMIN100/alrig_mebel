import { CategoryPage } from '../../../widgets/products/category-page';
import { getCategoryBySlug } from '../../../data/products';

export const UtyugPage = () => {
  const category = getCategoryBySlug('utyug')!;
  return <CategoryPage category={category} />;
};
