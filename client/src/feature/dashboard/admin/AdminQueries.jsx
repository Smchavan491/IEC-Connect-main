import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Reply, CheckCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchQueries = async () => {
    try {
      const res = await api.get("/admin-data/queries");
      setQueries(res.data);
    } catch {
      toast.error("Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleReply = async (id) => {
    if (!replyText.trim()) return toast.error("Response cannot be empty");

    try {
      await api.put(`/admin-data/queries/${id}/reply`, { response: replyText });
      toast.success("Query resolved");
      setReplyId(null);
      setReplyText("");
      fetchQueries();
    } catch {
      toast.error("Failed to submit response");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#3d3654]">Contact Queries</h2>
          <p className="text-sm text-[#7c73a0]">Manage user contacts and feedback.</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse text-[#7c73a0]">Loading queries...</div>
      ) : queries.length === 0 ? (
        <div className="text-[#a09ac0] text-center p-8 bg-[#f8f7ff] rounded-xl border border-[#e5e1ff]">
          No queries found.
        </div>
      ) : (
        <div className="bg-white border border-[#e5e1ff] rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#f8f7ff]">
              <TableRow>
                <TableHead className="w-48">Name & Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-32">Date</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="text-right w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries.map(q => (
                <TableRow key={q._id}>
                  <TableCell>
                    <div className="font-semibold text-[#3d3654]">{q.name}</div>
                    <div className="flex items-center gap-1 text-[10px] text-[#7c73a0] mt-1 italic">
                      <Mail className="h-3 w-3" /> {q.email}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-xs text-[#3d3654] bg-[#f8f7ff] p-2 rounded-md border border-[#e5e1ff]">
                      {q.message}
                    </p>
                    {q.reply && (
                      <div className="mt-2 p-2 bg-[#e0f7f1] rounded-md border border-[#b2edd9]">
                        <p className="text-[10px] font-bold text-[#2d7a65] mb-1">Admin Response:</p>
                        <p className="text-[11px] text-[#1e5c4a] italic">{q.reply}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[10px] text-[#7c73a0]">
                      <Calendar className="h-3 w-3" />
                      {new Date(q.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {q.status === "Pending" ? (
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-200">
                        Replied
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {q.status === "Pending" ? (
                      replyId === q._id ? (
                        <div className="mt-2 text-right min-w-[200px]">
                          <textarea 
                            className="w-full text-xs border border-[#e5e1ff] p-2 rounded-lg mb-2 focus:ring-2 focus:ring-[#8b7cf6] outline-none min-h-[80px]"
                            placeholder="Type your reply here..."
                            value={replyText}
                            onChange={(e)=>setReplyText(e.target.value)}
                          />
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setReplyId(null)} className="h-7 text-[10px] text-[#a09ac0]">Cancel</Button>
                            <Button size="sm" onClick={() => handleReply(q._id)} className="h-7 text-[10px] bg-[#8b7cf6] text-white hover:bg-[#7c6de8]">Submit Reply</Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-[#6d5ce8] border-[#e5e1ff] hover:bg-[#f0eeff] h-8 px-3 rounded-xl text-xs font-bold gap-1.5"
                          onClick={() => setReplyId(q._id)}
                        >
                          <Reply className="h-3.5 w-3.5" /> Reply
                        </Button>
                      )
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[#059669] flex items-center gap-1 text-[10px] font-bold">
                          <CheckCircle className="h-3.5 w-3.5" /> Resolved
                        </span>
                      </div>
                    )}
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
