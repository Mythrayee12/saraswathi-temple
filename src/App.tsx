import React, { useState, useEffect } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, onSnapshot, DocumentData } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { 
  Loader2, 
  Phone, 
  MapPin, 
  Heart, 
  Building2,
  Hammer,
  Users,
  Settings,
  BookOpen,
  Utensils,
  TreePine,
  Sparkles,
  Target,
  IndianRupee,
  Calendar,
  Palette,
  Music,
  GraduationCap,
  Home,
  Star,
  CheckCircle,
  Clock,
  Award,
  Crown
} from 'lucide-react';

// Define the type for your temple information based on your Firestore document structure
interface TempleInfo {
  name: string;
  mission: string;
  location: string;
  quote: string;
  callToAction: string;
  philanthropyText: string;
  contactName: string;
  contactRole: string;
  contactPhone: string;
  etchingText: string;
  knowledgeText: string;
  templeImage1: string;
  templeImage2: string;
}

// Your actual web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4JaX8pHwKdDiUAjXFxtjgifMZL01ULj8",
  authDomain: "saraswathi-temple.firebaseapp.com",
  projectId: "saraswathi-temple",
  storageBucket: "saraswathi-temple.firebasestorage.app",
  messagingSenderId: "844534143311",
  appId: "1:844534143311:web:e4e3a6c77b8d3c6b8b4d3a",
  measurementId: "G-2SZHS7TNYC"
};

const appId: string = firebaseConfig.projectId;

