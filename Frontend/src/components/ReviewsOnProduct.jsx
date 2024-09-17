import React, { useContext, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { ProductContext } from "../context/ProductContext";
import axios from "axios"; // Ensure axios is imported
import SignInPopup from "./SignInPopup";
import { useNavigate } from "react-router-dom";
import ErrorToast from "./ErrorToast";
import SuccessToast from "./SuccessToast";
import "react-toastify/dist/ReactToastify.css";

const ReviewsOnProduct = () => {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [selectedStar, setSelectedStar] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const { productId } = useContext(ProductContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `/api/reviews/product/${productId}/all-comments`
        );
        if (response.status === 200) {
          setComments(response.data.data.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        alert("Failed to fetch comments.");
      }
    };

    fetchComments();
  }, [productId]);

  const handleMouseEnter = (index) => {
    setHoveredStar(index);
  };

  const handleMouseLeave = () => {
    setHoveredStar(null);
  };

  const handleClick = (index) => {
    setSelectedStar(index);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      alert("Please write a comment before submitting.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setShowPopup(true);
      return;
    }
    try {
      const response = await axios.post(
        `/api/reviews/product/${productId}/comment`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        SuccessToast("Comment added successfully!");
        setComment(""); // Clear the comment input
        const commentsResponse = await axios.get(
          `/api/reviews/product/${productId}/all-comments`
        );
        if (commentsResponse.status === 200) {
          setComments(commentsResponse.data.data.comments);
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      ErrorToast("Failed to submit comment.");
    }
  };

  const handleNavigate = () => {
    navigate("/login");
  };
  const handlePopupClose = () => {
    setShowPopup(false);
  };
  return (
    <div className="container mx-auto px-4 py-2">
      <div className="ratings flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star, index) => {
          const isFilled = (hoveredStar || selectedStar) >= star;
          return (
            <FaStar
              key={index}
              className={`cursor-pointer text-2xl transition-transform duration-300 ${
                isFilled ? "text-yellow-600" : "text-gray-300"
              }`}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(star)}
            />
          );
        })}
      </div>

      <div className="comment-section border-t border-gray-300 pt-4">
        <h2 className="text-lg font-semibold mb-2">Leave a Comment</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 resize-none"
            placeholder="Write your comment here..."
          />
          <button
            type="submit"
            className="bg-black hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="comments-list border-t border-gray-300 pt-4 mt-4">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-600">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="comment-item border-b border-gray-300 py-2"
            >
              <div className="flex items-center mb-1">
                <span className="font-semibold">
                  {comment.user.firstName} {comment.user.lastName}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p>{comment.comment}</p>
            </div>
          ))
        )}
      </div>
      {showPopup && (
        <SignInPopup onClose={handlePopupClose} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default ReviewsOnProduct;
