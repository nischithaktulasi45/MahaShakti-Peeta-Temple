import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleTranslateToggle from "@/components/GoogleTranslateToggle";
import ScrollToTop from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Gods from "@/pages/Gods";
import Trust from "@/pages/Trust";
import Services from "@/pages/Services";
import Events from "@/pages/Events";
import Gallery from "@/pages/Gallery";
import ProgressGallery from "@/pages/ProgressGallery";
import Donate from "@/pages/Donate";
import Contact from "@/pages/Contact";
import DonateQr from "@/pages/DonateQr";

// ✅ New import
import MahaShaktiPeethas from "@/pages/MahaShaktiPeethas";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/gods" component={Gods} />
      <Route path="/trust" component={Trust} />
      <Route path="/services" component={Services} />
      <Route path="/events" component={Events} />
      <Route path="/progress_gallery" component={ProgressGallery} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/donate" component={Donate} />
      <Route path="/donate/qr" component={DonateQr} />
      <Route path="/contact" component={Contact} />
      {/* ✅ New route */}
      <Route path="/maha-shakti-peethas" component={MahaShaktiPeethas} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <GoogleTranslateToggle />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Layout />
        <ScrollToTop />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;