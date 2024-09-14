import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorToast from "./ErrorToast";
import LoadingOverlay from "./LoadingOverlay";
import { Button, Input } from "@material-tailwind/react";

const UserList = ({ onDelete, showFullDetails = true }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers(page, limit);
  }, [page]);

  const fetchUsers = async (currentPage, limit) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`/api/users/get-all-users`, {
        params: { page: currentPage, limit },
      });

      const { allUsers, totalUsers } = data.data;
      setUsers(allUsers);
      setTotalUsers(totalUsers);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
      ErrorToast("Failed to fetch users. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(totalUsers / limit);
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users, searchQuery]
  );

  const sortedUsers = useMemo(
    () =>
      !showFullDetails
        ? filteredUsers.sort(
            (a, b) => (b.activityScore || 0) - (a.activityScore || 0)
          )
        : filteredUsers,
    [filteredUsers, showFullDetails]
  );

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="max-w-[80%] mx-auto p-4">
      {showFullDetails && (
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          User List
        </h1>
      )}

      {loading ? (
        <LoadingOverlay />
      ) : (
        <>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="mb-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              label="Type to Search"
              variant="outlined"
              size="lg"
              color="blue"
              placeholder="Search by email..."
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  {showFullDetails ? (
                    <>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-sm md:text-base">
                        Full Name
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-sm md:text-base">
                        Email
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-sm md:text-base">
                        Gender
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-sm md:text-base">
                        Contact Info
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-sm md:text-base">
                        Registered Date
                      </th>
                      {onDelete && (
                        <th className="py-2 md:py-3 px-2 md:px-4 text-left text-sm md:text-base">
                          Actions
                        </th>
                      )}
                    </>
                  ) : (
                    <>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-sm md:text-base">
                        Full Name
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-sm md:text-base">
                        Email
                      </th>
                      <th className="py-2 md:py-3 px-2 md:px-4 text-left text-sm md:text-base">
                        Activity Score
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    {showFullDetails ? (
                      <>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base">{`${user.firstName} ${user.lastName}`}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base">
                          {user.email}
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base">
                          {user.gender}
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base">
                          {user.contactInfo || "N/A"}
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base">
                          {new Date(user.registeredDate).toLocaleDateString()}
                        </td>
                        {onDelete && (
                          <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base">
                            <button
                              onClick={() => onDelete(user._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </>
                    ) : (
                      <>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base">
                          {`${user.firstName} ${user.lastName}`}
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base">
                          {user.email}
                        </td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-sm md:text-base">
                          {user.activityScore ?? 0}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
            <Button
              className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded  w-full md:w-auto"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-gray-700 text-sm md:text-base">
              Page {page} of {totalPages}
            </span>
            <Button
              className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded w-full md:w-auto"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default UserList;
