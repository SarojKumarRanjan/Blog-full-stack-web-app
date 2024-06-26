import { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import PaginationButton from "../components/PaginationButton";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
function Blogs(props) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/getall?page=${currentPage}`
        );
        setBlogs(response.data.blogs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {
        // eslint-disable-next-line react/prop-types
        props.disable !== "home" && (
          <div className="hero bg-base-200 h-96">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-3xl font-bold">Welcome to EnlightenHub!</h1>
                <h2 className="text-xl font-medium mt-2">
                  Connecting Minds, Illuminating Ideas
                </h2>
                <p className="py-6">
                  Connect with a community of like-minded individuals who share
                  a passion for learning and enlightenment. EnlightenHub is your
                  central hub for insightful articles and thought-provoking
                  discussions.
                </p>
                <Link to="/blog/add">
                  <button className="btn btn-primary">
                    Write a blog --{">"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )
      }

      <div className="flex flex-wrap justify-center gap-4 mt-6 mb-6">
        {loading ? (
          <Loader />
        ) : (
          <>
            {blogs.map((blog) => (
              <BlogCard {...blog} key={blog.id} />
            ))}
          </>
        )}
        {!loading && (
          <div className="flex justify-center w-full mt-4">
            <PaginationButton
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Blogs;
