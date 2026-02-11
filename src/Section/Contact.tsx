import React from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin } from "lucide-react";

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className="relative min-h-screen bg-black text-white flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-2xl w-full text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {t("contact.title")}
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed">
          {t("contact.description")}
        </p>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-14">
          <div className="flex items-center gap-4 text-zinc-300">
            <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Mail className="w-5 h-5" />
            </div>
            <span>riezqyken57@gmail.com</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <MapPin className="w-5 h-5" />
            </div>
            <span>Jember, Indonesia</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href="mailto:riezqyken57@gmail.com"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-sm font-medium transition-all duration-300 hover:bg-white hover:text-black hover:scale-105">
          {t("contact.emailMe")}
        </a>
      </div>
    </section>
  );
};

export default Contact;
