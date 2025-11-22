import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIChatWidget from '@/components/AIChatWidget';

export const metadata = {
  title: 'E-Shop',
  description: 'Modern E-Commerce Website built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ position: "relative" }}>
        <Header />
        <main>{children}</main>

        {/* Floating Chat widget visible on ALL pages */}
        <AIChatWidget />

        <Footer />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
