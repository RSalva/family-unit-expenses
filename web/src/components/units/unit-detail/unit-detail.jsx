import React, { useEffect, useState } from "react";
import * as UnitsApi from "../../../services/units-api";
import * as UsersApi from "../../../services/users-api";
import { useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";

function UnitDetail({ className = "", to = "/units", currentUser}) {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false); 
  const [isEditingDescription, setIsEditingDescription] = useState(false); 
  
  const usersPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const { register, handleSubmit, setValue, watch } = useForm({
    mode: "all",
    defaultValues: {
      userToSearch: "",
      name: "",
      description: "",
    },
  });

  const userToSearch = watch("userToSearch");
  const name = watch("name");
  const description = watch("description");

  useEffect(() => {
    async function fetchUnit() {
      const unit = await UnitsApi.getUnitById(id);
      setUnit(unit);
      setValue("name", unit.name);
      setValue("description", unit.description);
      setLoading(false);
    }

    fetchUnit();
  }, [id, setValue]);

  useEffect(() => {
    const listAllUsers = async () => {
      try {
        const results = await UsersApi.listUsers();
        setAllUsers(results);
        setSearchResults(results);
      } catch (error) {
        console.error("Error listing all users:", error);
      }
    };

    listAllUsers();
  }, []);

  // Filter users based on the search input and exclude already added users
  useEffect(() => {
    if (userToSearch.trim()) {
      const filteredUsers = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(userToSearch.trim().toLowerCase()) &&
          !usersToAdd.some((addedUser) => addedUser.id === user.id) && 
          !(unit && unit.users.some((unitUser) => unitUser.user.id === user.id))
      );
      setSearchResults(filteredUsers);
      setCurrentPage(1);
    } else {
      const filteredUsers = allUsers.filter(
        (user) => 
          !usersToAdd.some((addedUser) => addedUser.id === user.id) && 
          !(unit && unit.users.some((unitUser) => unitUser.user.id === user.id))
      );
      setSearchResults(filteredUsers);
    }
  }, [userToSearch, allUsers, usersToAdd, unit]);

  // Pagination
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Handlers
  const handleAddUser = (user) => {
    setSearchResults((prev) => prev.filter((u) => u.id !== user.id));
    setUsersToAdd((prev) => [...prev, user]);
    
  };

  const handleRemoveUser = (userToRemove) => {
    setUsersToAdd((prev) => prev.filter((user) => user.id !== userToRemove.id));
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

  const toggleEditName = () => {
    setIsEditingName((prev) => !prev); 
  };

  const toggleEditDescription = () => {
    setIsEditingDescription((prev) => !prev); 
  };

  const onSubmit = async (data) => {
    try {
      const { name, description } = data;

      if (name !== unit.name || description !== unit.description) {
        await UnitsApi.updateUnit(id, { name, description });
      }
      
      if (usersToAdd.length > 0) {
        console.log(usersToAdd);
        await UnitsApi.addUsersToUnit(id, { users: usersToAdd });
      }

      alert("Changes applied successfully!");
      setUsersToAdd([]); 
      const updatedUnit = await UnitsApi.getUnitById(id); 
      setUnit(updatedUnit);
      setIsEditingName(false);
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Error adding users to the unit:", error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <ClipLoader color="#007bff" size={50} />
      </div>
    );
  }

  if (!unit) {
    return <div className="text-center">Unit not found.</div>;
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Unit Header */}
          <div className="d-flex align-items-center mb-3">
            <img
              src={unit.icon}
              alt={`${unit.name} icon`}
              className="rounded-circle me-3"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <div>
              <div className="d-flex align-items-center">
                {isEditingName ? (
                  <input
                    type="text"
                    className="form-control form-control-sm me-2"
                    {...register("name", { required: "Name is required" })}
                  />
                ) : (
                  <h5 className="card-title mb-0">{unit.name}</h5>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={toggleEditName}
                >
                  {isEditingName ? "Cancel" : <i className="fa fa-pen"></i>}
                </button>
              </div>
              <div className="d-flex align-items-center">
                {isEditingDescription ? (
                  <input
                    type="text"
                    className="form-control form-control-sm me-2"
                    {...register("description", { required: "Description is required" })}
                  />
                ) : (
                  <p className="text-muted mb-0">{unit.description}</p>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={toggleEditDescription}
                >
                  {isEditingDescription ? "Cancel" : <i className="fa fa-pen"></i>}
                </button>
              </div>
            </div>
          </div>

          {/* Users Section */}
          <div className="mb-3">
            <h6 className="fw-bold">Users</h6>
            <div className="d-flex flex-wrap">
              {unit.users.map((user) => (
                <div
                  key={user.user.id}
                  className="d-flex align-items-center me-3 mb-2"
                >
                  <img
                    src={user.user.avatar}
                    alt={`${user.name}'s avatar`}
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                  <div>
                    <span className="fw-bold">{user.user.username}</span>
                    <br />
                    <small className="text-muted">Role: {user.role}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle User Search */}
          <button
            type="button"
            className="btn btn-outline-primary mb-3"
            onClick={toggleUserSearch}
          >
            {showUserSearch ? "Hide User Search" : "Add Users to the Unit"}
          </button>

          {/* User Search and List */}
          {showUserSearch && (
            <>
              {/* Search Users */}
              <div className="input-group mb-2">
                <span className="input-group-text"><i className="fa fa-user-plus fa-fw"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search user by username"
                  {...register("userToSearch")}
                />
              </div>

              {/* Search Results with Pagination */}
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

          {/* Selected Users to Add */}
          {usersToAdd.length > 0 && (
            <div className="mb-3">
              <h6>Selected Users to Add:</h6>
              <ul className="list-group">
                {usersToAdd.map((user) => (
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

          {/* Submit changes */}
          {(usersToAdd.length > 0 || description !== unit.description) && (
            <div className="mb-3">
              <button
                type="submit"
                className="btn btn-primary mt-2"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UnitDetail;