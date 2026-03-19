import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuthStore } from '@/stores/authStore';
import hospitalConfig from '@/config/hospital.config.json';
import { Menu, User, Bell, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">{hospitalConfig.name}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/departments" className="hover:text-primary">Departments</Link>
          <Link to="/doctors" className="hover:text-primary">Doctors</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
              </Link>
              {user?.role === 'ADMIN' ? (
                <Link to="/admin"><Button variant="outline">Admin</Button></Link>
              ) : null}
              <Link to="/profile">
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/'); }}><LogOut className="h-5 w-5" /></Button>
            </div>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/register"><Button>Sign Up</Button></Link>
            </div>
          )}
          
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <Link to="/about" className="block text-sm font-medium">About</Link>
          <Link to="/departments" className="block text-sm font-medium">Departments</Link>
          <Link to="/doctors" className="block text-sm font-medium">Doctors</Link>
          <Link to="/contact" className="block text-sm font-medium">Contact</Link>
          {!isAuthenticated && (
            <div className="pt-4 space-y-2">
              <Link to="/login" className="block"><Button variant="outline" className="w-full">Login</Button></Link>
              <Link to="/register" className="block"><Button className="w-full">Sign Up</Button></Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
