import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Heropage() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to EnlightenHub!</h1>
          <p className="py-6">
            Connect with a community of like-minded individuals who share a
            passion for learning and enlightenment. EnlightenHub is your central
            hub for insightful articles and thought-provoking discussions.
          </p>
          <Link to="/blogs">
            <button className="btn btn-primary mr-4">Join the Hub</button>
          </Link>
          <Link to="/blog/add">
            <button className="btn btn-primary">Write blog --{">"}</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Heropage;
