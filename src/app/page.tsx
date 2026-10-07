import { AIAssistantCta } from "@/features/home/components/AIAssistantCta";
import { CampaignBanners } from "@/features/home/components/CampaignBanners";
import { FeaturedCategories } from "@/features/home/components/FeaturedCategories";
import { HeroSection } from "@/features/home/components/HeroSection";
import { SmartBundles } from "@/features/home/components/SmartBundles";
import { TrustBadges } from "@/features/home/components/TrustBadges";
import { WhyShopWithUs } from "@/features/home/components/WhyShopWithUs";
import { NewsletterCta } from "@/features/home/components/NewsletterCta";
import { RecommendationRails } from "@/features/products/components/RecommendationRails";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedCategories />
      <CampaignBanners />
      <RecommendationRails />
      <SmartBundles />
      <TrustBadges />
      <WhyShopWithUs />
      <AIAssistantCta />
      <NewsletterCta />
    </main>
  );
}
