import { Route, Routes } from "react-router-dom"
import Layout from "./shared/layout/Layout"
import { MainPage } from "./pages/main-page"
import { QueryClient, QueryClientProvider } from 'react-query';
import { ContactsPage } from "./pages/contacts-page";
import { ProductsPage } from "./pages/products";
import { CompanyPage } from "./pages/company-page";
import { WashingMachinePage } from "./pages/products/washing-machine";
import { MicrowavePage } from "./pages/products/microwave";
import { KholodilnikPage } from "./pages/products/kholodilnik";
import { DukhovkaPage } from "./pages/products/dukhovka";
import { UtyugPage } from "./pages/products/utyug";
import { ChaynikPage } from "./pages/products/chaynik";
import { TermosPage } from "./pages/products/termos";
import { VityazhkaPage } from "./pages/products/vityazhka";
import { VarochnayaPanelPage } from "./pages/products/varochnaya-panel";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<MainPage />} />
          <Route path='products' element={<ProductsPage />} />
          <Route path='products/washing-machine' element={<WashingMachinePage />} />
          <Route path='products/microwave' element={<MicrowavePage />} />
          <Route path='products/kholodilnik' element={<KholodilnikPage />} />
          <Route path='products/dukhovka' element={<DukhovkaPage />} />
          <Route path='products/utyug' element={<UtyugPage />} />
          <Route path='products/chaynik' element={<ChaynikPage />} />
          <Route path='products/termos' element={<TermosPage />} />
          <Route path='products/vityazhka' element={<VityazhkaPage />} />
          <Route path='products/varochnaya-panel' element={<VarochnayaPanelPage />} />
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
