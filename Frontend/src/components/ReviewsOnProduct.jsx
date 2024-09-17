import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaEllipsisV,
  FaEdit,
  FaTrashAlt,
  FaFlag,
} from "react-icons/fa";
import axios from "axios";
import SignInPopup from "./SignInPopup";
import { useParams } from "react-router-dom";
import ErrorToast from "./ErrorToast";
import SuccessToast from "./SuccessToast";
import { formatDistanceStrict } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@material-tailwind/react";

const ReviewsOnProduct = () => {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [selectedStar, setSelectedStar] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showMenuForComment, setShowMenuForComment] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);
  const userId = localStorage.getItem("userId");
  const { productId } = useParams();

  const fetchCommentsAndRatings = async (page) => {
    try {
      const response = await axios.get(
        `/api/reviews/product/${productId}/all-comments`,
        {
          params: { page, limit: 6 },
        }
      );

      if (response.status === 200) {
        setComments(response.data.data.comments);
        setTotalPages(response.data.data.totalPages);

        const ratingsResponse = await axios.get(
          `/api/reviews/product/${productId}/avg-rating`
        );
        setAverageRating(ratingsResponse.data.data.averageRating);
        setTotalRating(ratingsResponse.data.data.totalRating);

        const distributionResponse = await axios.get(
          `/api/reviews/product/${productId}/rating-distribution`
        );
        setRatingDistribution(
          distributionResponse.data.data.ratingDistribution
        );
        console.log(
          "This is distributon data",
          distributionResponse.data.data.ratingDistribution
        );

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const userRatingResponse = await axios.get(
              `/api/reviews/product/${productId}/rating`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (userRatingResponse.data && userRatingResponse.data.data) {
              setUserRating(userRatingResponse.data.data.rating);
            } else {
              setUserRating(null);
            }
          } catch (error) {
            setUserRating(null);
          }
        } else {
          setUserRating(null);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCommentsAndRatings(currentPage);
  }, [productId, currentPage]);

  const handleMouseEnter = (index) => {
    setHoveredStar(index);
  };

  const handleMouseLeave = () => {
    setHoveredStar(null);
  };

  const handleClick = (index) => {
    setSelectedStar(index);
  };

  const handleRatingSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.post(
        `/api/reviews/product/${productId}/rating`,
        { rating: selectedStar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        SuccessToast("Rating submitted successfully!");
        setUserRating(selectedStar);
        fetchCommentsAndRatings(currentPage);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      ErrorToast("Failed to submit rating.");
    }
  };

  const renderStars = () => {
    const starCount = hoveredStar || selectedStar || averageRating;
    return [1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        className={` cursor-pointer text-2xl transition-transform duration-300 ${
          star <= starCount ? "text-yellow-600" : "text-gray-300"
        }`}
        onMouseEnter={() => handleMouseEnter(star)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(star)}
      />
    ));
  };

  const renderProgressBars = () => {
    return [5, 4, 3, 2, 1].map((star) => {
      const percentage =
        (ratingDistribution[star - 1] / totalRating) * 100 || 0;
      return (
        <div key={star} className="flex items-center mb-3 space-x-3">
          <span className="w-12 text-right text-gray-600">{star} star</span>
          <div className="flex-1 bg-gray-200 h-3 rounded-lg relative">
            <div
              className="bg-yellow-500 h-3 rounded-lg absolute top-0 left-0"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-gray-600">{Math.round(percentage)}%</span>
        </div>
      );
    });
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleEditCommentChange = (e) => setEditCommentText(e.target.value);

  const handleCommentSubmit = async (e) => {
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
        setComment("");
        fetchCommentsAndRatings(currentPage);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      ErrorToast("Failed to submit comment.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCommentText) {
      alert("Please write something to update the comment.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPopup(true);
      return;
    }
    try {
      const response = await axios.patch(
        `/api/reviews/comment/${editCommentId}`,
        { comment: editCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        SuccessToast("Comment updated successfully!");
        setEditCommentId(null);
        setEditCommentText("");
        fetchCommentsAndRatings(currentPage);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      ErrorToast("Failed to update comment.");
    }
  };

  const handleEditClick = (commentId, commentText) => {
    setEditCommentId(commentId);
    setEditCommentText(commentText);
    setShowMenuForComment(null);
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPopup(true);
      return;
    }
    try {
      const response = await axios.delete(`/api/reviews/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        SuccessToast("Comment deleted successfully!");
        fetchCommentsAndRatings(currentPage);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      ErrorToast("Failed to delete comment.");
    }
  };

  const handleMenuToggle = (commentId) =>
    setShowMenuForComment(showMenuForComment === commentId ? null : commentId);

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditCommentText("");
  };

  const handleReportComment = () => {
    alert("This comment has been reported.");
    setShowMenuForComment(null);
  };

  const handlePopupClose = () => setShowPopup(false);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex flex-col lg:flex-row gap-8 p-6  rounded-lg shadow-md">
        <div className="flex-1 mb-6 lg:mb-0">
          <h2 className="text-3xl font-semibold mb-1 text-gray-800">
            {averageRating.toFixed(1)}
          </h2>
          <p className="text-gray-700 mb-2">Total Ratings: {totalRating}</p>

          <div className="mb-4 flex items-center space-x-3">
            {renderStars()}
          </div>
          <Button color="yellow" onClick={handleRatingSubmit}>
            Submit Rating
          </Button>
        </div>

        {totalRating > 0 && (
          <div className="flex-1">
            <p className="text-xl font-bold mb-3 text-gray-800">
              Rating Distribution
            </p>
            {renderProgressBars()}
          </div>
        )}
      </div>

      <div className="comment-section border-t border-gray-300 pt-4">
        <h2 className="text-lg font-semibold mb-2">Leave a Comment</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 resize-none"
            placeholder="Write your comment here..."
          />
          <Button
            type="submit"
            className="bg-black hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Submit
          </Button>
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
              className="comment-item border-b border-gray-300 py-2 flex justify-between"
            >
              <div className="flex-grow">
                {editCommentId === comment._id ? (
                  <form onSubmit={handleEditSubmit}>
                    <textarea
                      value={editCommentText}
                      onChange={handleEditCommentChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                      placeholder="Update your comment here..."
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded-lg"
                      >
                        Save
                      </Button>
                      <Button
                        type="Button"
                        onClick={handleCancelEdit}
                        className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-gray-700 mb-1">{comment.comment}</p>
                    <small className="text-gray-500">
                      @{comment.user.firstName} {comment.user.lastName} ·{" "}
                      {formatDistanceStrict(
                        new Date(comment.createdAt),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </small>
                  </>
                )}
              </div>

              <div className="relative">
                <FaEllipsisV
                  className="cursor-pointer text-gray-600 hover:text-gray-900"
                  onClick={() => handleMenuToggle(comment._id)}
                />
                {showMenuForComment === comment._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {comment.user._id === userId ? (
                      <ul className="flex flex-col p-2">
                        <li
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                          onClick={() =>
                            handleEditClick(comment._id, comment.comment)
                          }
                        >
                          <FaEdit className="text-blue-600" />
                          <span>Edit</span>
                        </li>
                        <li
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <FaTrashAlt className="text-red-600" />
                          <span>Delete</span>
                        </li>
                      </ul>
                    ) : (
                      <ul className="flex flex-col p-2">
                        <li
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                          onClick={handleReportComment}
                        >
                          <FaFlag className="text-yellow-600" />
                          <span>Report</span>
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div className="pagination flex justify-center mt-4">
          <Button
            onClick={handlePreviousPage}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg mr-2"
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg"
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {showPopup && <SignInPopup onClose={handlePopupClose} />}
    </div>
  );
};

export default ReviewsOnProduct;
