import React from "react";
import { useTranslation } from "react-i18next";
import TechGrid from "../components/TechGrid";

const Tech: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-black text-white py-20 flex flex-col items-center justify-center md:-mt-[4rem]">
      
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),transparent_70%)]" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <p
          className="font-mono text-sm uppercase tracking-[0.2em] text-slate-200 mb-4">
          {t("tech.subtitle")}
        </p>

        <h1
          className="text-4xl md:text-6xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
          {t("tech.title")}
        </h1>

        <div className="w-full max-w-6xl mx-auto">
          <TechGrid />
        </div>
      </div>
    </section>
  );
};

export default Tech;
