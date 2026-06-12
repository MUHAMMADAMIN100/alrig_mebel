import { Banner } from '../../widgets/banner';
import { Featured } from '../../widgets/featured';
import { About } from '../../widgets/about';
import { ContactsSection } from '../../widgets/contacts/ui/contacts-section';

export const MainPage = () => {
  return (
    <>
      <Banner />
      <Featured />
      <About />
      <ContactsSection />
    </>
  );
};
