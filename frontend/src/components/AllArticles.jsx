import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { BsArrowRightCircle } from "react-icons/bs";
import { FcClock } from "react-icons/fc";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function AllArticles() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const gotoArticleView = (article) => navigate(`../${article._id}`);

  useEffect(() => {
    if (!currentUser?.email) return;

    let active = true;

    (async () => {
      try {
        setLoading(true);

        const token = await getToken();

        const res = await fetch(`${API_URL}/user-api/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load articles");
        }

        if (active) {
          setArticles(data.payload);
        }
      } catch (error) {
        if (active) {
          setErr(error.message || "Unable to load articles");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [currentUser?.email, getToken]);

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
      {err && <p className="text-danger">{err}</p>}

      {loading && <p>Loading articles...</p>}

      {!loading && !err && articles.length === 0 && (
        <p>No articles yet.</p>
      )}

      {!loading &&
        articles.map((article) => (
          <div className="col" key={article._id}>
            <div className="card h-100">
              <div className="card-body">
                <div className="author-details text-end">
                  {article.author?.profileImageUrl && (
                    <img
                      src={article.author.profileImageUrl}
                      width="40"
                      className="rounded-circle"
                      alt="Author"
                    />
                  )}

                  <p>
                    <small className="text-secondary">
                      {[article.author?.firstName, article.author?.lastName]
                        .filter(Boolean)
                        .join(" ")}
                    </small>
                  </p>
                </div>

                <h5 className="card-title">{article.title}</h5>

                <p className="card-text">
                  {article.content.slice(0, 80)}
                  {article.content.length > 80 ? "..." : ""}
                </p>

                <button
                  className="custom-btn btn-4"
                  onClick={() => gotoArticleView(article)}
                >
                  <span>
                    Read More <BsArrowRightCircle />
                  </span>
                </button>
              </div>

              <div className="card-footer">
                <small className="text-body-secondary">
                  <FcClock className="fs-4 me-2" />
                  Last updated{" "}
                  {new Date(article.updatedAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default AllArticles;