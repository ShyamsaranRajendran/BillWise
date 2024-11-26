import React from "react";
import "./Blog.css"; // Import the CSS file

const Blog = () => {
  return (
    <div className="blog-container">
      <header className="blog-header">
        <h1>Welcome to Our Blog</h1>
        <p>Your source for the latest news and updates!</p>
      </header>
      <div className="blog-content">
        <div className="blog-post">
          <h2 className="post-title">How to Improve Your Business with ZEIL</h2>
          <p className="post-date">Published on: November 25, 2024</p>
          <p className="post-excerpt">
            ZEIL Invoice offers an innovative solution to help you manage your
            invoices, track payments, and streamline your billing process. In
            this post, we will explore the key features of ZEIL and how they can
            benefit your business...
          </p>
          <button className="read-more-btn">Read More</button>
        </div>

        <div className="blog-post">
          <h2 className="post-title">5 Tips for Better Invoice Management</h2>
          <p className="post-date">Published on: November 18, 2024</p>
          <p className="post-excerpt">
            Managing invoices efficiently is crucial for any business. In this
            article, we'll share some valuable tips on how to stay organized,
            reduce errors, and improve your invoicing workflow...
          </p>
          <button className="read-more-btn">Read More</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
