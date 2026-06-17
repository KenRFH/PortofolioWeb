import React, { useState, useEffect } from "react";
import { Github, Instagram, Linkedin, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import StaggeredMenu from "../components/StaggeredMenu";

type NavLink = {
  key: string;
  href: string;
};

type SocialLink = {
  icon: LucideIcon;
  href: string;
  label: string;
};

type MobileMenuItem = {
  label: string;
  ariaLabel: string;
  link: string;
};

type MobileSocialItem = {
  label: string;
  link: string;
};

const navLinks: NavLink[] = [
  { key: "Nav.Home", href: "#home" },
  { key: "Nav.About", href: "#about" },
  { key: "Nav.Experience", href: "#experience" },
  { key: "Nav.Certificates", href: "#certificate" },
  { key: "Nav.Projects", href: "#projects" },
  { key: "Nav.Contact", href: "#contact" },
];

const socialLinks: SocialLink[] = [
  { icon: Github, href: "https://github.com/KenRFH", label: "GitHub" },
  {
    icon: Instagram,
    href: "https://instagram.com/riezqyken",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/riezqyken",
    label: "LinkedIn",
  },
];

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const changeLang = (lang: "id" | "en") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const mobileItems: MobileMenuItem[] = navLinks.map((link) => ({
    label: t(link.key),
    ariaLabel: t(link.key),
    link: link.href,
  }));

  const mobileSocials: MobileSocialItem[] = socialLinks.map((s) => ({
    label: s.label,
    link: s.href,
  }));

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-4"
          : "bg-white/60 backdrop-blur-md py-6"
      }`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-xl font-bold tracking-tight text-black">
          Ken<span className="text-blue-500">.</span>
        </a>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Navigation Links */}
          <div className="flex space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-black transition-colors duration-300 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                {t(link.key)}
              </a>
            ))}
          </div>

          <div className="h-5 w-px bg-black/10" />

          {/* Social Links */}
          <div className="flex items-center space-x-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="p-2 rounded-full text-black transition-all duration-300 hover:bg-black hover:text-white">
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Language Switch Desktop */}
          <div className="ml-4 flex items-center rounded-full border border-black/10 p-1 text-sm">
            {(["id", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLang(lang)}
                className={`px-3 py-1 rounded-full transition-all duration-300 ${
                  i18n.language === lang
                    ? "bg-black text-white"
                    : "text-black hover:bg-black/5"
                }`}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden flex items-center gap-3">
          {/* Language Switch Mobile */}
          <div className="flex items-center rounded-full border border-black/10 p-1 text-xs">
            {(["id", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLang(lang)}
                className={`px-2 py-1 rounded-full transition-all ${
                  i18n.language === lang ? "bg-black text-white" : "text-black"
                }`}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Hamburger Menu */}
          <StaggeredMenu
            position="right"
            items={mobileItems}
            socialItems={mobileSocials}
            displaySocials
            displayItemNumbering
            accentColor="#3b82f6"
            colors={["#111111", "#1f1f1f", "#000000"]}
            menuButtonColor="#000"
            openMenuButtonColor="#000"
            closeOnClickAway
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
