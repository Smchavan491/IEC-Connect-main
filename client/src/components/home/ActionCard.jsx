import { ArrowRight } from "lucide-react";

export default function ActionCard({ icon, title, description }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition" />
      </div>

      <h3 className="font-medium text-slate-800 mb-1">
        {title}
      </h3>
      <p className="text-slate-600 text-sm">
        {description}
      </p>
    </div>
  );
}