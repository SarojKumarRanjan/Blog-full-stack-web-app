import Theme from "../utils/Theme";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import { useContext } from "react";
import UserContext from "../Context/UserContext";

function Navbar() {
  const { setUser, user } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const deleteToken = localStorage.setItem("token", null);
    if (!deleteToken) {
      setUser(null);
      navigate("/");
      toast.success("Logged out successfully");
    }
  };
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Blog App
        </Link>
      </div>
      <div className="flex-none gap-2">
        {/* <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div> */}
       { !user? (<Link to="login">
          <button className="btn btn-primary p-[-8px]">login / signup</button>
        </Link>): (<Link >
          <button onClick={handleLogout} className="btn btn-primary p-[-8px]">logout</button>
        </Link>)}
        <Theme />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://emojiisland.com/cdn/shop/products/Emoji_Icon_-_Sunglasses_cool_emoji_large.png?v=1571606093"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>

            <li>
              <Link to="blogs">Blogs</Link>
            </li>
            <li>
              <Link>About</Link>
            </li>
            <li>
              <Link onClick={handleLogout}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
