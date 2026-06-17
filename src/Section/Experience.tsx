import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";
import { Calendar, Briefcase, Loader2 } from "lucide-react";

interface ExperienceItem {
  id?: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

const Experience: React.FC = () => {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data if Supabase is empty or credentials are missing
  const fallbackExperiences: ExperienceItem[] = [
    {
      title: "Fullstack Web Developer",
      company: "Welltrash",
      period: "2025 - Sekarang",
      description: "Membangun dan memelihara aplikasi web pengolahan sampah organik dengan React, Laravel, dan Tailwind CSS. Mengoptimalkan performa basis data dan mendesain antarmuka pengguna yang responsif.",
    },
    {
      title: "Web Developer Intern",
      company: "Selecta Wisata",
      period: "2024 - 2025",
      description: "Berkontribusi pada tim QA & Front End untuk meningkatkan keandalan antarmuka website. Terlibat dalam implementasi modul 360-degree tour dan fitur pemesanan tiket.",
    },
  ];

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setExperiences(data);
        } else {
          setExperiences(fallbackExperiences);
        }
      } catch (err) {
        console.warn("Using fallback experiences:", err);
        setExperiences(fallbackExperiences);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-4">
            {t("experience.title", "Pengalaman")}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            {t("experience.description", "Riwayat karir, magang, dan kontribusi saya di dunia teknologi.")}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="relative border-l border-white/10 max-w-3xl mx-auto pl-6 md:pl-10 space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={exp.id || index}
                className="relative group transition-all duration-300">
                {/* Timeline dot */}
                <span className="absolute -left-[31px] md:-left-[47px] top-1.5 flex h-4 w-4 md:h-6 md:w-6 items-center justify-center rounded-full bg-neutral-950 border border-purple-500 group-hover:bg-purple-500 transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                  <Briefcase className="w-2.5 h-2.5 md:w-3 md:h-3 text-purple-400 group-hover:text-white transition-colors" />
                </span>

                {/* Card Container */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm transition-all duration-300 group-hover:border-purple-500/40 group-hover:bg-white/[0.07] group-hover:translate-x-1 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold font-display text-white group-hover:text-purple-400 transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-sm font-semibold text-purple-300 mt-1">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300 w-fit">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-gray-400 leading-relaxed font-body">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
