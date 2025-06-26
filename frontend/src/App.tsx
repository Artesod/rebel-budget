import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { Mascot } from './components/Mascot';
import { MascotProvider, useMascotContext } from './components/MascotContext';
import AIChat from './components/AIChat';
import { AuthProvider, useAuth, ProtectedRoute } from './contexts/AuthContext';
import MascotDemo from './components/MascotDemo';
import SpriteBackground from './components/SpriteBackground';
import './index.css';

const queryClient = new QueryClient();



// Persona 5 Menu Component
const PersonaMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };
  
  if (!isOpen) return null;
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking on the overlay itself, not on menu items
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 font-comic">
      {/* Dark overlay with red gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-p5-black via-p5-red to-p5-black opacity-95 cursor-pointer"
        onClick={handleOverlayClick}
      />
      
      {/* Persona 5 Style Menu */}
      <div className="relative w-full h-full flex items-center justify-center" onClick={handleOverlayClick}>
        {/* Main curved background shape */}
        <div className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 1920 1080" className="w-full h-full">
            {/* Large curved background */}
            <path 
              d="M100 200 Q400 100 800 300 Q1200 500 1600 200 Q1800 400 1700 800 Q1400 1000 1000 900 Q600 800 200 1000 Q0 600 100 200 Z" 
              fill="#111" 
              stroke="#e60012" 
              strokeWidth="4"
              className="animate-p5-slide-in"
            />
            {/* Accent curves */}
            <path 
              d="M300 400 Q600 300 900 500 Q1200 700 1400 400" 
              fill="none" 
              stroke="#ffe600" 
              strokeWidth="6"
              className="animate-p5-pop"
            />
          </svg>
        </div>
        
        {/* Menu Items */}
        <div className="relative z-10 w-full h-full pointer-events-none">
          {/* Rebel Budget Logo */}
          <div className="absolute top-16 left-16 animate-p5-slide-in pointer-events-auto">
          <div className="flex items-center">
              <div className="bg-p5-red rounded-comic p-4 mr-4 border-comic border-4 border-p5-white shadow-p5-pop">
                <svg className="w-12 h-12 text-p5-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <span className="text-4xl md:text-6xl font-extrabold text-p5-white uppercase tracking-widest drop-shadow-lg">Rebel Budget</span>
                {user && (
                  <div className="text-p5-yellow text-lg font-bold mt-2">
                    Welcome back, {user.full_name || user.email}!
                    {user.is_admin && (
                      <div className="inline-block ml-3 bg-p5-red text-p5-white px-2 py-1 rounded-comic text-sm font-extrabold border-2 border-p5-yellow">
                        👑 ADMIN
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Actions - Top Right */}
          {user && (
            <div className="absolute top-16 right-16 animate-p5-slide-in pointer-events-auto">
              <button
                onClick={handleLogout}
                className="bg-p5-yellow hover:bg-p5-red border-comic border-4 border-p5-black hover:border-p5-white rounded-comic p-4 shadow-p5-pop transition-all transform hover:scale-105 text-p5-black hover:text-p5-white font-extrabold uppercase tracking-wider"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </div>
              </button>
            </div>
          )}
          
          {/* Navigation Menu Items - 3 items with balanced spacing */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dashboard - Left, higher */}
            <Link 
              to="/" 
              onClick={onClose}
              className={`absolute top-1/3 left-[20%] transform -rotate-6 animate-p5-slide-in pointer-events-auto ${
                location.pathname === '/' ? 'text-p5-red' : 'text-p5-white hover:text-p5-yellow'
              }`}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="bg-p5-black border-comic border-4 border-p5-white rounded-comic p-6 shadow-p5-pop hover:animate-p5-shake transition-all hover:scale-105">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-2xl md:text-3xl font-extrabold uppercase tracking-widest">Dashboard</div>
                <div className="text-lg text-p5-yellow mt-2">Main Hub</div>
              </div>
            </Link>
            
            {/* Expenses - Center, lower */}
            <Link 
              to="/expenses" 
              onClick={onClose}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 rotate-4 animate-p5-slide-in pointer-events-auto ${
                location.pathname === '/expenses' ? 'text-p5-red' : 'text-p5-white hover:text-p5-yellow'
              }`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="bg-p5-black border-comic border-4 border-p5-white rounded-comic p-6 shadow-p5-pop hover:animate-p5-shake transition-all hover:scale-105">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-2xl md:text-3xl font-extrabold uppercase tracking-widest">Expenses</div>
                <div className="text-lg text-p5-yellow mt-2">Track Spending</div>
              </div>
            </Link>
            
            {/* Analytics - Right, higher */}
            <Link 
              to="/analytics" 
              onClick={onClose}
              className={`absolute top-1/3 right-[20%] transform -rotate-8 animate-p5-slide-in pointer-events-auto ${
                location.pathname === '/analytics' ? 'text-p5-red' : 'text-p5-white hover:text-p5-yellow'
              }`}
              style={{ animationDelay: '0.3s' }}
            >
              <div className="bg-p5-black border-comic border-4 border-p5-white rounded-comic p-6 shadow-p5-pop hover:animate-p5-shake transition-all hover:scale-105">
                <div className="text-4xl mb-2">📈</div>
                <div className="text-2xl md:text-3xl font-extrabold uppercase tracking-widest">Analytics</div>
                <div className="text-lg text-p5-yellow mt-2">Insights</div>
              </div>
            </Link>
            
            {/* Mascot Demo - Bottom center (temporary for testing) */}
            <Link 
              to="/mascot-demo" 
              onClick={onClose}
              className={`absolute bottom-[15%] left-1/2 transform -translate-x-1/2 rotate-2 animate-p5-slide-in pointer-events-auto ${
                location.pathname === '/mascot-demo' ? 'text-p5-red' : 'text-p5-white hover:text-p5-yellow'
              }`}
              style={{ animationDelay: '0.4s' }}
            >
              <div className="bg-p5-yellow border-comic border-4 border-p5-red rounded-comic p-4 shadow-p5-pop hover:animate-p5-shake transition-all hover:scale-105">
                <div className="text-3xl mb-1">🎭</div>
                <div className="text-lg md:text-xl font-extrabold uppercase tracking-widest text-p5-black">Mascot Demo</div>
                <div className="text-sm text-p5-red mt-1">Test Features</div>
              </div>
            </Link>
          </div>
          
          {/* Close instruction */}
          <div className="absolute bottom-8 right-8 text-p5-white text-lg md:text-xl font-bold animate-p5-pop pointer-events-auto">
            <div className="bg-p5-black bg-opacity-70 rounded-comic p-3 md:p-4 border-comic border-2 border-p5-red cursor-pointer hover:bg-opacity-90 transition-all" onClick={onClose}>
              Click anywhere to close
            </div>
          </div>
          

        </div>
      </div>
    </div>
  );
};

// Floating Action Button
const FloatingActionButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-40 bg-p5-red hover:bg-red-600 border-comic border-4 border-p5-white rounded-comic p-4 shadow-p5-pop hover:shadow-p5 transition-all transform hover:scale-110 hover:animate-p5-shake group"
    >
      <div className="flex items-center space-x-2">
        <svg className="w-8 h-8 text-p5-yellow group-hover:text-p5-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="text-xl font-extrabold text-p5-white uppercase tracking-widest hidden md:block">Menu</span>
      </div>
    </button>
  );
};

// Inner App component that uses the mascot context
const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const mascot = useMascotContext();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Example mascot interactions - now opens AI chat
  const handleMascotClick = () => {
    const messages = [
      "Hey there! Let me open the chat so we can talk about your finances!",
      "I'm here to help! Let's have a conversation about your money goals.",
      "Ready to chat about your spending? I've got insights for you!",
      "Let's talk finance! Opening our chat now.",
      "Time for some financial wisdom! Chat with me!"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    mascot.showMessage(randomMessage, 'happy', 'speaking');
    
    // Open AI chat after a short delay to let the message show
    setTimeout(() => {
      setIsAIChatOpen(true);
    }, 1000);
  };

  const handleLoginSuccess = () => {
            mascot.showMessage("Welcome to Rebel Budget! I'm here to help you manage your money!", 'excited', 'celebrating');
  };

  console.log('🎯 AppContent render:', { isLoading, isAuthenticated, user: !!user });

  // Show minimal loading screen while checking authentication
  if (isLoading) {
    console.log('⏳ AppContent: Showing loading screen');
    return (
      <div className="min-h-screen bg-p5-black"></div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    console.log('🔐 AppContent: Showing Login component');
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }
  
  return (
    <div className="min-h-screen bg-p5-black bg-halftone bg-repeat relative overflow-x-hidden font-comic">
      {/* Sprite-based background elements */}
      <SpriteBackground />
      
      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsMenuOpen(true)} />
      
      {/* Persona 5 Menu Overlay */}
      <PersonaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* AI Chat Modal */}
      {isAIChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl max-h-[80vh]">
            {/* Close button */}
            <button
              onClick={() => setIsAIChatOpen(false)}
              className="absolute -top-2 -right-2 z-10 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
            >
              ×
            </button>
            <AIChat />
          </div>
        </div>
      )}
      
      {/* Mascot */}
      <Mascot
        emotion={mascot.emotion}
        state={mascot.state}
        message={mascot.message}
        isVisible={mascot.isVisible}
        onClick={handleMascotClick}
        onMessageComplete={mascot.hideMessage}
        position="bottom-left"
        size="large"
      />
      
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/mascot-demo" element={
              <ProtectedRoute>
                <MascotDemo />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </main>
      
      {/* Bottom decorative strip */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-p5-red via-p5-yellow to-p5-red animate-p5-swoosh pointer-events-none z-30"></div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MascotProvider>
      <Router>
            <AppContent />
      </Router>
        </MascotProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 