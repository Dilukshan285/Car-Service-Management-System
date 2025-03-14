import React from "react";
import { Link } from "react-router-dom";
import { FaCar, FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-blue-900 to-gray-600 text-white py-8 mt-10">
      <div className="container mx-auto px-4">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaCar className="mr-2" /> Revup
            </h3>
            <p className="text-sm">
              Revup is your trusted partner in car service and accessories. We provide top-notch maintenance and premium parts to keep your vehicle running smoothly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/accessories" className="hover:text-orange-400 transition-colors">Accessories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>123 Revup Lane, Auto City, AC 12345</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>support@revup.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                <FaFacebookF size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm">
          <p>© {new Date().getFullYear()} Revup. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/terms" className="hover:text-orange-400 transition-colors mr-4">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;