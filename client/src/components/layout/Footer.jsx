export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#e5e1ff] bg-white">
      <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7c73a0]">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-[#8b7cf6]">EthixPortal</span>. All rights reserved.
        </p>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span className="tracking-wide">Institutional Ethics Committee System</span>
        </div>
      </div>
    </footer>
  );
}