export default function WorkflowStep({ step, title, text }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <div className="text-sm font-semibold text-blue-600 mb-2">
        Step {step}
      </div>
      <h3 className="font-medium text-slate-800 mb-1">
        {title}
      </h3>
      <p className="text-slate-600 text-sm">
        {text}
      </p>
    </div>
  );
}