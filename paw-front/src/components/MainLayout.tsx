import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Camera, Users, Bot, User, ShoppingBag, Brain, RefreshCw, Calendar, Clock } from "lucide-react";
import { BottomNavigation } from "./BottomNavigation";
import { useCustomPawCursor, CustomPawCursor } from "./DogPawCursor";
import { ConfettiBackground } from "./ConfettiBackground";
import { LayoutSwitcher } from "./LayoutSwitcher";
import { useLayout } from "../contexts/LayoutContext";

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "camera", icon: Camera, label: "Scan" },
  { id: "history", icon: Clock, label: "History" },
  { id: "profile", icon: User, label: "Profile" },
  { id: "pawbot", icon: Bot, label: "Pawbot" },
  { id: "community", icon: Users, label: "Community" },
  { id: "shop", icon: ShoppingBag, label: "Shop" },
  { id: "quiz", icon: Brain, label: "Quiz" },
  { id: "appointments", icon: Calendar, label: "Appointments" },
];

export function MainLayout() {
  const { viewMode } = useLayout();
  const isMobile = viewMode === "mobile";
  const { cursorPos, isHovering, isClicking, isMobile: isMobileDevice } = useCustomPawCursor();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine active screen from pathname
  const getActiveScreen = (pathname: string) => {
    if (pathname === '/home') return 'home';
    if (pathname.startsWith('/home/')) {
      return pathname.split('/')[2]; // Get the third segment (e.g., 'camera' from '/home/camera')
    }
    return pathname.replace('/', '') || 'home';
  };

  const activeScreen = getActiveScreen(location.pathname);
  const showSidebar = isDesktop && (activeScreen === "onboarding" || activeScreen !== "onboarding");

  const handleNavigate = (screen: string) => {
    // Navigate to the correct nested route under /home
    if (screen === 'home') {
      navigate('/home');
    } else {
      navigate(`/home/${screen}`);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Custom Paw Cursor - Desktop Only */}
      <CustomPawCursor
        cursorPos={cursorPos}
        isHovering={isHovering}
        isClicking={isClicking}
        isMobile={isMobileDevice}
      />

      {/* Colorful Falling Confetti Animation */}
      <ConfettiBackground />

      {/* Global Layout Switcher - Always Visible */}
      <LayoutSwitcher />

      <div
        className="min-h-screen relative"
        style={{ background: "#FFF8F3", cursor: isMobileDevice ? 'auto' : 'none' }}
      >
        {/* Desktop Sidebar Navigation */}
        {isDesktop && (
          <div
            className="fixed left-0 top-0 bottom-0 w-72 z-30 overflow-y-auto"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)",
              borderRight: "1px solid #F0E6E1",
              boxShadow: "4px 0 16px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="p-8 flex flex-col h-full">
              {/* Logo Section */}
              <div className="mb-12">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <h1
                    className="mb-1"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "28px",
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #F4A261 0%, #E76F51 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    🐾 Pawdentify
                  </h1>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      color: "#B0BEC5",
                      fontWeight: 500,
                    }}
                  >
                    Your Dog's Story Awaits
                  </p>
                </motion.div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeScreen === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group"
                      whileHover={{ x: 4 }}
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, #F4A26125 0%, #E76F5115 100%)"
                          : "transparent",
                        color: isActive ? "#F4A261" : "#7F8C8D",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: isActive ? 600 : 500,
                      }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-xl"
                          style={{ background: "linear-gradient(180deg, #F4A261 0%, #E76F51 100%)" }}
                          layoutId="activeIndicator"
                        />
                      )}
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 rounded-full"
                          style={{ background: "#F4A261" }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer Section */}
              <motion.div
                className="pt-6 border-t space-y-3"
                style={{ borderColor: "#F0E6E1" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Refresh Button */}
                <motion.button
                  onClick={handleRefresh}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all"
                  style={{
                    background: "linear-gradient(135deg, #F4A26125 0%, #E76F5115 100%)",
                    color: "#F4A261",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1.5px solid #F4A26140",
                  }}
                  whileHover={{
                    scale: 1.05,
                    background: "linear-gradient(135deg, #F4A26135 0%, #E76F5125 100%)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </motion.button>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    color: "#CFD8DC",
                    textAlign: "center",
                  }}
                >
                  v1.0.0 • Made with 🐾
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          className="app-container"
          style={{
            marginLeft: isDesktop ? "288px" : "0",
            paddingLeft: isDesktop ? "0" : "0",
            paddingRight: isDesktop ? "0" : "0",
            transition: "margin-left 0.3s ease",
          }}
        >
          <Outlet />
        </div>

        <BottomNavigation
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
        />
      </div>
    </>
  );
}
