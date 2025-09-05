import { Outlet } from 'react-router';
import { Footer2 } from '~/features/home/components/footer-section';
import { Navbar } from '~/features/home/components/navbar';

export default function HomeLayout() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <Outlet />
      <Footer2 />
    </div>
  );
}
