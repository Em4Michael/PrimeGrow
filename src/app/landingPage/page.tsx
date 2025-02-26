import Hero from '../../components/HeroLanding';
import HomePage from '../../components/HomePage';
import TopNavbar from '../../components/NavbarLanding';
import Footer from '../../components/Footer';

const Home: React.FC = () => {
  return (
    <div>
      <TopNavbar />
      <Hero />
      <HomePage />
      <Footer />
    </div>
  );
};

export default Home;
