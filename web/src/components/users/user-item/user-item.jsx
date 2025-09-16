import { useAuth } from "../../../contexts/auth";

function UserItem({ user, onDelete }) {
  const { isAdmin } = useAuth();
  return (
    <li className="list-group-item d-flex">
      <div className="me-auto">{user.username}</div>
      <div>
        {isAdmin && (<i className="fa fa-times text-danger" role="button" onClick={onDelete}></i>)}
      </div>
    </li>
  )
}

export default UserItem;