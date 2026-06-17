import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../supabaseClient";

interface ProjectItem {
  image?: string;
  image_url?: string;
  title: string;
  description: string;
  link: string;
}

const Project: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.warn("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);


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

  if (projects.length === 0) {
    return (
      <section id="projects" className="min-h-[50vh] bg-neutral-950 text-white py-24 px-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-12 text-center">
          {t("projects.title")}
        </h1>
        <div className="text-gray-500 py-16 text-center border border-white/10 rounded-2xl w-full max-w-2xl bg-neutral-900/40">
          Belum ada projek. Kelola projek Anda melalui Admin Panel.
        </div>
      </section>
    );
  }

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
                <div className="w-full h-full bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col group/card">
                  {/* Image with Mock Browser Header */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-950 border-b border-white/5">
                    {/* Mock Browser Dots */}
                    <div className="absolute top-3 left-4 flex gap-1.5 z-10">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                    </div>
                    <img
                      src={project.image_url || project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/card:scale-105"
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
