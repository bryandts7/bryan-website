import React from 'react';
import { useParams } from 'react-router-dom';
import Blog from "../../components/blog";
import NavBar from '../../components/NavBar';

const blogPosts = {
  '1': {
    title: 'Introduction to Markdown',
    content: `
# Introduction to Markdown

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. Created by John Gruber in 2004, Markdown is now one of the world's most popular markup languages.

## Basic Syntax

### Headers

# H1
## H2
### H3

### Emphasis

*italic* or _italic_
**bold** or __bold__
**_bold and italic_**

### Unordered List
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item
   1. Nested item 3.1
   2. Nested item 3.2

## Blockquote

> This is a blockquote. It can span multiple lines and can contain other Markdown elements.

## Code

Inline \`code\` looks like this.

A code block looks like this:

\`\`\`python
def hello_world():
    print("Hello, world!")
\`\`\`

### Links

[Visit OpenAI](https://www.openai.com)

### Images

<img src="https://play-lh.googleusercontent.com/8XCwpfWc9YkehwhrhoID6PGhs5SaSJoocS0oTBA8EsGFGLrj32oIYu5UKsIO7wdU1PQZ" alt="OpenAI" width="100"/>

## Math Formulas

You can write inline math formulas like this: $E = mc^2$

Or display formulas like this:

$$
\\frac{n!}{k!(n-k)!} = \\binom{n}{k}
$$

That's it for the basics! Happy Markdown writing!
    `
  },
  // Add more blog posts here
};

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts[id as keyof typeof blogPosts];

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
        <Blog title={post.title} content={post.content} />
      </div>
    </div>
  );
};

export default BlogPost;
