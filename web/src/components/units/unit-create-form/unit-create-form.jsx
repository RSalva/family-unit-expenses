import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as UnitsApi from "../../../services/units-api";
import * as UsersApi from "../../../services/users-api"
import { useState, useEffect } from "react";

function UnitCreateForm({ className = "", to = "/units", currentUser}) {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({ mode: "all" });
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userToSearch, setUserInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const usersPerPage = 5;

  useEffect(() => {
    const listAllUsers = async () => {
      try {
        const results = await UsersApi.listUsers();
        const filteredResults = results.filter((user) => user.id !== currentUser.id);
        setAllUsers(filteredResults);
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error listing all users:", error);
      }
    };

    listAllUsers();
  }, []);

  useEffect(() => {
    if (userToSearch.trim()) {
      const filteredUsers = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(userToSearch.trim().toLowerCase()) &&
          !users.some((addedUser) => addedUser.id === user.id) 
      );
      setSearchResults(filteredUsers);
      setCurrentPage(1);
    } else {
      const filteredUsers = allUsers.filter(
        (user) => !users.some((addedUser) => addedUser.id === user.id) 
      );
      setSearchResults(filteredUsers);
    }
  }, [userToSearch, allUsers, users]);

  const paginatedResults = searchResults.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const onSubmitCreateUnit = async (unit) => {
    try {
      const createdUnit = await UnitsApi.createUnit({ ...unit, users });
      alert("Unit created successfully!");
      navigate(`/units/${createdUnit.id}`);
    } catch (error) {
      console.error(error);
  
      if (error.response?.data?.errors?.unit === "Unit already exists") {
        setError("name", { type: "manual", message: "A unit with this name already exists." });
      } else {
        const errors = error.response?.data.errors;
        if (errors) {
          Object.keys(errors).forEach((fieldName) => {
            setError(fieldName, { type: "manual", message: errors[fieldName] });
          });
        } else {
          setError("name", { type: "manual", message: error.message });
        }
      }
    }
  };

  const handleAddUser = (user) => {
    if (users.length >= 50) {
      alert("You can only add up to 50 users.");
      return;
    }
    setSearchResults((prev) => prev.filter((u) => u.id !== user.id));
    setUsers((prev) => [...prev, user]);
  };

  const handleRemoveUser = (userToRemove) => {
    setUsers((prev) => prev.filter((user) => user.id !== userToRemove.id));
    setSearchResults((prev) => [...prev, userToRemove]);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(searchResults.length / usersPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleUserSearch = () => {
    setShowUserSearch((prev) => !prev); 
  };

  return (
    <form onSubmit={handleSubmit(onSubmitCreateUnit)} className={className}>
      {/* NAME */}
      <div className="input-group mb-1">
        <span className="input-group-text"><i className="fa fa-home fa-fw"></i></span>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          placeholder="Unit Name"
          {...register("name", { required: "Unit name is required" })}
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name.message}</div>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="fa fa-align-left fa-fw"></i></span>
        <textarea
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          placeholder="Unit Description"
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters long",
            },
          })}
        ></textarea>
        {errors.description && (
          <div className="invalid-feedback">{errors.description.message}</div>
        )}
      </div>

      {/* TOGGLE USER SEARCH */}
      <button
        type="button"
        className="btn btn-outline-primary mb-3"
        onClick={toggleUserSearch}
      >
        {showUserSearch ? "Hide User Search" : "Add Users to the Unit"}
      </button>

      {/* USER SEARCH AND LIST */}
      {showUserSearch && (
        <>
          <div className="input-group mb-2">
            <span className="input-group-text"><i className="fa fa-user-plus fa-fw"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search user by username"
              value={userToSearch}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>

          {/* SEARCH RESULTS WITH PAGINATION */}
          {paginatedResults.length > 0 && (
            <>
              <ul className="list-group mb-2">
                {paginatedResults.map((user) => (
                  <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {user.username}
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAddUser(user)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleNextPage}
                  disabled={currentPage === Math.ceil(searchResults.length / usersPerPage)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* LIST OF ADDED USERS */}
      {users.length > 0 && (
        <div className="mb-3">
          <h6>Added Users:</h6>
          <ul className="list-group">
            {users.map((user) => (
              <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                {user.username}
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveUser(user)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button 
        className="btn btn-primary fw-light w-100 btn-sm" 
        type="submit" 
        disabled={!isValid}>
        CREATE UNIT
      </button>
    </form>
  );
}

export default UnitCreateForm;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              