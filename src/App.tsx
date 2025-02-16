import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import PhotoGrid from './components/PhotoGrid';
import AdminDashboard from './components/AdminDashboard';
import UploadPage from './components/UploadPage';

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState('photos'); // 'photos', 'upload', 'admin'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkIfAdmin(session?.user?.email);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkIfAdmin(session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkIfAdmin = (email) => {
    setIsAdmin(email === 'admin@photoalbum.com');
  };

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Photo Album</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('photos')}
                className={`px-4 py-2 rounded-md ${
                  currentView === 'photos'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => setCurrentView('upload')}
                className={`px-4 py-2 rounded-md ${
                  currentView === 'upload'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Upload
              </button>
              {isAdmin && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-4 py-2 rounded-md ${
                    currentView === 'admin'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Admin
                </button>
              )}
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentView === 'photos' && <PhotoGrid />}
        {currentView === 'upload' && <UploadPage />}
        {currentView === 'admin' && isAdmin && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;