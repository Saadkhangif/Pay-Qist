// Import React essentials for lazy loading and routing components
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';

// Lazy load the pages to split code, reducing the initial load time
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const RefundAndReturnPolicyPage = lazy(() => import('./pages/RefundAndReturnPolicyPage'));

// A fallback UI to display while a lazy-loaded route is being fetched
function RouteFallback() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="relative w-24 h-24">
        {/* Outer Gyro Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 shadow-[0_0_15px_rgba(22,163,74,0.6)] animate-spin" style={{ animationDuration: '1.2s' }}></div>
        {/* Middle Gyro Ring */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-l-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        {/* Inner Gyro Ring */}
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-green-400 shadow-[0_0_15px_rgba(74,222,128,0.6)] animate-spin" style={{ animationDuration: '0.8s' }}></div>
        {/* Center pulsing core */}
        <div className="absolute inset-8 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-pulse"></div>
      </div>
    </div>
  );
}

export default function App() {
  // Get the current user from the Auth Context to handle protected/public routing
  const { user, isLoading } = useAuth();

  return (
    <Layout>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Publicly accessible routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/refund-and-return-policy" element={<RefundAndReturnPolicyPage />} />
          {/* Protected routes requiring a logged-in user */}
          <Route
            path="/product/:productId"
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          {/* Admin-only protected route */}
        <Route element={<AdminRoute currentUser={user} isLoading={isLoading} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}