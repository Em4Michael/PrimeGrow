import Footer from '../../components/Footer';
import TopNavbar from '../../components/NavBarHome';
import Product from '../../components/Product';
import { Suspense } from 'react';
import Loading from '../../components/Loading';
const ProductPage: React.FC = () => { 
  return (
    <div>
      <TopNavbar />
      <Suspense fallback={<Loading />}>
        <Product />
      </Suspense>
      <Footer />
    </div>
  );
};

export default ProductPage;