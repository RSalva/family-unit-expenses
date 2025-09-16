function UserProfile({ user }) {
  return (
    <div className="d-flex align-items-center">
      {/* Avatar */}
      <img
        src={user.avatar}
        alt={`${user.name}'s avatar`}
        className="rounded-circle me-3"
        style={{ width: "80px", height: "80px", objectFit: "cover" }}
      />

      {/* User Details */}
      <div>
        <h4 className="mb-1">{user.name}</h4>
        <p className="mb-1 text-muted">
          <i className="fa fa-user me-2"></i> {user.username}
        </p>
        <p className="mb-0 text-muted">
          <i className="fa fa-envelope me-2"></i> {user.email}
        </p>
      </div>
    </div>
  );
}

export default UserProfile;