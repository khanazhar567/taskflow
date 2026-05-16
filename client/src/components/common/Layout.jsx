import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';

const Layout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 gap-3 flex-shrink-0">
        <NotificationBell />
      </header>
      <main className="flex-1 p-6 overflow-auto" id="main-content">
        {children}
      </main>
    </div>
  </div>
);

export default Layout;
