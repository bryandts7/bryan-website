import React from 'react';
import { useParams } from 'react-router-dom';
import Blog from "../../components/blog";
import NavBar from '../../components/NavBar';
import {blogPosts} from '../../data/blogs';


const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex items-center justify-center text-center">
          <p className="text-lg text-gray-500">Blog post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 flex-grow">
        <Blog  title={post.title} content={post.content}  />
      </div>
    </div>
  );
};

export default BlogPost;
