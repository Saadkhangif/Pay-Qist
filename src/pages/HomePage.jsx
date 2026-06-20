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
  return (
    <div className="relative pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] mesh-bg" />
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
