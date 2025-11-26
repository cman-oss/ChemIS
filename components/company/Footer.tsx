import React from 'react';
import { Link } from 'react-router-dom';
import { ChemIcon } from '../icons/ChemIcon';
import { TwitterIcon } from '../icons/TwitterIcon';
import { LinkedInIcon } from '../icons/LinkedInIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-deep-blue text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <ChemIcon className="w-8 h-8 text-white" />
              <span className="font-display font-bold text-2xl text-white">ChemXGen</span>
            </div>
            <p className="text-gray-400 pr-4">Reinventing Chemistry Through Intelligent Molecular AI.</p>
            <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white"><TwitterIcon className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><LinkedInIcon className="w-6 h-6" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-white tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/product" className="hover:text-white transition-colors">XGen AI</Link></li>
               <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
               <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
               <li><Link to="/contact" className="hover:text-white transition-colors">Request Demo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ChemXGen. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;