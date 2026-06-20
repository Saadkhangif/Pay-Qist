import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApplicationSuccessBanner from '../components/ApplicationSuccessBanner';
import Hero from '../components/Hero';
import TrustStatistics from '../components/TrustStatistics';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import EmiCalculator from '../components/EmiCalculator';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import PartnerBrands from '../components/PartnerBrands';
import Newsletter from '../components/Newsletter';
import Faq from '../components/Faq';

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccessBanner, setShowSuccessBanner] = useState(Boolean(location.state?.applicationSuccess));

  useEffect(() => {
    if (!location.state?.applicationSuccess) return;

    setShowSuccessBanner(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state?.applicationSuccess, navigate]);

  return (
    <div className="relative pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] mesh-bg" />
      {showSuccessBanner ? (
        <div className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <ApplicationSuccessBanner onDismiss={() => setShowSuccessBanner(false)} />
        </div>
      ) : null}
      <Hero />
      <TrustStatistics />
      <Categories />
      <FeaturedProducts />
      <EmiCalculator />
      <HowItWorks />
      <Features />
      <PartnerBrands />
      <Newsletter />
      <Faq />
    </div>
  );
}
