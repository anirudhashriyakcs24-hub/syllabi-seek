import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-serif text-xl font-bold">LearnHub</span>
            </div>
            <p className="text-primary-foreground/80 max-w-md">
              Your comprehensive learning platform for Physics, Chemistry, and Mathematics. 
              Master concepts with video lectures and practice tests.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/subjects" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  All Subjects
                </Link>
              </li>
              <li>
                <Link to="/tests" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Practice Tests
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                support@learnhub.edu
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>© 2024 LearnHub. All rights reserved. | Academic Project</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
