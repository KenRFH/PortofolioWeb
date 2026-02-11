import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export type StaggeredMenuItem = {
  label: string;
  ariaLabel: string;
  link: string;
};

export type StaggeredMenuSocialItem = {
  label: string;
  link: string;
};

interface Props {
  position?: "left" | "right";
  items: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  accentColor?: string;
  colors?: string[];
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  closeOnClickAway?: boolean;
}

const StaggeredMenu: React.FC<Props> = ({
  position = "right",
  items,
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = false,
  accentColor = "#3b82f6",
  colors = ["#111111", "#1f1f1f", "#000000"],
  menuButtonColor = "#000",
  openMenuButtonColor = "#000",
  closeOnClickAway = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  /* =========================
     Lock body scroll
  ========================= */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  /* =========================
     Close on click outside
  ========================= */
  useEffect(() => {
    if (!closeOnClickAway || !isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, closeOnClickAway]);

  /* =========================
     GSAP Animation
  ========================= */
  useEffect(() => {
    if (!panelRef.current) return;

    if (isOpen) {
      gsap.set(panelRef.current, {
        x: position === "right" ? "100%" : "-100%",
      });

      gsap.to(panelRef.current, {
        x: "0%",
        duration: 0.5,
        ease: "power3.out",
      });

      gsap.fromTo(
        ".sm-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.4,
          delay: 0.2,
          ease: "power3.out",
        },
      );
    } else {
      gsap.to(panelRef.current, {
        x: position === "right" ? "100%" : "-100%",
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [isOpen, position]);

  return (
    <>
      {/* =========================
          HAMBURGER BUTTON
      ========================= */}
      <button
        onClick={openMenu}
        style={{ color: isOpen ? openMenuButtonColor : menuButtonColor }}
        className="relative z-[9999] p-2 text-2xl">
        ☰
      </button>

      {/* =========================
          OVERLAY (SOLID FIXED)
      ========================= */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-[9998] bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* =========================
          PANEL (FULL FIXED)
      ========================= */}
      <div
        ref={panelRef}
        className={`fixed top-0 ${
          position === "right" ? "right-0" : "left-0"
        } h-screen w-[85%] max-w-sm z-[9999] p-10 flex flex-col justify-between`}
        style={{
          background: `linear-gradient(180deg, ${colors.join(",")})`,
        }}>
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="self-end text-white text-2xl mb-10">
          ✕
        </button>

        {/* Menu Items */}
        <ul className="space-y-6">
          {items.map((item, idx) => (
            <li key={idx} className="sm-item">
              <a
                href={item.link}
                aria-label={item.ariaLabel}
                onClick={closeMenu}
                className="text-white text-3xl font-semibold hover:opacity-70 transition-opacity duration-200 flex items-center gap-3">
                {displayItemNumbering && (
                  <span style={{ color: accentColor }}>
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                )}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Socials */}
        {displaySocials && socialItems.length > 0 && (
          <div className="mt-12 flex gap-6">
            {socialItems.map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm hover:opacity-70 transition-opacity duration-200">
                {social.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StaggeredMenu;
