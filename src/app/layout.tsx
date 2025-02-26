import { ReactNode } from 'react';
import '../styles/globals.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> 
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
