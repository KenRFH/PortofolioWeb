import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Selecta from "../assets/Projects/Selecta.png";
import Selecta360 from "../assets/Projects/Selecta360.png";
import WellMaggot from "../assets/Projects/WellMaggot.png";
import SelectaHotel from "../assets/Projects/SelectaHotel.png";
import porto from "../assets/Projects/Porto.png";

interface ProjectItem {
  image: string;
  title: string;
  description: string;
  link: string;
}

const Project: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const projects: ProjectItem[] = [
    {
      image: Selecta,
      title: "Selecta Wisata",
      description: "QA & FE Support",
      link: "https://github.com/najuwamr/wisata-batu",
    },
    {
      image: WellMaggot,
      title: "WellMaggot",
      description: "Project Manager & FE Support",
      link: "https://github.com/najuwamr/WellMaggot",
    },
    {
      image: Selecta360,
      title: "Selecta 360",
      description: "Web Developer",
      link: "https://github.com/selectaDeveloper/Sprint2-360",
    },
    {
      image: SelectaHotel,
      title: "Selecta Hotel",
      description: "Web Developer",
      link: "https://github.com/selectaDeveloper/Hotel",
    },
    {
      image: porto,
      title: "Portofolio Ken",
      description: "Web Developer",
      link: "https://github.com/KenRFH/PortofolioWeb",
    },
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Stable Auto Slide
  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <section
      id="projects"
      className="min-h-screen bg-neutral-950 text-white py-24 px-6 flex flex-col items-center"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}>
      <h1 className="text-4xl md:text-5xl font-semibold mb-20 text-center">
        {t("projects.title")}
      </h1>

      <div className="relative w-full max-w-6xl h-[520px]">
        {/* Navigation */}
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className="absolute md:-left-10 left-4 top-1/2 -translate-y-1/2 z-20 bg-white/5 border border-white/10 p-3 rounded-full hover:bg-white/10 transition">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className="absolute right-4 md:-right-10 top-1/2 -translate-y-1/2 z-20 bg-white/5 border border-white/10 p-3 rounded-full hover:bg-white/10 transition">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slider */}
        <div className="w-full h-full overflow-hidden rounded-2xl">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {projects.map((project, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 px-4">
                <div className="w-full h-full bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                  {/* Image */}
                  <div className="min-h-[300px] w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between flex-1 p-8 ">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                        {project.title}
                      </h3>

                      <p className="text-gray-400 inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm">
                        {project.description}
                      </p>
                    </div>

                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-2 mt-6 px-4 py-2 text-sm font-medium text-white transition-all duration-300">
                      <span className="relative">
                        {t("projects.viewProject")}
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:bg-white"></span>
                      </span>
                      <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / projects.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-3 mt-12">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="mt-6 text-sm text-gray-500">
        <span className="text-white font-medium">{currentIndex + 1}</span>
        <span className="mx-2">/</span>
        <span>{projects.length}</span>
      </div>
    </section>
  );
};

export default Project;
