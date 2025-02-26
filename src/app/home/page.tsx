'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '../../components/HeroHome';
import HomePage from '../../components/LandingPage';
import Footer from '../../components/Footer';
import TopNavbar from '../../components/NavBarHome';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = () => {
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
      } else if (user.role !== 'user') {
        router.push('/'); // Redirect non-superadmins
      }
    };
  
    if (user !== null) {
      checkUserRole(); // Only check if user is loaded
    }
  }, [user, router]);

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
