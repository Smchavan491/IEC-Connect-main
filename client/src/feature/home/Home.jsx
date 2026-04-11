import {
  FileText,
  ClipboardCheck,
  Users,
  ShieldCheck,
  ArrowRight,
  Star,
  Mail,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import ContactAndFeedback from "../../components/shared/ContactAndFeedback";
export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-16">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ede9ff] via-[#fce8f3] to-[#e0f7f1] p-10 border border-[#e5e1ff]">
        <div className="max-w-2xl relative z-10">
          <span className="inline-block mb-4 text-xs px-3 py-1 rounded-full bg-white/70 text-[#6d5ce8] border border-[#d4ccff] font-medium backdrop-blur-sm">
            Institutional Ethics Committee Platform
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-[#3d3654] leading-snug">
            Welcome{user?.name ? `, ${user.name}` : ""} 👋
          </h1>

          <p className="mt-4 text-[#7c73a0] text-lg leading-relaxed">
            EthixPortal is a secure digital platform for managing IEC workflows —
            from research submission to ethical review, approval, and compliance.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#a78bfa] to-[#8b7cf6] hover:from-[#9b72fb] hover:to-[#7c6de8] text-white rounded-xl shadow-sm font-semibold"
              asChild
            >
              <Link to="/proposals/new">
                Submit New Proposal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/80 border-[#e5e1ff] text-[#6d5ce8] hover:bg-white rounded-xl font-semibold"
              asChild
            >
              <Link to="/documents">View Approved Research</Link>
            </Button>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#c4b8ff]/20 blur-3xl" />
        <div className="absolute right-16 bottom-0 w-40 h-40 rounded-full bg-[#f9a8d4]/20 blur-2xl" />
      </section>

      {/* ── QUICK ACTIONS ── */}
      <section>
        <h2 className="text-lg font-bold text-[#3d3654] mb-5">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ActionCard
            icon={<FileText className="h-5 w-5 text-[#8b7cf6]" />}
            iconBg="bg-[#ede9ff]"
            title="Submit Proposal"
            text="Create and submit a new research proposal for IEC review."
            onClick={() => navigate("/proposals/new")}
          />
          <ActionCard
            icon={<ClipboardCheck className="h-5 w-5 text-[#2d7a65]" />}
            iconBg="bg-[#e0f7f1]"
            title="Track Review Status"
            text="Monitor approval progress and reviewer feedback."
            onClick={() => navigate("/documents")}
          />
          <ActionCard
            icon={<Users className="h-5 w-5 text-[#a0366e]" />}
            iconBg="bg-[#fce8f3]"
            title="Committee Activity"
            text="View assignments and committee decisions."
          />
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section className="bg-white border border-[#e5e1ff] rounded-2xl p-8">
        <h2 className="text-lg font-bold text-[#3d3654] mb-1">IEC Review Workflow</h2>
        <p className="text-[#7c73a0] text-sm mb-7 max-w-xl">
          A transparent, auditable workflow aligned with ICMR and institutional ethical guidelines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <WorkflowCard
            step="1"
            title="Submission"
            text="Researcher submits a structured proposal with all required documentation."
            color="lavender"
          />
          <WorkflowCard
            step="2"
            title="Ethical Review"
            text="Assigned reviewers evaluate the proposal against IEC standards."
            color="mint"
          />
          <WorkflowCard
            step="3"
            title="Approval & Monitoring"
            text="Approved proposals receive clearance and remain under compliance monitoring."
            color="rose"
          />
        </div>
      </section>

      <ContactAndFeedback />

    </div>
  );
}

/* ── Sub-components ── */

function ActionCard({ icon, iconBg, title, text, onClick }) {
  return (
    <div
      className="pastel-card p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-[#3d3654] mb-1">{title}</h3>
      <p className="text-xs text-[#7c73a0] leading-relaxed">{text}</p>
    </div>
  );
}

function WorkflowCard({ step, title, text, color }) {
  const styles = {
    lavender: { badge: "bg-[#ede9ff] text-[#6d5ce8] border-[#d4ccff]", num: "text-[#8b7cf6]" },
    mint: { badge: "bg-[#e0f7f1] text-[#2d7a65] border-[#b2edd9]", num: "text-[#059669]" },
    rose: { badge: "bg-[#fce8f3] text-[#a0366e] border-[#f5bfde]", num: "text-[#db2777]" },
  };
  const s = styles[color];
  return (
    <div className="pastel-card p-6">
      <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full border font-semibold mb-3 ${s.badge}`}>
        Step {step}
      </span>
      <h3 className="text-sm font-bold text-[#3d3654] mb-2">{title}</h3>
      <p className="text-xs text-[#7c73a0] leading-relaxed">{text}</p>
    </div>
  );
}

function FeedbackCard({ name, role, text }) {
  return (
    <div className="pastel-card p-6">
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-[#fcd34d] text-[#fcd34d]" />
        ))}
      </div>
      <p className="text-sm text-[#7c73a0] leading-relaxed mb-4">"{text}"</p>
      <div className="text-sm font-semibold text-[#3d3654]">{name}</div>
      <div className="text-xs text-[#a09ac0] mt-0.5">{role}</div>
    </div>
  );
}