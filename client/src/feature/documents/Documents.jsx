import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  Eye,
  FileText,
  Calendar,
  FolderOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "sonner";
import ResearchPaperView from "./ResearchPaperView";

const Documents = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState([]);
  const [adminDocs, setAdminDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingDoc, setDownloadingDoc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [approvedRes, adminRes] = await Promise.all([
          api.get("/documents/approved"),
          api.get("/public/documents")
        ]);
        setDocuments(approvedRes.data.approvedProposals || []);
        setAdminDocs(adminRes.data || []);
      } catch {
        toast.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.title?.toLowerCase().includes(term) ||
      doc.description?.toLowerCase().includes(term)
    );
  });

  const downloadAdminDoc = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3d3654]">
            Document Center
          </h1>
          <p className="text-sm text-[#7c73a0] mt-1">
            Access format templates and publicly available approved research proposals.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a09ac0]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search approved research…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e5e1ff] rounded-xl text-sm text-[#3d3654] placeholder:text-[#bcb8d8] focus:outline-none focus:ring-2 focus:ring-[#c4b8ff] focus:border-[#a78bfa] transition"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-[#7c73a0] animate-pulse">
          Loading documents…
        </div>
      )}

      {!loading && (
        <>
          {/* Admin Documents Section */}
          {adminDocs.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-bold text-[#3d3654] mb-4 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-[#8b7cf6]" /> Templates & Guidelines
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminDocs.map((doc) => (
                  <div key={doc._id} className="bg-white p-4 rounded-xl border border-[#e5e1ff] flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f0eeff] text-[#6d5ce8] flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#3d3654] truncate">{doc.title}</p>
                        <p className="text-[10px] text-[#7c73a0] truncate">{doc.description}</p>
                        <span className="text-[9px] px-2 py-0.5 bg-[#f8f7ff] border border-[#e5e1ff] rounded-md text-[#7c73a0] mt-1 inline-block">
                          {doc.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadAdminDoc(doc.fileUrl, doc.fileName)}
                      className="shrink-0 p-2 text-[#6d5ce8] hover:bg-[#f0eeff] rounded-lg transition-colors"
                      title="Download template"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Approved Proposals Grid */}
          <section>
            <h2 className="text-lg font-bold text-[#3d3654] mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#059669]" /> Approved Research Protocols
            </h2>
            
            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDocuments.map((doc) => (
                  <div key={doc._id} className="pastel-card p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#ede9ff] text-[#8b7cf6] flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wider border bg-[#e0f7f1] text-[#2d7a65] border-[#b2edd9]">
                        APPROVED
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#3d3654] mb-2 line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-[#7c73a0] mb-4 line-clamp-3 leading-relaxed flex-1">
                      {doc.description}
                    </p>

                    <div className="flex items-center text-[10px] text-[#a09ac0] mb-4 gap-1">
                      <Calendar className="h-3 w-3" />
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "N/A"}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/documents/${doc._id}`)}
                        className="flex-1 bg-gradient-to-r from-[#a78bfa] to-[#8b7cf6] text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:from-[#9b72fb] hover:to-[#7c6de8] transition-all shadow-sm"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDownloadingDoc(doc);
                        }}
                        className="p-2 border border-[#e5e1ff] text-[#7c73a0] rounded-xl hover:bg-[#f0eeff] hover:text-[#8b7cf6] hover:border-[#c4b8ff] transition-colors"
                        title="Download Research Paper (PDF)"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white border border-[#e5e1ff] rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-[#ede9ff] text-[#8b7cf6] flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-[#3d3654] mb-1">No approved documents found</h3>
                <p className="text-sm text-[#7c73a0]">Try searching with different keywords.</p>
              </div>
            )}
          </section>
        </>
      )}

      {/* Hidden PDF Generator */}
      {downloadingDoc && (
        <div className="fixed -left-[5000px] top-0 pointer-events-none opacity-0 overflow-hidden">
          <ResearchPaperView
            proposal={downloadingDoc}
            autoDownload={true}
            onDownloadComplete={() => setDownloadingDoc(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Documents;