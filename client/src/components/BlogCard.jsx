import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types, no-unused-vars
function BlogCard({ title, content, id, authorId ,imageUrl}) {
  return (
    <div className="card card-side bg-base-100 shadow-xl" style={{ width: "70%" }}>
      <figure>
        <img
        className="rounded-md"
          src={imageUrl+"-/scale_crop/300x300/smart/"}
          alt="post image"
          
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{content}</p>
        <div className="card-actions justify-end">
          <Link to={`/blog/${id}`} >
          <button className="btn btn-primary">Read more...</button>
            
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
