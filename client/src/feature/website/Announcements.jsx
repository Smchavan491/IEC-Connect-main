import { useState, useEffect } from "react";
import { Bell, Calendar, ChevronRight, AlertTriangle, Info, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get("/public/announcements");
        setAnnouncements(res.data);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#ede9ff] to-[#f8f7ff] py-16 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e5e1ff] text-[#8b7cf6] text-xs font-semibold shadow-sm mb-5">
            <Bell className="h-3.5 w-3.5" /> Latest Updates
          </div>
          <h1 className="text-4xl font-extrabold text-[#3d3654] mb-4">Announcements</h1>
          <p className="text-[#7c73a0] text-lg leading-relaxed max-w-2xl mx-auto">
            Stay informed with the latest notices, meeting schedules, and updates from the IEC.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="max-w-4xl mx-auto px-5 py-12 space-y-5">
        {loading ? (
          <div className="text-center py-10 text-[#7c73a0] animate-pulse">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-10 text-[#a09ac0] bg-[#f8f7ff] rounded-2xl border border-[#e5e1ff]">No current announcements.</div>
        ) : (
          announcements.map((a) => (
            <article
              key={a._id}
              className="bg-white rounded-2xl border border-[#e5e1ff] p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5 p-2 rounded-xl bg-[#f8f7ff] border border-[#e5e1ff]">
                  <Megaphone className="h-4 w-4 text-[#0369a1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]">
                      Update
                    </span>
                    <span className="text-xs text-[#a09ac0] flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(a.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[#3d3654] mb-2">{a.title}</h2>
                  <p className="text-sm text-[#7c73a0] leading-relaxed whitespace-pre-wrap">{a.description}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Subscribe CTA */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div className="bg-gradient-to-r from-[#ede9ff] to-[#fce8f3] rounded-3xl p-8 text-center">
          <Bell className="h-8 w-8 text-[#8b7cf6] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#3d3654] mb-2">Stay Updated</h2>
          <p className="text-sm text-[#7c73a0] mb-5">
            Researchers with portal accounts receive real-time email notifications about proposal status changes, review decisions, and important announcements.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#8b7cf6] text-white font-bold text-sm shadow hover:shadow-md transition-all"
            >
              Register for Updates <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-[#e5e1ff] text-[#7c73a0] font-semibold text-sm hover:bg-[#f5f3ff] transition-all"
            >
              Contact IEC Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
