import { Shield, Menu, X, LogOut, Bell } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linkClass =
  "block py-2 px-3 text-[#7c73a0] hover:text-[#8b7cf6] transition-colors text-sm font-medium rounded-lg hover:bg-[#f0eeff]";

const activeLinkClass =
  "block py-2 px-3 text-[#8b7cf6] bg-[#ede9ff] font-semibold text-sm rounded-lg";

function navClass({ isActive }) {
  return isActive ? activeLinkClass : linkClass;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, status } = useAuth();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e5e1ff]">
      <div className="container mx-auto flex items-center py-3 px-5">

        {/* Brand */}
        <div className="flex items-center flex-1">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-[#a78bfa] to-[#8b7cf6] p-2 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-[#3d3654] leading-tight">
                EthixPortal
              </h1>
              <p className="text-[10px] text-[#7c73a0] leading-tight tracking-wide uppercase">
                IEC Management
              </p>
            </div>
          </NavLink>
        </div>

        {/* Desktop Nav */}
        {status === "authenticated" && user?.role !== "admin" && (
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center gap-1">
              <li>
                <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/documents" className={navClass}>Documents</NavLink>
              </li>
            </ul>
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center justify-end flex-1 gap-3">
          {status === "authenticated" ? (
            <>
              {/* User Info & Notifications */}
              <div className="hidden sm:flex items-center gap-4 border-r border-[#e5e1ff] pr-4 py-1">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-[#3d3654]">{user?.name}</span>
                  <span className="text-[10px] text-[#8b7cf6] uppercase font-bold tracking-wider">
                    {user?.role}
                  </span>
                </div>
                
                <Link to="/announcements" className="p-2 rounded-xl text-[#7c73a0] hover:text-[#8b7cf6] hover:bg-[#f0eeff] transition-all relative group" title="Announcements & Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#e11d48] rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
                </Link>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#e11d48] bg-[#fff1f2] hover:bg-[#ffe4e6] border border-[#ffe4e6] transition-all shadow-sm active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-xl text-[#7c73a0] hover:bg-[#f0eeff] transition-colors border border-[#e5e1ff]"
                onClick={() => setOpen(!open)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          ) : (
            status !== "loading" && (
              <Link
                to="/login"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#8b7cf6] text-white text-sm font-bold shadow-md hover:shadow-lg hover:brightness-105 transition-all active:scale-95"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>


      {/* Mobile Menu */}
      {open && status === "authenticated" && (
        <div className="md:hidden bg-white border-t border-[#e5e1ff] px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {user?.role !== "admin" && (
              <>
                <li>
                  <NavLink onClick={() => setOpen(false)} to="/dashboard" className={navClass}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={() => setOpen(false)} to="/documents" className={navClass}>
                    Documents
                  </NavLink>
                </li>
              </>
            )}
            <li className={user?.role !== "admin" ? "border-t border-[#e5e1ff] mt-2 pt-2" : "pt-2"}>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-[#e11d48] py-2 px-3 rounded-lg hover:bg-[#fff1f2] w-full transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}