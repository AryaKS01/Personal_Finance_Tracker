import React from 'react';
import { Wallet2, Github, Twitter, Linkedin } from 'lucide-react';

const socialLinks = [
  {
    name: 'Twitter',
    href: '#',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: '#',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: Linkedin,
  },
];

const quickLinks = [
  { name: 'About', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Privacy', href: '#' },
  { name: 'Terms', href: '#' },
];

function Footer() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* This div ensures content takes up available space */}
      <div className="flex-grow"></div>

      <footer className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <div className="flex items-center space-x-3">
              <Wallet2 className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-semibold text-gray-900">FinanceFlow</span>
            </div>

            <nav className="mt-4 sm:mt-0">
              <ul className="flex space-x-6">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-between">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} FinanceFlow. All rights reserved.
            </p>

            <div className="mt-4 sm:mt-0 flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;



