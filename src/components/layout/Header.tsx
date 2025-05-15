import React, { useState, useEffect } from 'react';
import { Menu, X, Map, User, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Map className={`mr-2 ${isScrolled ? 'text-green-700' : 'text-green-600'}`} size={28} />
          <span className={`font-bold text-xl ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
            LandRise
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/search" isScrolled={isScrolled}>
            Find Land
          </NavLink>
          <NavLink to="/saved" isScrolled={isScrolled}>
            Saved Searches
          </NavLink>
          <NavLink to="/about" isScrolled={isScrolled}>
            About Us
          </NavLink>
          <button 
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Sign In
          </button>
        </nav>

        <button 
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
          ) : (
            <Menu size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-16">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
            <MobileNavLink to="/search" icon={<Search size={20} />}>
              Find Land
            </MobileNavLink>
            <MobileNavLink to="/saved" icon={<Map size={20} />}>
              Saved Searches
            </MobileNavLink>
            <MobileNavLink to="/about" icon={<User size={20} />}>
              About Us
            </MobileNavLink>
            <button 
              className="mt-4 w-full px-4 py-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors text-center"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isScrolled: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, isScrolled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`${
        isActive 
          ? 'font-semibold text-green-600' 
          : isScrolled 
            ? 'text-gray-700 hover:text-green-600' 
            : 'text-white hover:text-green-100'
      } transition-colors`}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`${
        isActive ? 'text-green-600 font-semibold' : 'text-gray-700'
      } flex items-center text-lg py-2`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  );
};

export default Header;