import React, { useState, useEffect } from 'react';
import { Menu, X, Map, User, Search, Sun, Moon, Calculator, LineChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Map className={`mr-2 ${isScrolled ? 'text-blue-600 dark:text-blue-400' : 'text-white'}`} size={28} />
          <span className={`font-bold text-xl ${
            isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'
          }`}>
            LandRise
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/parcels" isScrolled={isScrolled}>
            Find Parcels
          </NavLink>
          <NavLink to="/analysis" isScrolled={isScrolled}>
            Pro Forma
          </NavLink>
          <NavLink to="/insights" isScrolled={isScrolled}>
            Insights
          </NavLink>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${
              isScrolled 
                ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </nav>

        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={24} className={isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'} />
          ) : (
            <Menu size={24} className={isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-16">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
            <MobileNavLink to="/parcels" icon={<Search size={20} />}>
              Find Parcels
            </MobileNavLink>
            <MobileNavLink to="/analysis" icon={<Calculator size={20} />}>
              Pro Forma
            </MobileNavLink>
            <MobileNavLink to="/insights" icon={<LineChart size={20} />}>
              Insights
            </MobileNavLink>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center text-lg py-2 text-gray-700 dark:text-gray-300"
            >
              <span className="mr-3">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </span>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button 
              className="mt-4 w-full px-4 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center"
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
          ? 'font-semibold text-blue-600 dark:text-blue-400' 
          : isScrolled 
            ? 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400' 
            : 'text-white hover:text-blue-100'
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
        isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-300'
      } flex items-center text-lg py-2`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  );
};

export default Header;