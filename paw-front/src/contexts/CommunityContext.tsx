import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Post {
  id: number;
  user: string;
  userAvatar: string;
  dogName: string;
  breed: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
  timestamp: string;
}

interface CommunityContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'timestamp'>) => void;
  loadPosts: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

// Static posts that are always present
const staticPosts: Post[] = [
  {
    id: 1,
    user: "Sarah M.",
    userAvatar: "SM",
    dogName: "Max",
    breed: "Golden Retriever",
    image: "https://images.unsplash.com/photo-1683212144530-7a3a0edc69b9?w=600",
    likes: 234,
    comments: 45,
    caption: "Max enjoying his favorite spot at the park!",
    timestamp: "2h ago",
  },
  {
    id: 2,
    user: "John D.",
    userAvatar: "JD",
    dogName: "Luna",
    breed: "Husky",
    image: "https://images.unsplash.com/photo-1529776180807-ea0ee08c8315?w=600",
    likes: 512,
    comments: 89,
    caption: "Those blue eyes never get old!",
    timestamp: "5h ago",
  },
  {
    id: 3,
    user: "Emma K.",
    userAvatar: "EK",
    dogName: "Charlie",
    breed: "Beagle",
    image: "https://images.unsplash.com/photo-1606833694770-40a04762ac16?w=600",
    likes: 187,
    comments: 32,
    caption: "Playtime is the best time!",
    timestamp: "1d ago",
  },
];

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(staticPosts);

  // Load posts from localStorage on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    try {
      const savedPosts = localStorage.getItem('communityPosts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        // Combine static posts with user posts, ensuring no duplicates
        const userPosts = parsedPosts.filter((post: Post) => post.id > 3); // Static posts have ids 1-3
        setPosts([...staticPosts, ...userPosts]);
      } else {
        setPosts(staticPosts);
      }
    } catch (error) {
      console.error('Error loading community posts:', error);
      setPosts(staticPosts);
    }
  };

  const addPost = (newPostData: Omit<Post, 'id' | 'timestamp'>) => {
    const newPost: Post = {
      ...newPostData,
      id: Math.max(...posts.map(p => p.id), 0) + 1,
      timestamp: "just now",
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);

    // Save user posts to localStorage (exclude static posts)
    try {
      const userPosts = updatedPosts.filter(post => post.id > 3);
      localStorage.setItem('communityPosts', JSON.stringify(userPosts));
    } catch (error) {
      console.error('Error saving community posts:', error);
    }
  };

  return (
    <CommunityContext.Provider value={{ posts, addPost, loadPosts }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}
