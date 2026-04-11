import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Megaphone } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/admin-data/announcements");
      setAnnouncements(res.data);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return toast.error("All fields required");

    try {
      await api.post("/admin-data/announcements", formData);
      toast.success("Announcement published");
      setShowForm(false);
      setFormData({ title: "", description: "" });
      fetchAnnouncements();
    } catch {
      toast.error("Failed to publish");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/admin-data/announcements/${id}`);
      toast.success("Announcement deleted");
      fetchAnnouncements();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#3d3654]">Manage Announcements</h2>
          <p className="text-sm text-[#7c73a0]">Broadcast important news and deadlines.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#d97706] hover:bg-[#b45309] text-white gap-2"
        >
          {showForm ? "Cancel" : <><PlusCircle className="h-4 w-4" /> New Announcement</>}
        </Button>
      </div>

      {showForm && (
        <div className="pastel-card p-5 max-w-xl bg-[#fff8e6] border border-[#fde68a] rounded-xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#a16207]">Title</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-amber-200 rounded-md outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Upcoming Submission Deadline"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#a16207]">Description</label>
              <textarea
                className="w-full mt-1 p-2 border border-amber-200 rounded-md outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details about the announcement..."
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full bg-[#d97706] text-white hover:bg-[#b45309]">
              Publish Announcement
            </Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse text-[#7c73a0]">Loading...</div>
      ) : announcements.length === 0 ? (
        <div className="text-[#a09ac0] text-center p-8 bg-[#f8f7ff] rounded-xl border border-[#e5e1ff]">
          No announcements available.
        </div>
      ) : (
        <div className="bg-white border border-[#e5e1ff] rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#f8f7ff]">
              <TableRow>
                <TableHead>Announcement</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map(ann => (
                <TableRow key={ann._id}>
                  <TableCell>
                    <div className="font-semibold text-[#3d3654] flex items-center gap-2">
                       <Megaphone className="h-4 w-4 text-[#d97706]" /> {ann.title}
                    </div>
                    <div className="text-xs text-[#7c73a0] mt-1">{ann.description}</div>
                  </TableCell>
                  <TableCell className="text-sm text-[#7c73a0] whitespace-nowrap">
                    {new Date(ann.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="icon" onClick={() => handleDelete(ann._id)} className="text-[#be185d] hover:bg-[#fff1f2]">
                       <Trash2 className="h-4 w-4" />
                     </Button>
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
