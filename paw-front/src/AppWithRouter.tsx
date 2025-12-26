import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeIntroScreen } from "./components/WelcomeIntroScreen";
import { LoginScreen } from "./components/LoginScreen";
import { VetLoginScreen } from "./components/VetLoginScreen";
import { VetOnboardingScreen, VetData } from "./components/VetOnboardingScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { PetDoctorsSection } from "./components/PetDoctorsSection";
import VetDashboardSection from "./components/VetDashboardSection";
import { HomeScreen } from "./components/HomeScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { HistoryScreen } from "./components/HistoryScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { CameraScreen } from "./components/CameraScreen";
import { PawbotScreen } from "./components/PawbotScreen";
import { CommunityScreen } from "./components/CommunityScreen";
import { BirthdayCelebration } from "./components/BirthdayCelebration";
import { PetAccessoriesScreen } from "./components/PetAccessoriesScreen";
import { DogQuizScreen } from "./components/DogQuizScreen";
import { MainLayout } from "./components/MainLayout";
import { useAuth } from "./contexts/AuthContext";
import { getDogProfile } from "./services/dogProfileStorage";
import BookAppointment from "./components/BookAppointment";

interface DogData {
  name: string;
  age: string;
  birthday: string;
  hasAudio: boolean;
}

