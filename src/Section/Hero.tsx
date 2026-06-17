import React, { useState, useEffect } from "react";
import { ArrowRight, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [cvUrl, setCvUrl] = useState("https://drive.google.com/file/d/1lP10W7JCRRpquus8xy6i6GSKKAsDNGAR/view?usp=sharing");

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "cv_url")
          .single();

        if (error) throw error;
        if (data && data.value) {
          setCvUrl(data.value);
        }
      } catch (err) {
        console.warn("Using fallback CV link:", err);
      }
    };

    fetchCv();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 bg-white overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-100 rounded-full blur-[140px] -z-10" />

      <div className="mx-auto max-w-5xl px-4 md:px-8 w-full">
        <div className="max-w-4xl">
          <span className="text-blue-600 font-medium tracking-wider uppercase text-sm">
            {t("hero.tagline")}
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-tight text-black font-display">
            {t("hero.greeting")}{" "}
            <span className="text-outline-black font-extrabold font-system">
              Ken Riezqy
            </span>
            .
          </h1>
          <p className="mt-2 text-4xl md:text-7xl text-zinc-600 tracking-tight leading-tight font-bold">
            {t("hero.subtitle")}
          </p>

          <p className="mt-6 text-xl text-zinc-600 max-w-2xl leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {/* Primary Button */}
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-white font-medium
                         transition-all duration-300 hover:bg-zinc-800 hover:scale-[1.02]">
              {t("hero.viewProjects")}
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Outline Button */}
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-6 py-3
                         text-zinc-700 font-medium transition-all duration-300
                         hover:border-black hover:text-black hover:bg-zinc-50">
              {t("hero.downloadCv")}
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
