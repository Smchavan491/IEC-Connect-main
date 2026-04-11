import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FileText, Download, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";

const subCategories = {
  "Administrative Documents": [
    "Cover Letter",
    "CV of Principal Investigator",
    "CV of all Co-Investigators",
    "EC Fee Payment Receipt",
    "HOD Approval Letter",
    "Principal Approval",
    "Other Administrative Documents"
  ],
  "Protocol Documents": [
    "Detailed Research Protocol",
    "Participant Information Sheet (PIS) — English",
    "Participant Information Sheet (PIS) — Local Language",
    "Informed Consent Form (ICF) — English",
    "Informed Consent Form (ICF) — Local Language",
    "Investigators Brochure",
    "All Other Proposal Documents"
  ],
  "Clinical Trial Specific": [
    "Clinical Trial Agreement (CTA)",
    "Material Transfer Agreement (MTA)",
    "Memorandum of Understanding (MOU)",
    "Insurance Certificate",
    "Indemnity Policy",
    "DCGI Approval",
    "Regulatory Approvals",
    "GCP Training Certificates"
  ]
};

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "Administrative Documents",
    subCategory: "",
    file: null
  });

  // Default first sub-category on change
  useEffect(() => {
    if (formData.category) {
      setFormData(prev => ({ ...prev, subCategory: subCategories[prev.category][0] }));
    }
  }, [formData.category]);

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/admin-data/documents");
      setDocuments(res.data);
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file || !formData.category || !formData.subCategory) {
      return toast.error("Please select a category, sub-category, and file.");
    }

    const payload = new FormData();
    payload.append("category", formData.category);
    payload.append("subCategory", formData.subCategory);
    payload.append("file", formData.file);

    setUploading(true);
    try {
      await api.post("/admin-data/documents", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Document uploaded successfully");
      setShowForm(false);
      setFormData({ category: "Administrative Documents", subCategory: subCategories["Administrative Documents"][0], file: null });
      fetchDocuments();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/admin-data/documents/${id}`);
      toast.success("Document deleted");
      fetchDocuments();
    } catch {
      toast.error("Delete failed");
    }
  };

  const downloadDoc = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#3d3654]">Manage Documents</h2>
          <p className="text-sm text-[#7c73a0]">Upload administrative guides and format templates for researchers.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#8b7cf6] hover:bg-[#7c3aed] text-white gap-2"
        >
          {showForm ? "Cancel" : <><PlusCircle className="h-4 w-4" /> Upload Sample Document</>}
        </Button>
      </div>

      {showForm && (
        <div className="pastel-card p-5 max-w-xl bg-white border border-[#e5e1ff] rounded-xl shadow-sm">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#3d3654]">Category</label>
                <select
                  className="w-full mt-1 p-2 border border-slate-200 rounded-md outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Administrative Documents">Administrative Documents</option>
                  <option value="Protocol Documents">Protocol Documents</option>
                  <option value="Clinical Trial Specific">Clinical Trial Specific</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#3d3654]">Sub-Category</label>
                <select
                  className="w-full mt-1 p-2 border border-slate-200 rounded-md outline-none"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                >
                  {subCategories[formData.category].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#3d3654]">Upload Document (.docx only)</label>
              <input
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="w-full mt-1 p-2 border border-slate-200 rounded-md outline-none"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && !file.name.endsWith(".docx")) {
                    toast.error("Please select a .docx file");
                    e.target.value = null;
                    setFormData({ ...formData, file: null });
                  } else {
                    setFormData({ ...formData, file });
                  }
                }}
              />
            </div>
            <Button type="submit" disabled={uploading} className="w-full bg-[#8b7cf6] text-white font-bold">
              {uploading ? "Uploading..." : "Save Sample Document"}
            </Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse text-[#7c73a0]">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="text-[#a09ac0] text-center p-8 bg-[#f8f7ff] rounded-xl border border-[#e5e1ff]">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="bg-white border border-[#e5e1ff] rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#f8f7ff]">
              <TableRow>
                <TableHead>Type / Category</TableHead>
                <TableHead>Document Name (Sub-category)</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => (
                <TableRow key={doc._id}>
                  <TableCell>
                    <span className="text-[10px] font-bold px-2 py-1 bg-[#ede9ff] text-[#7c3aed] rounded-full uppercase tracking-tighter shadow-sm border border-[#c4b8ff]">
                      {doc.category}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-[#3d3654]">{doc.subCategory || doc.title}</TableCell>
                  <TableCell className="text-sm text-[#7c73a0]">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" onClick={() => downloadDoc(doc.fileUrl, doc.fileName)} className="text-[#0369a1] hover:bg-[#e0f2fe]">
                         <Download className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDelete(doc._id)} className="text-[#be185d] hover:bg-[#fff1f2]">
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
