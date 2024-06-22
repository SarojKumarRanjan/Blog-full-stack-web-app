

import  { useState, useEffect } from 'react';
import axios from 'axios';
import Heropage from '../components/Hero-section';
import BlogCard from '../components/BlogCard';
import Loader from '../components/Loader';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    axios.get(import.meta.env.VITE_BASE_URL + "/getall")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        
      });
  }, []); 

  

  
  return (
    <div className='flex flex-wrap justify-center gap-6  mb-8'>
      {loading ? (
        <Loader />
      ) : (
        <>
         <Heropage />
          {blogs?.blogs?.map((blog) => (
            <BlogCard {...blog} key={blog.id} />
          ))}
         
        </>
      )}
    </div>
  );
}

export default Home;
