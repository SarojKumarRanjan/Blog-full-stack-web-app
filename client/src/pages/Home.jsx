import  { useState, useEffect } from 'react';
import axios from 'axios';
import Heropage from '../components/Hero-section';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    axios.get(import.meta.env.VITE_BASE_URL + "/getall")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false); // Update loading state once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Update loading state on error
        
      });
  }, []); 

  console.log(blogs);

  
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {blogs?.blogs?.map((blog) => (
            <BlogCard {...blog} key={blog.id} />
          ))}
          <Heropage />
        </>
      )}
    </>
  );
}

export default Home;
