import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";

function CreateRoom() {
  const [name, setName] = useState(""); // empty string for smoother input UX
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (name.trim().length === 0) {
      isValid = false;
      newErrors.name = "Name is mandatory";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form behavior

    if (validate()) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${serverEndpoint}/rooms`, // ✅ corrected path
          { createdBy: name.trim() },
          { withCredentials: true }
        );

        navigate(`/room/${response.data.roomCode}`);
      } catch (error) {
        console.error(error);
        setErrors({ message: "Error creating room, please try again" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <form onSubmit={handleSubmit}>
            <h2 className="mb-4 text-center">Create Room</h2>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className={errors.name ? "form-control is-invalid" : "form-control"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
              <div className="invalid-feedback">{errors.name}</div>
            </div>

            {errors.message && (
              <div className="text-danger mb-3 text-center">
                {errors.message}
              </div>
            )}

            <div className="mb-3">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Creating Room..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
