import { Outlet } from "react-router-dom";
import Header from "./Header";
import AnimatedBackground from "./AnimatedBackground"; // 1. Import the new component

const Layout = () => {
  return (
    // The main container needs to allow stacking elements
    <div className="relative min-h-screen">
      <AnimatedBackground />
      {/* The z-10 class ensures your content appears on top of the background */}
      <div className="relative z-10">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
