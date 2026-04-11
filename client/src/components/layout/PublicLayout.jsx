import { Outlet } from "react-router-dom";
import Background from "../ui/Background";

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen">
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}