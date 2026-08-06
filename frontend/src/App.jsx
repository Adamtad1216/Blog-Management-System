import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Footer from './components/layout/Footer.jsx';
import Navbar from './components/layout/Navbar.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditPostPage from './pages/EditPostPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import SearchPage from './pages/SearchPage.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/categories/:categorySlug" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Author Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreatePostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditPostPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
