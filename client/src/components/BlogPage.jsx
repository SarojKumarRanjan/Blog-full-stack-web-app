import { useParams } from "react-router-dom";
import axios from "axios";
import { useState,useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "./Loader";


function BlogPage() {

    const { id } = useParams();

    const [blog, setBlog] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        axios
          .get(`${import.meta.env.VITE_BASE_URL}/getone/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setBlog(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            toast.error(error.message);
            setLoading(false);
          });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      
  return (

    <div className="prose prose-sm md:prose-base mx-auto">
        {
            loading? (
               <Loader/>
            ) : (
                
      <div className="prose prose-sm md:prose-base mx-auto">
        <figure className="w-full">
          <img
            loading="lazy"
            src={blog?.blog?.imageUrl}
            className="border-base-content bg-base-300 rounded-box border border-opacity-5"
            alt="post image"
          />
        </figure>
        <div>
          <div className="text-base-content/60 mb-2 text-xs">
            <span title="6 Oct 2023" className="italic">
              Published 8 months ago
            </span>{" "}
            by
            <span>Pouya Saadeghi</span>
          </div>
          <h1>{blog?.blog.title}</h1>
          <p>
            {blog?.blog?.content}
          </p>
         
        </div>
      </div>
    
            )
        }
    </div>


    
  )
}

export default BlogPage;
