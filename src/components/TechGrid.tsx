import React from "react";
import htmlIcon from "../assets/icons/html.png";
import cssIcon from "../assets/icons/css.png";
import tailwindIcon from "../assets/icons/tailwind.png";
import laravelIcon from "../assets/icons/laravel.png";
import reactIcon from "../assets/icons/react.png";
import mysqlIcon from "../assets/icons/mysql.png";
import VsCodeIcon from "../assets/icons/VsCode.png";
import jira from "../assets/icons/jira.png";
import figma from "../assets/icons/figma.png";

type TechItem = {
  name: string;
  icon: string;
};

const techStack: TechItem[] = [
  { name: "HTML", icon: htmlIcon },
  { name: "CSS", icon: cssIcon },
  { name: "Tailwind", icon: tailwindIcon },
  { name: "Laravel", icon: laravelIcon },
  { name: "React", icon: reactIcon },
  { name: "MySQL", icon: mysqlIcon },
  { name: "VS Code", icon: VsCodeIcon },
  { name: "Jira", icon: jira },
  { name: "Figma", icon: figma },
];

const TechGrid: React.FC = () => {
  return (
    <div className="relative flex flex-col gap-8 overflow-hidden py-10 max-w-7xl mx-auto">
      {/* ===== FIRST ROW (Left) ===== */}
      <div
        className="
          flex gap-8 whitespace-nowrap
          animate-marquee
          will-change-transform
          hover:[animation-play-state:paused]
        ">
        {[...techStack, ...techStack].map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex-shrink-0 group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] w-[160px] md:w-[180px]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black/20 p-3 ring-1 ring-white/10 transition-all duration-300 group-hover:ring-purple-500/50 group-hover:scale-110">
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-white">
                {tech.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== SECOND ROW (Right) ===== */}
      <div
        className="
          flex gap-8 whitespace-nowrap
          animate-marquee-reverse
          will-change-transform
          hover:[animation-play-state:paused]
        ">
        {[...techStack, ...techStack].reverse().map((tech, index) => (
          <div
            key={`${tech.name}-reverse-${index}`}
            className="flex-shrink-0 group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] w-[160px] md:w-[180px]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black/20 p-3 ring-1 ring-white/10 transition-all duration-300 group-hover:ring-blue-500/50 group-hover:scale-110">
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-white">
                {tech.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Fade Edges ===== */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default TechGrid;
