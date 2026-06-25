export async function getArticles() {
  const response = await fetch("/src/data/articles.json");
  if (!response.ok) {
    throw new Error("Failed to fetch articles data");
  }
  return response.json();
}

export async function getArticleById(id: string) {
  try {
    const response = await fetch(`/src/data/article${id}.json`);
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}
