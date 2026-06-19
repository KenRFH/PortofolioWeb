import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  Briefcase,
  Award,
  Calendar,
  LogOut,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
  Loader2,
  X,
  FileImage,
  Globe
} from "lucide-react";

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image_url: string;
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  link: string;
  image_url: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<"projects" | "certificates" | "experiences">("projects");
  const [loading, setLoading] = useState(false);

  // States for list data
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // CV States
  const [cvUrl, setCvUrl] = useState("");
  const [cvUploading, setCvUploading] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Uploading state
  const [uploading, setUploading] = useState(false);

  // Form Fields
  const [projForm, setProjForm] = useState({ title: "", description: "", link: "", image_url: "" });
  const [projRole, setProjRole] = useState("");
  const [projDetails, setProjDetails] = useState("");
  const [certForm, setCertForm] = useState({ title: "", issuer: "", year: "", link: "", image_url: "" });
  const [expForm, setExpForm] = useState({ title: "", company: "", period: "", description: "" });

  // Notifications (Toast)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin/login");
      } else {
        setSessionChecked(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch CV Url
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
      console.warn("No cv_url key found in settings table.", err);
    }
  };

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch lists
      const { data: projData, error: projErr } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (projErr) throw projErr;
      setProjects(projData || []);

      const { data: certData, error: certErr } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });
      if (certErr) throw certErr;
      setCertificates(certData || []);

      const { data: expData, error: expErr } = await supabase
        .from("experiences")
        .select("*")
        .order("created_at", { ascending: false });
      if (expErr) throw expErr;
      setExperiences(expData || []);

      // Fetch CV Url
      await fetchCv();
    } catch (err: any) {
      showToast(err.message || "Gagal memuat data dari Supabase", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionChecked) {
      fetchData();
    }
  }, [sessionChecked]);

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  // Upload CV PDF to Supabase Storage and Save to Settings Table
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `cv_${Date.now()}.${fileExt}`;
    const filePath = `uploads/cv/${fileName}`;

    setCvUploading(true);

    try {
      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(
          "Gagal mengunggah CV ke Storage. Pastikan Anda sudah membuat bucket bernama 'portfolio' di dashboard Supabase Storage dan mengaturnya sebagai 'Public'."
        );
      }

      // 2. Get Public URL
      const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // 3. Upsert to Settings Table
      const { error: dbError } = await supabase
        .from("settings")
        .upsert({ key: "cv_url", value: publicUrl }, { onConflict: "key" });

      if (dbError) {
        throw new Error(
          "Berkas berhasil diunggah ke Storage, tetapi gagal memperbarui tautan di tabel 'settings' database. Silakan jalankan script SQL pembuatan tabel 'settings'."
        );
      }

      setCvUrl(publicUrl);
      showToast("CV berhasil diunggah dan diperbarui!");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setCvUploading(false);
    }
  };

  // Upload Image to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "projects" | "certificates") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fieldName}/${fileName}`;

    setUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(
          "Storage upload failed. Pastikan Anda sudah membuat bucket bernama 'portfolio' di dashboard Supabase Storage dan mengaturnya sebagai 'Public'."
        );
      }

      // Get Public URL
      const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      
      if (fieldName === "projects") {
        setProjForm((prev) => ({ ...prev, image_url: data.publicUrl }));
      } else {
        setCertForm((prev) => ({ ...prev, image_url: data.publicUrl }));
      }
      showToast("Gambar berhasil diunggah!");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setModalType("create");
    setEditingId(null);
    setProjRole("");
    setProjDetails("");
    setProjForm({ title: "", description: "", link: "", image_url: "" });
    setCertForm({ title: "", issuer: "", year: "", link: "", image_url: "" });
    setExpForm({ title: "", company: "", period: "", description: "" });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: any) => {
    setModalType("edit");
    setEditingId(item.id);
    if (activeTab === "projects") {
      const desc = item.description || "";
      const newlineIndex = desc.indexOf("\n");
      let roleVal = desc;
      let detailsVal = "";
      if (newlineIndex !== -1) {
        roleVal = desc.substring(0, newlineIndex);
        detailsVal = desc.substring(newlineIndex + 1);
      }
      setProjRole(roleVal);
      setProjDetails(detailsVal);
      setProjForm({
        title: item.title,
        description: item.description,
        link: item.link || "",
        image_url: item.image_url || "",
      });
    } else if (activeTab === "certificates") {
      setCertForm({
        title: item.title,
        issuer: item.issuer,
        year: item.year,
        link: item.link || "",
        image_url: item.image_url || "",
      });
    } else {
      setExpForm({
        title: item.title,
        company: item.company,
        period: item.period,
        description: item.description,
      });
    }
    setIsModalOpen(true);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "projects") {
        const finalDescription = projDetails.trim()
          ? `${projRole.trim()}\n${projDetails.trim()}`
          : projRole.trim();
        const submissionForm = {
          ...projForm,
          description: finalDescription,
        };
        if (modalType === "create") {
          const { error } = await supabase.from("projects").insert([submissionForm]);
          if (error) throw error;
          showToast("Projek berhasil ditambahkan!");
        } else {
          const { error } = await supabase.from("projects").update(submissionForm).eq("id", editingId);
          if (error) throw error;
          showToast("Projek berhasil diperbarui!");
        }
      } else if (activeTab === "certificates") {
        if (modalType === "create") {
          const { error } = await supabase.from("certificates").insert([certForm]);
          if (error) throw error;
          showToast("Sertifikat berhasil ditambahkan!");
        } else {
          const { error } = await supabase.from("certificates").update(certForm).eq("id", editingId);
          if (error) throw error;
          showToast("Sertifikat berhasil diperbarui!");
        }
      } else {
        if (modalType === "create") {
          const { error } = await supabase.from("experiences").insert([expForm]);
          if (error) throw error;
          showToast("Pengalaman berhasil ditambahkan!");
        } else {
          const { error } = await supabase.from("experiences").update(expForm).eq("id", editingId);
          if (error) throw error;
          showToast("Pengalaman berhasil diperbarui!");
        }
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Action
  const handleDelete = async (id: string, tableName: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus item ini secara permanen?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
      showToast("Item berhasil dihapus!");
      fetchData();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border transition-all duration-300 animate-slideIn ${
            toast.type === "success"
              ? "bg-purple-950/80 border-purple-500/30 text-purple-200"
              : "bg-red-950/80 border-red-500/30 text-red-200"
          }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 bg-neutral-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-display bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Ken Portofolio Admin
            </span>
            <span className="bg-white/5 border border-white/10 text-[10px] uppercase font-semibold tracking-wider text-gray-400 px-2 py-0.5 rounded">
              Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <Globe className="w-4 h-4" />
              <span>Lihat Web</span>
            </a>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-2xl p-8 mb-10">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold font-display">Selamat Datang di Admin Panel</h1>
            <p className="text-gray-400 mt-2 max-w-xl text-sm leading-relaxed">
              Di sini Anda dapat menambah, mengedit, dan menghapus item portofolio yang tersimpan di Supabase secara waktu nyata (real-time).
            </p>
          </div>
          <div className="absolute right-0 top-0 w-80 h-full bg-purple-500/10 rounded-full blur-3xl -z-0"></div>
        </div>

        {/* CV Management Panel */}
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-400" />
              <span>Kelola Curriculum Vitae (CV)</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Unggah berkas CV Anda (format PDF) langsung ke Supabase Storage. Link unduh CV di landing page akan terupdate otomatis.
            </p>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-purple-400 inline-flex items-center gap-1 mt-2.5 hover:underline">
                <span>Lihat CV Aktif Saat Ini</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2.5 px-4 rounded-xl border border-white/10 transition-all cursor-pointer text-sm">
              {cvUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{cvUploading ? "Mengunggah..." : "Unggah CV (PDF)"}</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleCvUpload}
                className="hidden"
                disabled={cvUploading}
              />
            </label>
          </div>
        </div>

        {/* Tab Controls and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-8">
          <div className="flex border border-white/10 bg-neutral-900/50 p-1.5 rounded-xl gap-1.5">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}>
              <Briefcase className="w-4 h-4" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveTab("certificates")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === "certificates"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}>
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </button>

            <button
              onClick={() => setActiveTab("experiences")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === "experiences"
                  ? "bg-white text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}>
              <Calendar className="w-4 h-4" />
              <span>Experiences</span>
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-lg shadow-purple-600/10 cursor-pointer active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            <span>Tambah {activeTab === "projects" ? "Projek" : activeTab === "certificates" ? "Sertifikat" : "Pengalaman"}</span>
          </button>
        </div>

        {/* Dynamic List Render */}
        {loading && (
          <div className="flex items-center justify-center py-20 border border-white/10 bg-neutral-900/20 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="ml-3 text-gray-400">Sedang menyinkronkan data...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* PROJECTS VIEW */}
            {activeTab === "projects" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                    Belum ada projek. Klik "Tambah Projek" untuk memulai.
                  </div>
                ) : (
                  projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex flex-col group hover:border-purple-500/30 transition-all duration-300">
                      <div className="h-44 bg-neutral-950 flex items-center justify-center overflow-hidden relative border-b border-white/5">
                        {proj.image_url ? (
                          <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-600 text-sm flex flex-col items-center gap-2">
                            <FileImage className="w-8 h-8" />
                            <span>Tidak ada gambar</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">{proj.title}</h3>
                          <p className="text-sm text-gray-400 mt-2 line-clamp-2">{proj.description}</p>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-purple-400 inline-flex items-center gap-1 mt-3 hover:underline">
                              <span>Tautan Projek</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2.5 mt-5 border-t border-white/5 pt-4">
                          <button
                            onClick={() => openEditModal(proj)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id, "projects")}
                            className="flex items-center justify-center p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-lg transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CERTIFICATES VIEW */}
            {activeTab === "certificates" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                    Belum ada sertifikat. Klik "Tambah Sertifikat" untuk memulai.
                  </div>
                ) : (
                  certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex flex-col group hover:border-purple-500/30 transition-all duration-300">
                      <div className="h-44 bg-neutral-950 flex items-center justify-center overflow-hidden relative border-b border-white/5">
                        {cert.image_url ? (
                          <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-600 text-sm flex flex-col items-center gap-2">
                            <FileImage className="w-8 h-8" />
                            <span>Tidak ada gambar</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                            {cert.issuer} • {cert.year}
                          </span>
                          <h3 className="font-semibold text-lg line-clamp-1 mt-1">{cert.title}</h3>
                          {cert.link && (
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-purple-400 inline-flex items-center gap-1 mt-3 hover:underline">
                              <span>Sertifikat Asli</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2.5 mt-5 border-t border-white/5 pt-4">
                          <button
                            onClick={() => openEditModal(cert)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(cert.id, "certificates")}
                            className="flex items-center justify-center p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-lg transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* EXPERIENCES VIEW */}
            {activeTab === "experiences" && (
              <div className="flex flex-col gap-4">
                {experiences.length === 0 ? (
                  <div className="py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                    Belum ada riwayat pengalaman. Klik "Tambah Pengalaman" untuk memulai.
                  </div>
                ) : (
                  experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-neutral-900 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-purple-500/30 transition-all duration-300">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{exp.title}</h3>
                          <span className="text-xs bg-purple-500/10 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/20 font-medium">
                            {exp.company}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1.5 font-medium flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span>{exp.period}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2 max-w-3xl leading-relaxed">{exp.description}</p>
                      </div>
                      <div className="flex md:flex-col gap-2.5 min-w-[120px] justify-end">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 py-2 px-3.5 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, "experiences")}
                          className="flex items-center justify-center p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* CRUD Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-xl relative z-10 overflow-hidden shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/40">
              <h2 className="text-xl font-bold font-display">
                {modalType === "create" ? "Tambah" : "Edit"}{" "}
                {activeTab === "projects" ? "Projek" : activeTab === "certificates" ? "Sertifikat" : "Pengalaman"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* PROJECTS FORM */}
              {activeTab === "projects" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Judul Projek</label>
                    <input
                      type="text"
                      required
                      value={projForm.title}
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Contoh: Website E-Commerce"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Peran / Keterangan Singkat</label>
                    <input
                      type="text"
                      required
                      value={projRole}
                      onChange={(e) => setProjRole(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Contoh: Project Manager & FE Support"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Detail Deskripsi (Poin-poin, pisahkan dengan baris baru)</label>
                    <textarea
                      rows={4}
                      value={projDetails}
                      onChange={(e) => setProjDetails(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Contoh:&#10;- Mengembangkan frontend menggunakan React & TailwindCSS&#10;- Mengintegrasikan Supabase sebagai database&#10;- Melakukan deployment ke Vercel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Link Projek (Opsional)</label>
                    <input
                      type="url"
                      value={projForm.link}
                      onChange={(e) => setProjForm({ ...projForm, link: e.target.value })}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Contoh: https://github.com/username/project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gambar Projek</label>
                    
                    {/* Direct Upload */}
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 border border-white/10 hover:border-purple-500/30 bg-neutral-950 rounded-xl py-3 px-4 text-sm font-semibold text-gray-300 hover:text-white transition-all cursor-pointer">
                          {uploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                          <span>{uploading ? "Mengunggah..." : "Unggah Gambar"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "projects")}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                      </div>

                      <div className="text-center text-xs text-gray-500 py-1">ATAU</div>

                      <input
                        type="text"
                        value={projForm.image_url}
                        onChange={(e) => setProjForm({ ...projForm, image_url: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Tempel URL Gambar di sini (fallback)"
                      />

                      {projForm.image_url && (
                        <div className="mt-2 h-36 border border-white/10 rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center">
                          <img src={projForm.image_url} alt="Pratinjau" className="h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* CERTIFICATES FORM */}
              {activeTab === "certificates" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nama Sertifikat</label>
                    <input
                      type="text"
                      required
                      value={certForm.title}
                      onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Contoh: Agile Project Management"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Penerbit</label>
                      <input
                        type="text"
                        required
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Contoh: Udemy / Google"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tahun</label>
                      <input
                        type="text"
                        required
                        value={certForm.year}
                        onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Contoh: 2026"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Link Kredensial / File (Opsional)</label>
                    <input
                      type="url"
                      value={certForm.link}
                      onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Contoh: https://drive.google.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gambar Sertifikat</label>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 border border-white/10 hover:border-purple-500/30 bg-neutral-950 rounded-xl py-3 px-4 text-sm font-semibold text-gray-300 hover:text-white transition-all cursor-pointer">
                          {uploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                          <span>{uploading ? "Mengunggah..." : "Unggah Gambar"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, "certificates")}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                      </div>

                      <div className="text-center text-xs text-gray-500 py-1">ATAU</div>

                      <input
                        type="text"
                        value={certForm.image_url}
                        onChange={(e) => setCertForm({ ...certForm, image_url: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Tempel URL Gambar di sini (fallback)"
                      />

                      {certForm.image_url && (
                        <div className="mt-2 h-36 border border-white/10 rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center">
                          <img src={certForm.image_url} alt="Pratinjau" className="h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* EXPERIENCES FORM */}
              {activeTab === "experiences" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Posisi / Jabatan</label>
                    <input
                      type="text"
                      required
                      value={expForm.title}
                      onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Contoh: Senior Web Developer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Instansi / Perusahaan</label>
                      <input
                        type="text"
                        required
                        value={expForm.company}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Contoh: PT. Maju Bersama"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Periode Waktu</label>
                      <input
                        type="text"
                        required
                        value={expForm.period}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                        placeholder="Contoh: 2024 - Sekarang"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Tanggung Jawab / Keterangan</label>
                    <textarea
                      required
                      rows={4}
                      value={expForm.description}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Tuliskan detail pekerjaan atau pencapaian Anda..."
                    />
                  </div>
                </>
              )}

              {/* Form Actions */}
              <div className="flex gap-3.5 pt-4 border-t border-white/5 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-semibold py-3 px-5 rounded-xl transition-all cursor-pointer">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-white hover:bg-neutral-200 text-black font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.98]">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
