import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import socket from "../config/socket";
import Question from "./Question";

function Room() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [room, setRoom] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [topQuestions, setTopQuestions] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);

  const fetchTopQuestions = async () => {
    setLoadingTop(true);
    try {
      const response = await axios.get(`${serverEndpoint}/rooms/${code}/top-questions`, {
        withCredentials: true,
      });
      setTopQuestions(response.data.topQuestions || []); // ✅ fixed here
    } catch (error) {
      console.error("Failed to fetch top questions:", error);
      setErrors({ message: "Unable to fetch top questions, please try again" });
    } finally {
      setLoadingTop(false);
    }
  };

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/rooms/${code}`, {
        withCredentials: true,
      });
      setRoom(response.data);
    } catch (error) {
      console.error(error);
      setErrors({ message: "Unable to fetch room details, please try again" });
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/rooms/${code}/questions`, {
        withCredentials: true,
      });
      setQuestions(response.data);
    } catch (error) {
      console.error(error);
      setErrors({ message: "Unable to fetch questions, please try again" });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRoom(), fetchQuestions()]);
      setLoading(false);
    };

    loadData();

    socket.emit("join-room", code);
    socket.on("new-question", (question) => {
      setQuestions((prev) => [question, ...prev]);
    });

    return () => {
      socket.off("new-question");
    };
  }, [code]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <h3>Loading...</h3>
        <p>Fetching room details</p>
      </div>
    );
  }

  if (errors.message) {
    return (
      <div className="container text-center py-5">
        <h3>Error</h3>
        <p>{errors.message}</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-2">Room {code}</h2>

      <button className="btn btn-sm btn-outline-success mb-2" onClick={fetchTopQuestions}>
        Get Top Questions
      </button>

      {loadingTop && <div className="text-muted">Loading top questions...</div>}

      {!loadingTop && topQuestions.length > 0 && (
        <div className="mt-3">
          <h5>Top Questions</h5>
          <ul className="list-group">
            {topQuestions.map((question, index) => (
              <li key={index} className="list-group-item">
                {question}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loadingTop && topQuestions.length === 0 && (
        <div className="text-muted mt-3">
          No top questions yet — be the first to ask something awesome!
        </div>
      )}

      <div className="row mt-4">
        <div className="col-auto">
          <ul className="list-group">
            {questions.map((q) => (
              <li key={q._id} className="list-group-item">
                {q.content}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row">
        <Question roomCode={code} />
      </div>
    </div>
  );
}

export default Room;
