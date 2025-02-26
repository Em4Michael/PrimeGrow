import Footer from '../../components/Footer';
import TopNavbar from '../../components/NavBarHome';
import Product from '../../components/Product';
import { Suspense } from 'react';

const ProductPage: React.FC = () => { 
  return (
    <div>
      <TopNavbar />
      <Suspense fallback={<div>Loading products...</div>}>
        <Product />
      </Suspense>
      <Footer />
    </div>
  );
};

export default ProductPage;