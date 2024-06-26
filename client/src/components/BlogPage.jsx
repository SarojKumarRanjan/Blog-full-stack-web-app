import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "./Loader";
import { useContext } from "react";
import UserContext from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

function BlogPage() {

  const navigate = useNavigate();
  const {user} = useContext(UserContext);

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


  const handleDelete = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/blog/delete/${id}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.status === 200) {
        toast.success("Blog deleted successfully");
        navigate("/blogs");
      } else {
        toast.error("Failed to delete blog: " + res.data.error);
      }
    } catch (error) {
      toast.error("Failed to delete blog: " + (error.response?.data?.error || error.message));
    }
  };
  //console.log(blog?.blog?.authorId);
 // console.log(id);
  
  return (
    <div className="prose prose-sm md:prose-base mx-auto mt-8 mb-8  ">
      {loading ? (
        <Loader />
      ) : (
        <>
         { user && ( user.id ==blog?.blog?.authorId && <div className="flex gap-2 mb-4 justify-end">
            <button onClick={handleDelete} className="btn btn-primary"> Delete</button>
            <button className="btn btn-primary"> Update</button>
          </div>)}

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
                {/*  <span title="6 Oct 2023" className="italic">
              Published 8 months ago
            </span>{" "}
            by */}
                <span>{user?.name || " "}</span>
              </div>
              <h1>{blog?.blog.title}</h1>
              <p>{blog?.blog?.content}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BlogPage;
