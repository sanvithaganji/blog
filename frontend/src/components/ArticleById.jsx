import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@clerk/clerk-react";
import { UserContext } from "../contexts/userContext";
import {
  FcClock,
  FcCalendar,
  FcComments,
  FcPortraitMode,
} from "react-icons/fc";
import { BiCommentAdd } from "react-icons/bi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function ArticleById() {
  const { articleId } = useParams();
  const { getToken } = useAuth();
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [commentStatus, setCommentStatus] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({
    title: "",
    category: "",
    content: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const token = await getToken();

        const res = await fetch(
          `${API_URL}/user-api/articles/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load article");
        }

        if (active) {
          setArticle(data.payload);
        }
      } catch (e) {
        if (active) {
          setError(e.message || "Unable to load article");
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [articleId, getToken]);

  const addComment = async ({ comment }) => {
    try {
      const token = await getToken();

      const res = await fetch(`${API_URL}/user-api/comment/${articleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add comment");
      }

      setArticle((previous) => ({
        ...previous,
        comments: data.payload.comments,
      }));

      setCommentStatus("Comment added successfully");
      reset();
    } catch (e) {
      setCommentStatus(e.message || "Failed to add comment");
    }
  };

  const saveArticle = async (event) => {
    event.preventDefault();

    try {
      const token = await getToken();

      const res = await fetch(
        `${API_URL}/author-api/articles/${articleId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFields),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not update article");
      }

      setArticle((previous) => ({
        ...previous,
        ...data.payload,
      }));

      setEditMode(false);
      setCommentStatus("Article updated successfully");
    } catch (e) {
      setCommentStatus(e.message || "Could not update article");
    }
  };

  const deleteArticle = async () => {
    if (!window.confirm("Delete this article?")) {
      return;
    }

    try {
      const token = await getToken();

      const res = await fetch(
        `${API_URL}/author-api/articles/${articleId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not delete article");
      }

      navigate("/author-dashboard/articles");
    } catch (e) {
      setCommentStatus(e.message || "Could not delete article");
    }
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!article) {
    return <p>Loading article...</p>;
  }

  const isAuthor =
    currentUser?.role === "AUTHOR" &&
    String(article.author?._id) === String(currentUser?._id);

  return (
    <article>
      {editMode ? (
        <form onSubmit={saveArticle} className="mb-4">
          <label className="form-label">Title</label>

          <input
            className="form-control mb-3"
            required
            value={editFields.title}
            onChange={(e) =>
              setEditFields({
                ...editFields,
                title: e.target.value,
              })
            }
          />

          <label className="form-label">Category</label>

          <input
            className="form-control mb-3"
            required
            value={editFields.category}
            onChange={(e) =>
              setEditFields({
                ...editFields,
                category: e.target.value,
              })
            }
          />

          <label className="form-label">Content</label>

          <textarea
            className="form-control mb-3"
            rows="10"
            required
            value={editFields.content}
            onChange={(e) =>
              setEditFields({
                ...editFields,
                content: e.target.value,
              })
            }
          />

          <button className="btn btn-primary me-2">
            Save changes
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h1>{article.title}</h1>

          <small className="text-secondary me-3">
            <FcCalendar /> Created{" "}
            {new Date(article.createdAt).toLocaleDateString()}
          </small>

          <small className="text-secondary">
            <FcClock /> Updated{" "}
            {new Date(article.updatedAt).toLocaleDateString()}
          </small>

          <p
            className="lead mt-4"
            style={{ whiteSpace: "pre-line" }}
          >
            {article.content}
          </p>

          {isAuthor && (
            <div className="mb-4">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => {
                  setEditFields({
                    title: article.title,
                    category: article.category,
                    content: article.content,
                  });
                  setEditMode(true);
                }}
              >
                Edit article
              </button>

              <button
                className="btn btn-outline-danger"
                onClick={deleteArticle}
              >
                Delete article
              </button>
            </div>
          )}
        </>
      )}

      <section className="mt-5">
        <h4>Comments</h4>

        {article.comments?.length ? (
          article.comments.map((comment) => (
            <div
              key={comment._id}
              className="p-3 border rounded mb-2"
            >
              <p className="mb-1">
                <FcPortraitMode />{" "}
                <strong>{comment.user?.firstName || "User"}</strong>
              </p>

              <p className="mb-0">
                <FcComments /> {comment.comment}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}

        {commentStatus && (
          <p className="mt-2">{commentStatus}</p>
        )}

        {currentUser?.role === "USER" && (
          <form
            onSubmit={handleSubmit(addComment)}
            className="mt-3"
          >
            <input
              {...register("comment", { required: true })}
              className="form-control mb-3"
              placeholder="Write a comment..."
            />

            <button
              className="btn btn-success"
              disabled={isSubmitting}
            >
              Add Comment <BiCommentAdd />
            </button>
          </form>
        )}
      </section>
    </article>
  );
}

export default ArticleById;