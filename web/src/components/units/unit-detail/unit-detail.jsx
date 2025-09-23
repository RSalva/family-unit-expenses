import React, { useEffect, useState } from "react";
import * as UnitsApi from "../../../services/units-api";
import * as UsersApi from "../../../services/users-api";
import { AcceptDeny } from "../../modal";
import { useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { ExpensesList } from "../../expenses";

function UnitDetail({ className = "", to = "/units", currentUser}) {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [usersToRemove, setUsersToRemove] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false); 
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const navigate = useNavigate();
  
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
  const handleAddUser = (userToAdd) => {
    setSearchResults((prev) => prev.filter((user) => user.id !== userToAdd.id));
    setUsersToAdd((prev) => [...prev, userToAdd]);
    
  };

  const handleRemoveUser = (userToRemove) => {
    setUsersToAdd((prev) => prev.filter((user) => user.id !== userToRemove.id));
    setSearchResults((prev) => [...prev, userToRemove]);
  };

  const handleSelectUserToRemove = (user) => {
    setUsersToRemove((prev) => {
      if (prev.some((u) => u.id === user.user.id)) {
        return prev.filter((u) => u.id !== user.user.id);
      } else {
        return [...prev, { id: user.user.id, username: user.user.username, role: user.role }];
      }
    });
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

  const handleDeleteUnit = async () => {
    try {
      await UnitsApi.deleteUnit(unit.id);
      alert("Unit deleted successfully!");
      navigate("/units");
    } catch (error) {
      console.error("Error deleting the unit:", error);
      alert("Failed to delete the unit. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    try {
      const { name, description } = data;

      if (name !== unit.name || description !== unit.description) {
        await UnitsApi.updateUnit(id, { name, description });
      }
      
      if (usersToAdd.length > 0) {
        console.log("Users to add in unit-detail:", usersToAdd);
        await UnitsApi.addUsersToUnit(id, { users: usersToAdd });
      }
      
      if (usersToRemove.length > 0) {
        console.log("Users to remove in unit-detail:", usersToRemove);
        await UnitsApi.removeUsersFromUnit(id, { users: usersToRemove });
      }

      alert("Changes applied successfully!");
      setUsersToAdd([]); 
      setUsersToRemove([]);

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
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Unit Header */}
            <div className="d-flex align-items-center mb-4">
              <img
                src={unit.icon}
                alt={`${unit.name} icon`}
                className="rounded-circle me-3 border border-primary"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div>
                <div className="d-flex align-items-center mb-2 gap-2">
                  {isEditingName ? (
                    <input
                      type="text"
                      className="form-control form-control-sm me-2"
                      {...register("name", { required: "Name is required" })}
                    />
                  ) : (
                    <h4 className="card-title mb-0 text-primary fw-bold">{unit.name}</h4>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={toggleEditName}
                  >
                    {isEditingName ? "Cancel" : <i className="fa fa-pen"></i>}
                  </button>
                </div>
                <div className="d-flex align-items-center gap-2">
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
                    className="btn btn-sm btn-outline-primary"
                    onClick={toggleEditDescription}
                  >
                    {isEditingDescription ? "Cancel" : <i className="fa fa-pen"></i>}
                  </button>
                </div>
                {/* Delete Unit Button */}
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Unit
                </button>

                {/* Reusable Modal */}
                {showDeleteModal && (
                  <AcceptDeny
                    title="Confirm Deletion"
                    message="Are you sure you want to delete this unit?"
                    onConfirm={() => {
                      setShowDeleteModal(false);
                      handleDeleteUnit();
                    }}
                    onCancel={() => setShowDeleteModal(false)}
                    confirmText="Delete"
                    cancelText="Cancel"
                  />
                )}

              </div>
            </div>

            {/* Users Section */}
            <div className="mb-4">
              <h5 className="fw-bold text-secondary">Users</h5>
              <div className="d-flex flex-wrap gap-2">
                {unit.users.map((user) => (
                  <div
                    key={user.user.id}
                    className={`d-flex align-items-center p-3 border rounded shadow-sm ${
                      usersToRemove.some((u) => u.id === user.user.id) ? "bg-danger text-white" : "bg-light"
                    }`}
                    onClick={() => handleSelectUserToRemove(user)}
                    style={{ cursor: "pointer", minWidth: "250px" }}
                  >
                    <img
                      src={user.user.avatar}
                      alt={`${user.name}'s avatar`}
                      className="rounded-circle me-3 border"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                    <div>
                      <span className="fw-bold">{user.user.username}</span>
                      <br />
                      <small className="text-muted">Role: {user.role}</small>
                    </div>
                    {usersToRemove.some((u) => u.id === user.user.id) && (
                      <i className="fa fa-trash ms-2" title="Selected for deletion"></i>
                    )}
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

            {(usersToAdd.length > 0 || usersToRemove.length > 0 || description !== unit.description || name !== unit.name) && (
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary mt-3 px-4 py-2 fw-bold"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
          
          <div className="mb-3">
            <ExpensesList expenses={unit.expenses} unitId={unit.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnitDetail;