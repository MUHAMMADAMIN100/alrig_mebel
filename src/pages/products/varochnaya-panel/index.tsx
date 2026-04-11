import { CategoryPage } from '../../../widgets/products/category-page';
import { getCategoryBySlug } from '../../../data/products';

export const VarochnayaPanelPage = () => {
  const category = getCategoryBySlug('varochnaya-panel')!;
  return <CategoryPage category={category} />;
};
