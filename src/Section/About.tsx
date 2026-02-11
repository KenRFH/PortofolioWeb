import React from "react";
import { useTranslation } from "react-i18next";
import profileImage from "../assets/Ken.png";

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center pt-24 bg-white overflow-hidden rounded-b-[3rem] z-20 pb-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border-2 border-black group shadow-lg shadow-black/10">
            {/* Image */}
            <img
              src={profileImage}
              alt={t("about.imageAlt")}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Right Column: Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              {t("about.title")}
            </h2>

            <div className="space-y-4 text-zinc-700 leading-relaxed">
              <p>{t("about.paragraph1")}</p>
              <p>
                {t("about.paragraph2.prefix")}{" "}
                <strong className="text-zinc-700">
                  {t("about.paragraph2.highlight")}
                </strong>{" "}
                {t("about.paragraph2.suffix")}
              </p>
              <p>{t("about.paragraph3")}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 border-t border-black/60 pt-8">
              <div>
                <h3 className="text-3xl font-bold text-black">
                  {t("about.stats.IPK.value")}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {t("about.stats.IPK.label")}
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-black">
                  {t("about.stats.projects.value")}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {t("about.stats.projects.label")}
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-black">
                  {t("about.stats.satisfaction.value")}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {t("about.stats.satisfaction.label")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
