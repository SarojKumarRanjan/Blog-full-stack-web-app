import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const truncateText = (text, numWords) => {
  const words = text.split(" ");
  if (words.length > numWords) {
    return words.slice(0, numWords).join(" ") + "...";
  }
  return text;
};

// eslint-disable-next-line react/prop-types, no-unused-vars
function BlogCard({ title, content, id, authorId, imageUrl }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const truncatedTitle = truncateText(title, isMobile ? 5 : 10);
  const truncatedContent = truncateText(content, isMobile ? 12 : 20);

  return (
    <div className="card card-side bg-base-100 shadow-xl w-full lg:w-1/2">
      <figure>
        <img
          className="rounded-md"
          src={`${imageUrl}-/scale_crop/300x300/smart/`}
          alt="post image"
        />
      </figure>
      <div className="card-body">
        <h2 className={`card-title ${isMobile ? 'text-sm' : 'text-lg'}`}>{truncatedTitle}</h2>
        <p className={isMobile ? 'text-xs' : 'text-base'}>{truncatedContent}</p>
        <div className="card-actions justify-end">
          <Link to={`/blog/${id}`}>
            <button className="btn btn-primary">Read more...</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