function App() {
  // Properly typed useState hooks
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [templeInfo, setTempleInfo] = useState<TempleInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Firebase
    try {
      const app: FirebaseApp = initializeApp(firebaseConfig);
      const firestoreDb: Firestore = getFirestore(app);
      const firebaseAuth: Auth = getAuth(app);

      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // Sign in anonymously
      const signIn = async (): Promise<void> => {
        try {
          await signInAnonymously(firebaseAuth);
        } catch (e) {
          console.error("Firebase authentication error:", e);
          setError("Failed to authenticate. Please try again.");
        }
      };
      signIn();

      // Listen for auth state changes to get the user ID
      const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setUserId(user.uid);
          console.log("User ID:", user.uid);
        } else {
          setUserId(null);
          console.log("No user signed in.");
        }
      });
      return () => unsubscribeAuth();
    } catch (e) {
      console.error("Firebase initialization error:", e);
      setError("Failed to initialize Firebase. Check console for details.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch temple info only if db and userId are available
    if (db && userId) {
      const templeDocRef = doc(db, `artifacts/${appId}/public/data/templeInfo`, 'main');

      const unsubscribe = onSnapshot(templeDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          setTempleInfo(data as TempleInfo);
          console.log("Temple info fetched:", data);
        } else {
          console.log("No temple info found. Initializing with default data.");
          const defaultTempleData: TempleInfo = {
            name: "Antariksha Bhagavati Chaitanya Devasthanam",
            mission: "Building the Cosmic Saraswathi Temple",
            location: "Mahabalipuram, Tamil Nadu | 2 Acres of Divine Bliss",
            quote: "In the timeless land of Mahabalipuram, a radiant vision unfolds – a grand temple dedicated to Maa Saraswathi, the embodiment of cosmic knowledge and pure wisdom.",
            callToAction: "JOIN THIS HISTORIC MISSION. BE A PART OF THIS SACRED LEGACY",
            philanthropyText: "Your philanthropic contribution will help manifest a temple that celebrates Vedic knowledge, art, and cosmic consciousness.",
            contactName: "Shri Nandakumar",
            contactRole: "Project Coordinator",
            contactPhone: "80151 90009",
            etchingText: "Let your name be etched in the spiritual legacy of Bharat by contributing to the Cosmic Saraswathi Temple.",
            knowledgeText: "Knowledge is eternal. Your support makes it divine.",
            templeImage1: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400",
            templeImage2: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=400"
          };
          try {
            await setDoc(templeDocRef, defaultTempleData);
            setTempleInfo(defaultTempleData);
            console.log("Default temple info set successfully.");
          } catch (e) {
            console.error("Error setting default temple info:", e);
            setError("Failed to set initial temple data.");
          }
        }
        setLoading(false);
      }, (err) => {
        console.error("Error fetching temple info:", err);
        setError("Failed to load temple information. Please check your network.");
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [db, userId]);

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <Loader2 className="relative h-12 w-12 sm:h-16 sm:w-16 animate-spin text-orange-600 mb-6" />
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Loading divine wisdom...
          </h2>
          <p className="text-muted-foreground max-w-md text-sm sm:text-base">
            Connecting to the sacred realm of the Cosmic Saraswathi Temple
          </p>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <Card className="max-w-md w-full border-0 shadow-2xl mx-4">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 text-lg sm:text-xl">
              <Crown className="h-5 w-5" />
              Divine Intervention Required
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">We encountered an error while loading the temple information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg mb-4">
              <p className="text-xs sm:text-sm font-mono text-red-800 break-words">{error}</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-sm sm:text-base">Here's what you can try:</p>
              <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>Check your internet connection</li>
                <li>Try refreshing the page in a few moments</li>
                <li>If the problem persists, please contact support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.1),transparent_50%)]"></div>
      
      {/* Header */}
      <header className="relative bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-800/90 to-red-800/90 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="py-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent text-gradient-large">
                {templeInfo?.name}
              </h1>
            </div>
            <nav className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base">
              <a href="#home" className="hover:text-yellow-200 transition-all duration-300 hover:scale-105 px-2 py-1">Home</a>
              <a href="#overview" className="hover:text-yellow-200 transition-all duration-300 hover:scale-105 px-2 py-1">Overview</a>
              <a href="#phases" className="hover:text-yellow-200 transition-all duration-300 hover:scale-105 px-2 py-1">Phases</a>
              <a href="#vision" className="hover:text-yellow-200 transition-all duration-300 hover:scale-105 px-2 py-1">Vision</a>
              <a href="#facilities" className="hover:text-yellow-200 transition-all duration-300 hover:scale-105 px-2 py-1">Facilities</a>
              <a href="#about-us" className="hover:text-yellow-200 transition-all duration-300 hover:scale-105 px-2 py-1">About Us</a>
              <a href="#contact" className="hover:text-yellow-200 transition-all duration-300 hover:scale-105 px-2 py-1">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto p-4 sm:p-6 space-y-12 sm:space-y-16 lg:space-y-20">
        {/* Hero Section */}
        <section id="home" className="pt-8 sm:pt-12">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-orange-50 to-amber-50 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-red-100/20"></div>
            <CardContent className="relative p-6 sm:p-8 lg:p-16">
              <div className="text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                <div className="space-y-4">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4 py-2 text-sm sm:text-base">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Divine Mission
                  </Badge>
                  <div className="py-3">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent text-gradient-large">
                      {templeInfo?.mission}
                    </h2>
                  </div>
                </div>
                <p className="text-base sm:text-lg lg:text-xl text-orange-700 leading-relaxed italic font-light max-w-4xl mx-auto">
                  {templeInfo?.quote}
                </p>
              </div>

              {/* Two Images Side by Side - Now Square */}
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
                <Card className="overflow-hidden border-0 shadow-xl">
                  <div className="relative aspect-square">
                    <ImageWithFallback
                      src={templeInfo?.templeImage1 || "cropped-WhatsApp Image 2025-07-19 at 19.45.39_aa24a080.jpg"}
                      alt="Cosmic Saraswathi Temple - Vision"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                        <h3 className="font-semibold text-sm sm:text-base">Sacred Temple Vision</h3>
                        <p className="text-xs sm:text-sm opacity-90">Divine architectural excellence</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="overflow-hidden border-0 shadow-xl">
                  <div className="relative aspect-square">
                    <ImageWithFallback
                      src={templeInfo?.templeImage2 || "cropped-WhatsApp Image 2025-07-19 at 19.45.38_d1e83800.jpg"}
                      alt="Cosmic Saraswathi Temple - Heritage"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                        <h3 className="font-semibold text-sm sm:text-base">Sacred Heritage</h3>
                        <p className="text-xs sm:text-sm opacity-90">Timeless spiritual legacy</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="text-center space-y-6 sm:space-y-8">
                <div className="flex items-center justify-center gap-3 text-orange-800 bg-gradient-to-r from-orange-100 to-amber-100 p-3 sm:p-4 rounded-full max-w-fit mx-auto">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">{templeInfo?.location}</span>
                </div>
                <div className="flex justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 hover:from-orange-700 hover:via-red-700 hover:to-orange-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Heart className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="break-words">{templeInfo?.callToAction}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Temple Overview Section */}
        <section id="overview">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader className="text-center pb-8 sm:pb-12 pt-8 sm:pt-12 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent text-gradient-safe">
                  Temple Overview
                </CardTitle>
              </div>
              <CardDescription className="text-lg sm:text-xl mt-6 max-w-3xl mx-auto">
                A magnificent Hindu temple inspired by the sacred Nagara architectural tradition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 sm:space-y-12 pb-12 sm:pb-16 px-4 sm:px-6">
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-4 flex items-center gap-3">
                      <Crown className="h-5 w-5 sm:h-6 sm:w-6" />
                      Sacred Architecture
                    </h3>
                    <p className="text-orange-700 leading-relaxed text-base sm:text-lg">
                      The Cosmic Saraswati Temple, known by its sacred name <strong>"Antariksha Bhagavati Chaitanya Devasthanam"</strong>, 
                      will be a magnificent Hindu temple inspired by the traditional Nagara architectural style. This sacred space will 
                      serve as an enlightenment hub for spiritual seekers, knowledge enthusiasts, and those seeking transformational experiences.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-4 flex items-center gap-3">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                      Divine Location
                    </h3>
                    <p className="text-orange-700 leading-relaxed text-base sm:text-lg">
                      Located in the historic town of Mahabalipuram, renowned for its ancient rock-cut temples and stunning coastline, 
                      this temple will provide a serene and picturesque backdrop for spiritual growth, learning, and community building.
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-6 sm:p-8 rounded-2xl shadow-lg">
                  <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-6 flex items-center gap-3">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                    Temple Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { icon: Home, text: "Stunning Courtyards" },
                      { icon: TreePine, text: "Landscaped Gardens" },
                      { icon: GraduationCap, text: "Learning Centre" },
                      { icon: BookOpen, text: "Vedic Library" },
                      { icon: Utensils, text: "Satvic Cafeteria" },
                      { icon: Star, text: "2 Acres of Land" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/50 p-3 sm:p-4 rounded-lg">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full flex-shrink-0">
                          <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <span className="font-semibold text-orange-800 text-sm sm:text-base">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Project Phases Section */}
        <section id="phases">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader className="text-center pb-8 sm:pb-12 pt-8 sm:pt-12 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent text-gradient-safe">
                  Project Timeline
                </CardTitle>
              </div>
              <CardDescription className="text-lg sm:text-xl mt-6 max-w-3xl mx-auto">
                A meticulously planned two-phase construction journey toward divine manifestation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 sm:space-y-12 pb-12 sm:pb-16 px-4 sm:px-6">
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
                {/* Phase 1 */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="relative p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 sm:p-3 rounded-full">
                          <Hammer className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl sm:text-3xl text-orange-800">Phase 1</CardTitle>
                      </div>
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Foundation Stage
                      </Badge>
                    </div>
                    <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-3 text-orange-800">
                        <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8" />
                        <div>
                          <p className="text-2xl sm:text-3xl font-bold">₹20 Crores</p>
                          <p className="text-xs sm:text-sm opacity-75">Investment Required</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
                    <div className="space-y-4">
                      <h4 className="text-lg sm:text-xl font-bold text-orange-800 mb-4">Core Infrastructure Development</h4>
                      <div className="grid gap-3">
                        {[
                          "Temple's foundational structure",
                          "Sacred courtyards construction",
                          "Essential infrastructure setup",
                          "Architectural framework completion"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                            <span className="text-orange-700 text-sm sm:text-base">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phase 2 */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-red-50 to-orange-50 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="relative p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 sm:p-3 rounded-full">
                          <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl sm:text-3xl text-orange-800">Phase 2</CardTitle>
                      </div>
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                        <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Completion Stage
                      </Badge>
                    </div>
                    <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-3 text-orange-800">
                        <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8" />
                        <div>
                          <p className="text-2xl sm:text-3xl font-bold">₹25 Crores</p>
                          <p className="text-xs sm:text-sm opacity-75">Investment Required</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
                    <div className="space-y-4">
                      <h4 className="text-lg sm:text-xl font-bold text-orange-800 mb-4">Divine Architectural Excellence</h4>
                      <div className="grid gap-3">
                        {[
                          "Intricate temple architecture & carvings",
                          "Landscaped gardens & water features",
                          "Dharmic learning & training centre",
                          "Vedic library & satvic cafeteria"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
                            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
                            <span className="text-orange-700 text-sm sm:text-base">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Summary */}
              <div className="bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
                <div className="relative grid md:grid-cols-3 gap-6 sm:gap-8 items-center">
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
                      <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-800">₹45 Crores</p>
                    <p className="text-orange-700 font-semibold text-sm sm:text-base">Total Sacred Investment</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-800">2 Phases</p>
                    <p className="text-orange-700 font-semibold text-sm sm:text-base">Strategic Divine Approach</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-800">2 Acres</p>
                    <p className="text-orange-700 font-semibold text-sm sm:text-base">Sacred Blessed Land</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Temple Vision Section */}
        <section id="vision">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader className="text-center pb-8 sm:pb-12 pt-8 sm:pt-12 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent text-gradient-safe">
                  Temple Vision & Purpose
                </CardTitle>
              </div>
              <CardDescription className="text-lg sm:text-xl mt-6 max-w-4xl mx-auto">
                A sacred space dedicated to Goddess Saraswati and the spreading of Hindu dharma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 sm:space-y-12 pb-12 sm:pb-16 px-4 sm:px-6">
              <div className="text-center mb-8 sm:mb-12">
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 sm:p-8 rounded-2xl shadow-lg max-w-5xl mx-auto">
                  <p className="text-lg sm:text-xl text-orange-700 leading-relaxed">
                    The Antariksha Bhagavati Temple is a sacred space dedicated to the worship and reverence of 
                    <strong> Saraswati Devi</strong>, the Goddess of knowledge, music, arts, and wisdom, in her 
                    mesmerizing cosmic form. This temple embodies the principles of her divine energy, inspiring 
                    creativity, fostering learning, and promoting spiritual growth leading to true wisdom.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full flex-shrink-0">
                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-orange-800">Knowledge & Learning</h3>
                    </div>
                    <p className="text-orange-700 leading-relaxed text-base sm:text-lg">
                      The temple will serve as a renowned centre for educational and cultural activities, 
                      inspiring individuals to pursue knowledge and wisdom through various programs and initiatives.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full flex-shrink-0">
                        <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-orange-800">Arts & Creativity</h3>
                    </div>
                    <p className="text-orange-700 leading-relaxed text-base sm:text-lg">
                      Providing a platform for artists, musicians, and writers to express themselves, 
                      showcasing the beauty and richness of Hindu culture through various artistic mediums.
                    </p>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full flex-shrink-0">
                        <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-orange-800">Personal Growth</h3>
                    </div>
                    <p className="text-orange-700 leading-relaxed text-base sm:text-lg">
                      Offering a serene and sacred environment for individuals to realize and exhibit their 
                      innate talents and skills to the fullest extent possible, fostering personal transformation.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full flex-shrink-0">
                        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-orange-800">Heritage Preservation</h3>
                    </div>
                    <p className="text-orange-700 leading-relaxed text-base sm:text-lg">
                      Helping preserve and promote our great heritage, including art, architecture, literature, 
                      and philosophy through multiple modes of engagement with specialized practitioners.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-800 via-red-800 to-orange-800 text-white p-8 sm:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-red-900/20"></div>
                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                    <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300" />
                    <h3 className="text-2xl sm:text-3xl font-bold text-center">Transformational Impact</h3>
                  </div>
                  <p className="text-lg sm:text-xl leading-relaxed text-center max-w-4xl mx-auto">
                    In today's fast-paced world, the Antariksha Bhagavati Temple shall provide a much-needed 
                    sanctuary for individuals seeking knowledge, creativity, and personal elevation. The temple 
                    will enable devotees to cultivate empathy, compassion, self-awareness, and emotional intelligence, 
                    leading to a more righteous and harmonious society.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Facilities Section */}
        <section id="facilities">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader className="text-center pb-8 sm:pb-12 pt-8 sm:pt-12 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent text-gradient-safe">
                  Divine Facilities
                </CardTitle>
              </div>
              <CardDescription className="text-lg sm:text-xl mt-6 max-w-4xl mx-auto">
                World-class amenities designed for spiritual, educational, and cultural enrichment
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12 sm:pb-16 px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[
                  {
                    icon: Home,
                    title: "Stunning Courtyards",
                    description: "Beautiful open spaces designed for meditation, gatherings, and spiritual contemplation",
                    gradient: "from-orange-100 to-amber-100"
                  },
                  {
                    icon: TreePine,
                    title: "Landscaped Gardens",
                    description: "Serene gardens with native plants and peaceful walkways for reflection and relaxation",
                    gradient: "from-green-100 to-emerald-100"
                  },
                  {
                    icon: GraduationCap,
                    title: "Dharmic Learning Centre",
                    description: "Educational hub for spiritual discourses, workshops, and traditional knowledge sharing",
                    gradient: "from-blue-100 to-indigo-100"
                  },
                  {
                    icon: BookOpen,
                    title: "Vedic Library",
                    description: "Comprehensive collection of sacred texts, scriptures, and philosophical works",
                    gradient: "from-purple-100 to-violet-100"
                  },
                  {
                    icon: Utensils,
                    title: "Satvic Cafeteria",
                    description: "World-class dining facility serving delicious, pure vegetarian food prepared with devotion",
                    gradient: "from-yellow-100 to-orange-100"
                  },
                  {
                    icon: Music,
                    title: "Cultural Spaces",
                    description: "Dedicated areas for music, dance, and artistic performances celebrating Hindu culture",
                    gradient: "from-pink-100 to-rose-100"
                  }
                ].map((facility, index) => (
                  <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
                    <CardContent className={`p-6 sm:p-8 text-center bg-gradient-to-br ${facility.gradient} h-full`}>
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                        <facility.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-orange-800 mb-3 sm:mb-4">{facility.title}</h4>
                      <p className="text-orange-700 leading-relaxed text-sm sm:text-base">
                        {facility.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* About Us Section */}
        <section id="about-us">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader className="text-center pb-8 sm:pb-12 pt-8 sm:pt-12 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent text-gradient-safe">
                  About Us
                </CardTitle>
              </div>
              <CardDescription className="text-lg sm:text-xl mt-6 max-w-4xl mx-auto">
                <span className="text-gradient-safe"><strong>Jaganmatha Devasthanam Enterprises (JDE)</strong></span> is a pioneering firm dedicated to the 
                <strong> design, construction, and management of Hindu Temples across India.</strong> We are honored 
                to bring our expertise to the creation of the magnificent Cosmic Saraswathi Temple in Tamil Nadu.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12 sm:pb-16 px-4 sm:px-6">
              <Accordion type="single" collapsible className="space-y-4 sm:space-y-6">
                {[
                  {
                    value: "design",
                    icon: Building2,
                    title: "Design and Planning",
                    content: [
                      {
                        title: "Temple Architecture",
                        description: "Designing and planning temple structures, including layout, elevation, and interior spaces, in accordance with traditional Hindu architectural principles."
                      },
                      {
                        title: "Iconography and Symbolism",
                        description: "Incorporating intricate carvings, sculptures, and artwork that reflect profound Hindu theology and symbolism."
                      },
                      {
                        title: "Site Selection and Planning",
                        description: "Identifying suitable locations for temple construction, taking into account factors like geography, climate, and accessibility."
                      }
                    ]
                  },
                  {
                    value: "construction",
                    icon: Hammer,
                    title: "Construction and Project Management",
                    content: [
                      {
                        title: "Temple Construction",
                        description: "Overseeing the construction process, ensuring the temple is built according to the design plan and traditional construction methods."
                      },
                      {
                        title: "Project Management",
                        description: "Managing timelines, budgets, and resources to ensure the project is completed on time and within budget."
                      },
                      {
                        title: "Quality Control",
                        description: "Ensuring that the construction meets the required standards of quality, safety, and durability."
                      }
                    ]
                  },
                  {
                    value: "management",
                    icon: Settings,
                    title: "Temple Management and Operations",
                    content: [
                      {
                        title: "Temple Administration",
                        description: "Overseeing the day-to-day operations of the temple, including management of staff and devotees."
                      },
                      {
                        title: "Rituals and Ceremonies",
                        description: "Organizing and conducting various rituals and ceremonies, such as pujas, homas, and festivals."
                      },
                      {
                        title: "Facilities Management",
                        description: "Maintaining the temple's facilities, including upkeep of the premises, gardens, and other infrastructure."
                      }
                    ]
                  },
                  {
                    value: "community",
                    icon: Users,
                    title: "Community Engagement and Outreach",
                    content: [
                      {
                        title: "Community Programs",
                        description: "Organizing community programs, such as spiritual discourses, cultural events, and educational initiatives."
                      },
                      {
                        title: "Outreach and Partnerships",
                        description: "Building relationships with local communities, organizations, and institutions to promote the temple's activities and services."
                      },
                      {
                        title: "Volunteer Management",
                        description: "Coordinating with volunteers and encouraging community participation in temple activities."
                      }
                    ]
                  }
                ].map((section, index) => (
                  <AccordionItem key={section.value} value={section.value} className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg overflow-hidden">
                    <AccordionTrigger className="hover:no-underline p-6 sm:p-8 hover:bg-gradient-to-r hover:from-orange-100 hover:to-amber-100 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 sm:p-3 rounded-full flex-shrink-0">
                          <section.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-800 text-left">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 sm:px-8 pb-6 sm:pb-8">
                      <div className="space-y-4 sm:space-y-6">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="bg-white/70 p-4 sm:p-6 rounded-lg">
                            <h4 className="font-bold text-orange-800 mb-3 text-base sm:text-lg">{item.title}:</h4>
                            <p className="text-orange-700 leading-relaxed text-base sm:text-lg">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Contribution Section */}
        <section>
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-800/20 to-red-800/20"></div>
            <CardContent className="relative p-8 sm:p-12 lg:p-16 text-center space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 sm:p-4 rounded-full">
                  <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent text-gradient-safe">
                  Join Our Sacred Mission
                </h2>
              </div>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto">
                {templeInfo?.etchingText}
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-200">
                  {templeInfo?.knowledgeText}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Contact Section */}
        <section id="contact">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader className="text-center pb-8 sm:pb-12 pt-8 sm:pt-12 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                  <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent text-gradient-safe">
                  Contact For Contributions
                </CardTitle>
              </div>
              <CardDescription className="text-lg sm:text-xl mt-6">
                Reach out to us to be part of this divine mission
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-lg mx-auto pb-12 sm:pb-16 px-4 sm:px-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 sm:p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 sm:p-4 rounded-full flex-shrink-0">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-orange-800">{templeInfo?.contactName}</p>
                      <p className="text-orange-700 text-sm sm:text-base">{templeInfo?.contactRole}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 sm:p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 sm:p-4 rounded-full flex-shrink-0">
                      <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <a 
                        href={`tel:${templeInfo?.contactPhone}`} 
                        className="text-xl sm:text-2xl font-bold text-orange-800 hover:text-orange-600 transition-colors block"
                      >
                        {templeInfo?.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 text-white py-8 sm:py-12 px-4 sm:px-6 mt-12 sm:mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-800/20 to-red-800/20"></div>
        <div className="relative container mx-auto text-center space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent text-gradient-large">
              {templeInfo?.name}
            </h3>
          </div>
          <Separator className="bg-white/20 max-w-md mx-auto" />
          <p className="text-base sm:text-lg">&copy; {new Date().getFullYear()} {templeInfo?.name}. All rights reserved.</p>
          <p className="text-orange-200 text-sm sm:text-base">
            Building spiritual heritage for future generations with divine blessings
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;