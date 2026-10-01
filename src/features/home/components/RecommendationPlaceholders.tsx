import { EmptyState } from "@/components/ui/EmptyState";

export function RecommendationPlaceholders() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-6 py-8 lg:grid-cols-2 lg:px-8">
      <EmptyState
        title="Personalized picks are warming up"
        description="Recommendations will become personal after product, browsing, and account systems are connected."
      />
      <EmptyState
        title="Recently viewed will appear here"
        description="This placeholder keeps the homepage layout ready without inventing user history."
      />
    </section>
  );
}
