import hospitalConfig from '@/config/hospital.config.json';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 pt-16 pb-8">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">{hospitalConfig.name}</h3>
          <p className="text-sm text-slate-400">{hospitalConfig.tagline}</p>
          <div className="flex space-x-4">
            <a href={hospitalConfig.socialLinks.facebook} className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href={hospitalConfig.socialLinks.twitter} className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href={hospitalConfig.socialLinks.instagram} className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/departments" className="hover:text-primary">Departments</Link></li>
            <li><Link to="/doctors" className="hover:text-primary">Our Doctors</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Contact Info</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{hospitalConfig.address.street}, {hospitalConfig.address.city}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <span>{hospitalConfig.contact.phone}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>{hospitalConfig.contact.email}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Working Hours</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span>Mon - Fri</span>
              <span>{hospitalConfig.workingHours.weekdays}</span>
            </li>
            <li className="flex justify-between">
              <span>Sat</span>
              <span>{hospitalConfig.workingHours.saturday}</span>
            </li>
            <li className="flex justify-between text-secondary font-medium">
              <span>Sun</span>
              <span>{hospitalConfig.workingHours.sunday}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} {hospitalConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
