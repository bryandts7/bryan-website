import React from 'react';
import BlogList from '../components/blogList';
import  NavBar from '../components/NavBar';

// Define the BlogPost type
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
}

// Sample blog posts data
const blogPosts: BlogPost[] = [
  { id: '1', title: 'Introduction to Markdown', excerpt: 'Learn the basics of Markdown syntax...' },
  { id: '2', title: 'Advanced Math Formulas', excerpt: 'Explore complex mathematical expressions...' },
  { id: '3', title: 'Responsive Design Tips', excerpt: 'Best practices for creating responsive layouts...' },
];

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