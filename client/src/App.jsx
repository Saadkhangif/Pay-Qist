import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModalHost from './components/AuthModalHost';
import { useAuth } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
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
const SignupPage = lazy(() => import('./pages/SignupPage'));
const CompleteProfilePage = lazy(() => import('./pages/CompleteProfilePage'));
const InstallmentApplicationPage = lazy(() => import('./pages/InstallmentApplicationPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-green-600 shadow-[0_0_15px_rgba(22,163,74,0.6)]" style={{ animationDuration: '1.2s' }} />
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-l-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 animate-spin rounded-full border-4 border-transparent border-b-green-400 shadow-[0_0_15px_rgba(74,222,128,0.6)]" style={{ animationDuration: '0.8s' }} />
        <div className="absolute inset-8 animate-pulse rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
      </div>
    </div>
  );
}

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <RouteFallback />
    </div>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Navigate to="/home" replace state={{ openAuth: 'login' }} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/refund-and-return-policy" element={<RefundAndReturnPolicyPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route
          path="/apply"
          element={
            <ProtectedRoute requireProfile>
              <InstallmentApplicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute requireProfile>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute requireProfile>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route element={<AdminRoute isLoading={isLoading} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <Layout>
      <AppRoutes />
      <AuthModalHost />
    </Layout>
  );
}
