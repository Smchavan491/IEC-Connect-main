import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7ff] overflow-x-hidden">
      <Navbar />

      <main className="pt-20 px-4 flex-1">
        <div className="max-w-7xl mx-auto py-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}