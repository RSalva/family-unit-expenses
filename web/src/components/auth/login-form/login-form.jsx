import { useForm } from "react-hook-form";
import * as UsersApi from "../../../services/users-api";
import { useAuth } from "../../../contexts/auth";
import { useNavigate } from "react-router";

function LoginForm({ className = "", to = "/" }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({ mode: "all" });

  const onSubmitLogin = async (user) => {
    try {
      user = await UsersApi.login(user);
      login(user);
      navigate(to);
    } catch (error) {
      const errors = error.response?.data.errors;
      if (errors) {
        Object.keys(errors)
          .forEach((fieldName) => {
            setError(
              fieldName, 
              { type: "manual", message: errors[fieldName] }
            );
          });
      } else {
        console.error(error);
        setError(
          "password",
          { type: "manual", message: error.message }
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitLogin)} className={className}>

      {/* USERNAME */}
      <div className="input-group mb-1">
        <span className="input-group-text"><i className="fa fa-user fa-fw"></i></span>
        <input 
          type="text"
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && (
          <div className="invalid-feedback">{errors.username.message}</div>
        )}
      </div>

      {/* PASSWORD */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="fa fa-lock fa-fw"></i></span>
        <input 
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          placeholder="******"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>


      <button className="btn btn-primary fw-light w-100 btn-sm" type="submit" disabled={!isValid}>LOGIN</button>

    </form>
  );
}

export default LoginForm;