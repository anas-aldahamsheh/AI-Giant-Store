type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Category</h1>
      <p className="mt-3 text-muted-foreground">
        Placeholder route for category slug: {slug}
      </p>
    </main>
  );
}
