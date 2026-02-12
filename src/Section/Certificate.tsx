
import { useTranslation } from "react-i18next";
import udemy from "../assets/certificates/udemy.png";
import magang from "../assets/certificates/magang.png";

const certificates = [
  {
    title: "Agile Project Management",
    issuer: "Udemy",
    year: "2026",
    image: udemy,
    link: "https://drive.google.com/file/d/1GxC_OJZDamfyRZyqNkCxsZyoslTYL1TU/view?usp=sharing",
  },
  {
    title: "Sertifikat Magang",
    issuer: "Selecta",
    year: "2025",
    image: magang,
    link: "https://drive.google.com/file/d/1B5nxoz79ohCuXCgQGK3HKUI40LsY8aRU/view?usp=sharing",
  },
];

const Certificate = () => {
  const { t } = useTranslation();

  return (
    <section id="certificate" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("certificates.title")}
          </h2>
          <p className="text-gray-400 max-w-2xl">
            {t("certificates.description")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert, index) => (
            <a
              key={index}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {cert.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {cert.issuer} • {cert.year}
                </p>

                <span className="mt-4 inline-block text-sm font-medium text-purple-400 group-hover:text-white transition-colors">
                  View Certificate →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificate;
