
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";

interface CertificateItem {
  id?: string;
  title: string;
  issuer: string;
  year: string;
  image?: string;
  image_url?: string;
  link: string;
}

const Certificate = () => {
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setCertificates(data);
        }
      } catch (err) {
        console.warn("Error fetching certificates:", err);
      }
    };

    fetchCertificates();
  }, []);

  if (certificates.length === 0) {
    return (
      <section id="certificate" className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("certificates.title")}
            </h2>
            <p className="text-gray-400 max-w-2xl">
              {t("certificates.description")}
            </p>
          </div>
          <div className="py-16 text-center text-gray-500 border border-white/10 bg-white/5 rounded-2xl">
            Belum ada sertifikat. Kelola sertifikat Anda melalui Admin Panel.
          </div>
        </div>
      </section>
    );
  }

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
              <div className="relative aspect-[4/3] w-full bg-neutral-900 flex items-center justify-center p-4 overflow-hidden border-b border-white/5">
                <img
                  src={cert.image_url || cert.image}
                  alt={cert.title}
                  className="max-w-full max-h-full object-contain rounded shadow-md transition-transform duration-500 group-hover:scale-[1.03]"
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
