import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AddPost() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    content: "",
    postImage: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "postImage") {
      setData({ ...data, postImage: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('postImage', data.postImage);

    /* for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
 */
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/blog/add`,
        formData,
        config
      );
      //console.log(res.data);
      navigate(`/blog/${res.data?.blog?.id}`);
      toast.success("Blog added successfully");
    } catch (error) {
      toast.error("Failed to add blog: " + (error.response?.data?.error || error.message));
      //console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="flex flex-col gap-6">
          <h1 className="text-center text-4xl font-bold">Add a post</h1>
          <div className="flex flex-col gap-8">
            <input
              name="title"
              onChange={handleChange}
              type="text"
              placeholder="Title"
              className="input input-bordered input-primary w-full max-w-xs"
            />

            <input
              name="postImage"
              onChange={handleChange}
              type="file"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            />

            <textarea
              name="content"
              onChange={handleChange}
              className="textarea textarea-bordered textarea-lg w-full max-w-xs"
              placeholder="Write your blog here"
            ></textarea>

            <button onClick={handleSubmit} className="btn btn-primary">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
