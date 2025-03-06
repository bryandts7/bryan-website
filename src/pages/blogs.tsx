import React from 'react';
import BlogList from '../components/blogList';
import  NavBar from '../components/NavBar';
import  {blogPosts} from '../data/blogs';


const BlogListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar/>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <BlogList posts={blogPosts} />
        </div>
      </main>
    </div>
  );
};

export default BlogListPage;