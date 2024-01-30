const mongoose = require('mongoose');
const Blog = require('../models/Blog'); // Yahan BlogModel ka sahi path dena hoga

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/gravity', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data for 5 blogs
const sampleBlogs = [
  {
    title: 'Blog 1',
    subTitle: 'Subtitle 1',
    writtenBy: 'Author 1',
    tags: ['Tag1', 'Tag2'],
    img: {
      url: 'https://example.com/image1.jpg',
      id: 'image1_id',
    },
    desc: 'Description 1',
    slug: 'blog-1',
    ts: 'timestamp1',
  },
  {
    title: 'Blog 2',
    subTitle: 'Subtitle 2',
    writtenBy: 'Author 2',
    tags: ['Tag3', 'Tag4'],
    img: {
      url: 'https://example.com/image2.jpg',
      id: 'image2_id',
    },
    desc: 'Description 2',
    slug: 'blog-2',
    ts: 'timestamp2',
  },
  // Add 3 more blogs here
];

// Inserting sample blogs into the database
Blog.insertMany(sampleBlogs)
  .then(() => {
    console.log('Sample blogs inserted successfully');
  })
  .catch((error) => {
    console.error('Error inserting sample blogs:', error);
  })
  .finally(() => {
    // Close the connection after insertion
    mongoose.connection.close();
  });
