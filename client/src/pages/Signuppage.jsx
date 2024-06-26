import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import  UserContext  from "../Context/UserContext"
import { Link } from "react-router-dom";

export default function Signup() {
  const{setUser} = useContext(UserContext)
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[name,setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    if (email && password) {
      setLoading(true);
      axios
        .post(import.meta.env.VITE_BASE_URL + "/user/signup", {
          email: email,
          password: password,
          name:name
        })
        .then((res) => {
          //console.log(res.data);
          setLoading(false);
          if (res.data) {
            localStorage.setItem("token", res.data.jwt);
            
            setUser(res.data.user);
            navigate("/");
            toast.success("Account created in successfully");
          }
        })
        .catch((error) => {
          toast.error("Failed to signup");
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={(e) => e.preventDefault()}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="label">
                  <Link to="/login" className="label-text-alt link link-hover">
                 Already have an account?  Sign In
                  </Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" onClick={handleSignup}>
                  Signup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


