import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-950 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4">
          <div className="order-2 md:order-1 text-center md:text-left">
            © {year}{" "}
            <span className="font-medium text-gray-300 tracking-wide">
              AlgoHol!c
            </span>
          </div>

          <div className="order-1 md:order-2 text-center">
            Developed by{" "}
            <span className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
              Dilip
            </span>
          </div>

          <div className="order-3 flex items-center gap-5 text-gray-400">
            <a
              href="https://github.com/DevDilip28"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="http://www.linkedin.com/in/dilipasdeo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:dilipasdeo4@gmail.com"
              aria-label="Email"
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
