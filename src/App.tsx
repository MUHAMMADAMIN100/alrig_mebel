import { Route, Routes } from "react-router-dom"
import Layout from "./shared/layout/Layout"
import { MainPage } from "./pages/main-page"
// import { ProjectsPage } from "./pages/projects-page"
// import { ContactsPage } from "./pages/contacts-page"
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
// import { CompanyPage } from "./pages/company-page";
import { ContactsPage } from "./pages/contacts-page";
import { ProductsPage } from "./pages/products";
import { CompanyPage } from "./pages/company-page";
import { LoftL120Page } from "./pages/products/loft-120";
import { LoftT45Page } from "./pages/products/loft-t-45";
import { LoftR80Page } from "./pages/products/loft-r-80";
import { LoftK120Page } from "./pages/products/loft-k-120";
// import { ServicesPage } from "./pages/services-page"

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes> 
        <Route path="/" element={<Layout />} >
          <Route index element={<MainPage />} />
          {/* <Route path='company' element={<CompanyPage />} /> */}
          <Route path='products' element={<ProductsPage />} />
          <Route path='products/loft-120' element={<LoftL120Page />} />
          <Route path='products/loft-k-120' element={<LoftK120Page />} />
          <Route path='products/loft-r-80' element={<LoftR80Page />} />
          <Route path='products/loft-t-45' element={<LoftT45Page />} />
          {/* <Route path='projects' element={<ProjectsPage />} /> */}
          <Route path='custom-order' element={<CompanyPage />} /> 
          <Route path='contacts' element={<ContactsPage />} /> 
        </Route>
      </Routes>
      <div id="modal" />
      <div id="modal-root" />
    </QueryClientProvider>
  )
}

export default App
