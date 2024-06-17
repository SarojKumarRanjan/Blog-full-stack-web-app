// eslint-disable-next-line react/prop-types
function BlogCard({ title,content,id,authorId}) {
  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{content}</p>
        <p>{id}</p>
        <p>{authorId}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Read More..</button>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
