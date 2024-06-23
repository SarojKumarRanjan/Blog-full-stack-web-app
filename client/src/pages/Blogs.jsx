import  { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import PaginationButton from "../components/PaginationButton";

function Blogs() {
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
  );
}

export default Blogs;
