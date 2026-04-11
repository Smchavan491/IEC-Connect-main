import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { Shield, Menu, X, ChevronRight, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/about",        label: "About IEC" },
  { to: "/guidelines",   label: "Submission Guidelines" },
  { to: "/documents-required", label: "Required Documents" },
  { to: "/announcements", label: "Announcements" },
  { to: "/contact",      label: "Contact" },
];

export default function WebsiteLayout() {
  const [open, setOpen] = useState(false);
  const { status, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7ff]">
      {/* ── Top Bar ── */}
      <div className="bg-[#3d3654] text-[#d4ccff] text-[11px] py-1.5 px-5 flex justify-between items-center">
        <span>Dr. Vasantrao Pawar Medical College, Hospital &amp; Research Centre, Nashik</span>
        <a href="mailto:iec@dvpmcnashik.org" className="hover:text-white transition-colors hidden sm:block">
          iec@dvpmcnashik.org
        </a>
      </div>

      {/* ── Main Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e1ff] shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="bg-gradient-to-br from-[#a78bfa] to-[#8b7cf6] p-2 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#3d3654] leading-tight">EthixPortal</p>
              <p className="text-[10px] text-[#7c73a0] leading-tight tracking-wide uppercase">IEC Management System</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#ede9ff] text-[#8b7cf6] font-semibold"
                      : "text-[#7c73a0] hover:text-[#8b7cf6] hover:bg-[#f5f3ff]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {status === "authenticated" ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl bg-[#ede9ff] text-[#8b7cf6] text-sm font-bold hover:bg-[#e5e1ff] transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-[#e11d48] text-sm font-bold hover:bg-[#fff1f2] transition-all flex items-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#8b7cf6] text-white text-sm font-bold shadow-sm hover:shadow-md hover:from-[#9b72fb] transition-all flex items-center gap-1.5"
              >
                Login to Portal <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-[#7c73a0] hover:bg-[#f0eeff] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="lg:hidden border-t border-[#e5e1ff] bg-white px-4 pb-4">
            <ul className="flex flex-col gap-1 pt-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#ede9ff] text-[#8b7cf6] font-semibold"
                          : "text-[#7c73a0] hover:text-[#8b7cf6] hover:bg-[#f5f3ff]"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2 border-t border-[#e5e1ff] mt-1 space-y-2">
                {status === "authenticated" ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#ede9ff] text-[#8b7cf6] text-sm font-bold w-full"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[#e11d48] bg-[#fff1f2] text-sm font-bold w-full"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#8b7cf6] text-white text-sm font-bold w-full shadow-sm"
                  >
                    Login to Portal <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* ── Page Content ── */}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#3d3654] text-[#c4b8ff]">
        <div className="max-w-7xl mx-auto px-5 pt-12 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="bg-white/10 p-2 rounded-xl">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-[15px]">EthixPortal</span>
              </div>
              <p className="text-xs leading-relaxed text-[#a09ac0]">
                Institutional Ethics Committee of Dr. Vasantrao Pawar Medical College, Hospital &amp; Research Centre, Nashik.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portal */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Researcher Portal</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/forgot-password" className="hover:text-white transition-colors">Forgot Password</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-xs text-[#a09ac0]">
                <li>Dr. Vasantrao Pawar Medical College</li>
                <li>Nashik, Maharashtra</li>
                <li><a href="mailto:iec@dvpmcnashik.org" className="hover:text-white transition-colors">iec@dvpmcnashik.org</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7c73a0]">
            <p>© {new Date().getFullYear()} EthixPortal — Institutional Ethics Committee System. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Dr. Vasantrao Pawar Medical College, Hospital &amp; Research Centre</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
