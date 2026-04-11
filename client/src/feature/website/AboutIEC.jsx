import { Shield, Users, ClipboardCheck, Award } from "lucide-react";

const members = [
  { role: "Chairperson", desc: "Independent medical professional overseeing all IEC proceedings." },
  { role: "Member Secretary", desc: "Coordinates submissions, schedules meetings, and maintains records." },
  { role: "Basic Medical Scientist", desc: "Provides scientific expertise in biomedical research methodology." },
  { role: "Clinician", desc: "Evaluates clinical aspects and participant safety considerations." },
  { role: "Legal Expert", desc: "Ensures regulatory compliance and legal standing of protocols." },
  { role: "Lay Person / Patient Advocate", desc: "Represents the community perspective and participant interests." },
  { role: "Philosopher / Ethicist", desc: "Provides ethical analysis and moral reasoning for complex cases." },
  { role: "Social Scientist", desc: "Reviews socio-cultural impact and community relevance of studies." },
];

const functions = [
  { icon: <ClipboardCheck className="h-5 w-5" />, title: "Protocol Review", desc: "Thorough evaluation of all submitted research protocols for scientific rigor and ethical soundness." },
  { icon: <Shield className="h-5 w-5" />, title: "Participant Protection", desc: "Ensuring the rights, safety, and well-being of all research participants are protected." },
  { icon: <Award className="h-5 w-5" />, title: "Compliance Oversight", desc: "Monitoring ongoing studies for adherence to approved protocols and regulatory standards." },
  { icon: <Users className="h-5 w-5" />, title: "Community Representation", desc: "Including diverse stakeholders to represent social, ethical, cultural, and legal perspectives." },
];

export default function AboutIEC() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#ede9ff] to-[#f8f7ff] py-16 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e5e1ff] text-[#8b7cf6] text-xs font-semibold shadow-sm mb-5">
            <Shield className="h-3.5 w-3.5" /> Institutional Ethics Committee
          </div>
          <h1 className="text-4xl font-extrabold text-[#3d3654] mb-4">About IEC</h1>
          <p className="text-[#7c73a0] text-lg leading-relaxed max-w-2xl mx-auto">
            The Institutional Ethics Committee (IEC) of Dr. Vasantrao Pawar Medical College, Hospital &amp; Research Centre, Nashik is constituted as per ICMR/CDSCO guidelines to protect the rights and welfare of human research participants.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#3d3654] mb-4">Our Mission</h2>
            <p className="text-[#7c73a0] leading-relaxed mb-4">
              The IEC operates with the core mission of ensuring that all biomedical and health research conducted at our institution is ethically sound, scientifically valid, and compliant with all applicable national and international guidelines.
            </p>
            <p className="text-[#7c73a0] leading-relaxed">
              We are committed to upholding the principles of autonomy, beneficence, non-maleficence, and justice as laid out in the Declaration of Helsinki, the Belmont Report, and ICMR National Ethical Guidelines for Biomedical and Health Research involving Human Participants.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#3d3654] mb-4">Regulatory Framework</h2>
            <ul className="space-y-3">
              {[
                "ICMR National Ethical Guidelines 2017",
                "CDSCO Schedule Y and New Drugs &amp; Clinical Trials Rules, 2019",
                "Declaration of Helsinki (2013 revision)",
                "ICH-GCP E6 (R2) Guidelines",
                "National Accreditation Board for Hospitals (NABH) Standards",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#7c73a0]">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#8b7cf6] shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Functions */}
      <section className="bg-[#f8f7ff] py-14 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#3d3654] mb-8 text-center">Key Functions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {functions.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-[#e5e1ff] p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[#ede9ff] text-[#8b7cf6] flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-sm font-bold text-[#3d3654] mb-2">{f.title}</h3>
                <p className="text-xs text-[#7c73a0] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committee Composition */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="text-2xl font-bold text-[#3d3654] mb-8 text-center">Committee Composition</h2>
        <p className="text-[#7c73a0] text-center max-w-2xl mx-auto mb-8 text-sm">
          The IEC is constituted with a diverse and interdisciplinary membership to ensure well-rounded review of all research proposals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((m) => (
            <div key={m.role} className="rounded-2xl border border-[#e5e1ff] bg-white p-5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#8b7cf6] flex items-center justify-center mb-3">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-[#3d3654] mb-1">{m.role}</h4>
              <p className="text-xs text-[#7c73a0] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
