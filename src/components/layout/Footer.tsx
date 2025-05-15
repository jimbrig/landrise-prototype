import React from 'react';
import { Map, Mail, Phone, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Map className="mr-2 text-green-500" size={24} />
              <span className="font-bold text-xl">LandRise</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering land buyers, developers, and investors to discover, analyze, and evaluate land opportunities.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Mail size={20} />} />
              <SocialIcon icon={<Phone size={20} />} />
              <SocialIcon icon={<Github size={20} />} />
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/search">Find Land</FooterLink>
              <FooterLink to="/saved">Saved Searches</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/guides">Land Buying Guides</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/glossary">Land Glossary</FooterLink>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/cookies">Cookie Policy</FooterLink>
              <FooterLink to="/disclaimer">Disclaimer</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} LandRise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-400 hover:text-green-500 transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
};

interface SocialIconProps {
  icon: React.ReactNode;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon }) => {
  return (
    <a 
      href="#" 
      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
    >
      {icon}
    </a>
  );
};

export default Footer;