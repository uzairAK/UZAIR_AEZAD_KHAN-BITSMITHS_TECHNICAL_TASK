import { fetchTopStories, fetchStory } from "./utils/api";
import { Story } from "./utils/interface";

const PAGE_SIZE = 10;

async function fetchStories(page: number): Promise<Story[]> {
  const topStoryIds = await fetchTopStories();
  const slicedIds = topStoryIds.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const stories = await Promise.all(slicedIds.map(fetchStory));
  return stories;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // const {page} = await searchParams;
  const page = parseInt(searchParams?.page || "1", 10);
  const stories = await fetchStories(page);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <li key={story.id} className="p-4 bg-white rounded shadow">
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {story.title}
            </a>
            <p className="text-sm text-gray-600">by {story.by}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-4 gap-2">
        <a
          href={`?page=${page - 1}`}
          className={`${
            page === 1 ? "opacity-50 pointer-events-none" : ""
          } text-blue-600`}
        >
          Previous
        </a>
        <a href={`?page=${page + 1}`} className="text-blue-600">
          Next
        </a>
      </div>
    </div>
  );
}