function AppWithRouter() {
  const { needsOnboarding } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"user" | "vet" | null>(null);
  const [showVetLogin, setShowVetLogin] = useState(false);
  const [vetCurrentScreen, setVetCurrentScreen] = useState<"login" | "onboarding" | "petDoctors" | "dashboard">("login");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [dogData, setDogData] = useState<DogData | null>(null);
  const [vetData, setVetData] = useState<VetData | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [showBirthdayCelebration, setShowBirthdayCelebration] = useState(false);

  // On app mount, load dog profile from localStorage so onboarding doesn't reappear
  useEffect(() => {
    try {
      const p = getDogProfile();
      if (p) {
        setDogData({ name: p.name, age: p.age, birthday: p.birthday, hasAudio: false });
        setHasCompletedOnboarding(true);
      }
    } catch (e) {}
  }, []);

  // Check if today is dog's birthday
  useEffect(() => {
    if (dogData?.birthday && hasCompletedOnboarding && userType === "user" && dogData.name !== "Future Companion") {
      const today = new Date();
      const birthday = new Date(dogData.birthday);
      const isBirthday =
        today.getMonth() === birthday.getMonth() &&
        today.getDate() === birthday.getDate();

      // Only show birthday celebration if it's actually the birthday AND the user has been using the app
      // (not immediately after onboarding)
      if (isBirthday && location.pathname === "/home") {
        // Add a delay to ensure the user has had time to use the app
        const onboardingTime = localStorage.getItem('onboardingCompleted');
        const now = Date.now();

        if (!onboardingTime) {
          localStorage.setItem('onboardingCompleted', now.toString());
        } else {
          const timeSinceOnboarding = now - parseInt(onboardingTime);
          // Only show birthday if it's been at least 5 minutes since onboarding (300000ms)
          if (timeSinceOnboarding > 300000) {
            setTimeout(() => {
              setShowBirthdayCelebration(true);
            }, 1000);
          }
        }
      }
    }
  }, [dogData, hasCompletedOnboarding, userType, location.pathname]);

  // Set onboarding as active screen for users who need onboarding
  useEffect(() => {
    if (userType === "user" && needsOnboarding && !hasCompletedOnboarding) {
      navigate("/onboarding");
    }
  }, [userType, needsOnboarding, hasCompletedOnboarding, navigate]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserType("user");
  };

  const handleShowVetLogin = () => {
    setShowVetLogin(true);
  };

  const handleVetLogin = () => {
    setIsLoggedIn(true);
    setUserType("vet");
  };

  const handleSetVetScreen = (screen: string) => {
    setVetCurrentScreen(screen as "login" | "onboarding" | "petDoctors" | "dashboard");
  };

  const handleVetOnboardingComplete = (data: VetData) => {
    setVetData(data);
    setHasCompletedOnboarding(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleOnboardingComplete = async (data: DogData) => {
    setDogData(data);
    setHasCompletedOnboarding(true);
    // Set onboarding completion time to prevent immediate birthday celebration
    localStorage.setItem('onboardingCompleted', Date.now().toString());
    navigate("/home");
  };

  const handleQuizRedirect = () => {
    setHasCompletedOnboarding(true);
    // Set onboarding completion time to prevent immediate birthday celebration
    localStorage.setItem('onboardingCompleted', Date.now().toString());
    // Set dummy data for non-pet owners
    const dummyData = {
      name: "Future Companion",
      age: "0",
      birthday: new Date().toISOString().split('T')[0],
      hasAudio: false,
    };
    setDogData(dummyData);
    navigate("/quiz");
  };

  const handleTakePhoto = () => {
    navigate("/camera");
  };

  const handlePhotoTaken = (imageData: string, predictions: any) => {
    setScannedImage(imageData);
    setScanResult(predictions);
    navigate("/results");
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  // Screen transition variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  let content;

  if (showWelcome) {
    content = <WelcomeIntroScreen onComplete={handleWelcomeComplete} />;
  } else if (showVetLogin && !isLoggedIn) {
    if (vetCurrentScreen === "login") {
      content = <VetLoginScreen onBack={() => setShowVetLogin(false)} onVetLogin={handleVetLogin} setScreen={handleSetVetScreen} />;
    } else if (vetCurrentScreen === "onboarding") {
      content = (
        <VetOnboardingScreen
          onComplete={(data) => {
            handleVetOnboardingComplete(data);
            setVetCurrentScreen("dashboard");
          }}
        />
      );
    } else if (vetCurrentScreen === "dashboard") {
      content = <VetDashboardSection />;
    } else if (vetCurrentScreen === "petDoctors") {
      content = <PetDoctorsSection />;
    }
  } else if (!isLoggedIn) {
    content = <LoginScreen onLogin={handleLogin} onVetLogin={handleShowVetLogin} />;
  } else if (userType === "vet" && !hasCompletedOnboarding) {
    content = (
      <VetOnboardingScreen
        onComplete={(data) => {
          handleVetOnboardingComplete(data);
          setVetCurrentScreen("dashboard");
        }}
      />
    );
  } else if (userType === "vet" && hasCompletedOnboarding && vetCurrentScreen === "dashboard") {
    content = <VetDashboardSection />;
  } else if (showBirthdayCelebration && dogData) {
    content = (
      <BirthdayCelebration
        dogName={dogData.name}
        onClose={() => setShowBirthdayCelebration(false)}
      />
    );
  } else {
    content = (
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/onboarding" element={<MainLayout />}>
          <Route index element={
            <motion.div
              key="onboarding"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <OnboardingScreen
                onComplete={handleOnboardingComplete}
                onQuizRedirect={handleQuizRedirect}
                setScreen={(screen) => navigate(`/${screen}`)}
              />
            </motion.div>
          } />
        </Route>
        <Route path="/home" element={<MainLayout />}>
          <Route index element={
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <HomeScreen
                onTakePhoto={handleTakePhoto}
                dogName={dogData?.name}
              />
            </motion.div>
          } />
          <Route path="camera" element={
            <motion.div
              key="camera"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <CameraScreen
                onBack={handleBackToHome}
                onPhotoTaken={handlePhotoTaken}
              />
            </motion.div>
          } />
          <Route path="appointments" element={
            <motion.div
              key="appointments"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <BookAppointment />
            </motion.div>
          } />
          <Route path="results" element={
            <motion.div
              key="results"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <ResultsScreen onBack={handleBackToHome} result={scanResult} image={scannedImage} />
            </motion.div>
          } />
          <Route path="history" element={
            <motion.div
              key="history"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <HistoryScreen onViewResult={(entry) => {
                // Build a minimal result shape expected by ResultsScreen
                setScanResult({
                  predictions: [
                    {
                      breed: entry.predictedBreed,
                      confidence: entry.confidence ?? 0,
                      description: undefined,
                    },
                  ],
                });
                setScannedImage(entry.image || null);
                navigate('/results');
              }} />
            </motion.div>
          } />
          <Route path="pawbot" element={
            <motion.div
              key="pawbot"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <PawbotScreen />
            </motion.div>
          } />
          <Route path="community" element={
            <motion.div
              key="community"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <CommunityScreen />
            </motion.div>
          } />
          <Route path="profile" element={
            <motion.div
              key="profile"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <ProfileScreen dogData={dogData} />
            </motion.div>
          } />
          <Route path="shop" element={
            <motion.div
              key="shop"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <PetAccessoriesScreen />
            </motion.div>
          } />
          <Route path="quiz" element={
            <motion.div
              key="quiz"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <DogQuizScreen />
            </motion.div>
          } />
        </Route>
        {/* Fallback route for unknown paths */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  }

  return content;
}

export default AppWithRouter;
