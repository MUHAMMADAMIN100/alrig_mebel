import { CategoryPage } from '../../../widgets/products/category-page';
import { getCategoryBySlug } from '../../../data/products';

export const ChaynikPage = () => {
  const category = getCategoryBySlug('chaynik')!;
  return <CategoryPage category={category} />;
};
