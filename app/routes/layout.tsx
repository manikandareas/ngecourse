import { Outlet } from 'react-router';
import { Navbar } from '~/features/home/components/navbar';
import { AppFooter } from '~/features/shared/components/footer';

export default function HomeLayout() {
  return (
    <div className="relative">
      <Navbar />
      <Outlet />
      <AppFooter />
    </div>
  );
}
