import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Blog from "../../components/blog";
import NavBar from '../../components/NavBar';
import {blogPosts} from '../../data/blogs';


const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Blog
        </button>
        <Blog  title={post.title} content={post.content}  />
      </div>
    </div>
  );
};

export default BlogPost;
