export const fetchTopStories = async (): Promise<number[]> => {
    const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json",
      { next: { revalidate: 60 } }
    );
    return response.json();
  };
  

export const fetchStory = async (id: number): Promise<Story> => {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return response.json();
};