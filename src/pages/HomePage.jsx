import Hero from '../components/Hero';
import TrustStatistics from '../components/TrustStatistics';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import EmiCalculator from '../components/EmiCalculator';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import PartnerBrands from '../components/PartnerBrands';
import Faq from '../components/Faq';

export default function HomePage() {
  return (
    <div className="pb-20">
      <Hero />
      <TrustStatistics />
      <Categories />
      <FeaturedProducts />
      <EmiCalculator />
      <HowItWorks />
      <Features />
      <PartnerBrands />
      <Faq />
    </div>
  );
}