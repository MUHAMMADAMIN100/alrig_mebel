import { Title } from "../../shared/ui/Title/indext"
import { Wrapper } from "../../shared/ui/Wrapper"
import { About } from "../../widgets/about"
// import { AboutInfo } from "../../widgets/about-info"
import { Banner } from "../../widgets/banner"
import { ContactsSection } from "../../widgets/contacts/ui/contacts-section"
// import { KraftBox } from "../../widgets/kraft_box"
import { ProductItems } from "../../widgets/products/product-items"
// import { Price } from "../../widgets/price"
// import { ServicesSection } from "../../widgets/services/ui/ServicesSection"
// import { Understanding } from "../../widgets/services/ui/Understanding"
// import { Team } from "../../widgets/team"

export const MainPage = () => {
    return <>
        <Banner />
        {/* <Understanding /> */}
        {/* <ServicesSection /> */}
        {/* <AboutInfo /> */}
        <Wrapper>
            <Title title='Столы'  />
            <ProductItems />
        </Wrapper>
        {/* <KraftBox /> */}
        {/* <Team /> */}
        {/* <Price /> */}
        <About />
        <ContactsSection />
    </>
}