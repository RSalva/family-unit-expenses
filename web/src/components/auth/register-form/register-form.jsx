import { useForm } from "react-hook-form";
import * as UsersApi from "../../../services/users-api";
import { useNavigate } from "react-router";

function RegisterForm({ className = "", to = "/login" }) {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({ mode: "all" });

  const onSubmitRegister = async (user) => {
    try {
      console.log(user);
      await UsersApi.register(user);
      alert("Registration successful! You can now log in.");
      navigate(to);
    } catch (error) {
      console.error(error);
      const errors = error.response?.data.errors;
      if (errors) {
        Object.keys(errors).forEach((fieldName) => {
          setError(fieldName, { type: "manual", message: errors[fieldName] });
        });
      } else {
        console.error(error);
        setError("password", { type: "manual", message: error.message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitRegister)} className={className}>
      {/* NAME */}
      <div className="input-group mb-1">
        <span className="input-group-text"><i className="fa fa-user fa-fw"></i></span>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name.message}</div>
        )}
      </div>

      {/* USERNAME */}
      <div className="input-group mb-1">
        <span className="input-group-text"><i className="fa fa-user fa-fw"></i></span>
        <input
          type="text"
          className={`form-control ${errors.username ? "is-invalid" : ""}`}
          placeholder="Username"
          {...register("username", { 
            required: "Username is required", 
            minLength: { 
              value: 3, 
              message: "Username must be at least 3 characters long" 
            },
          })}
        />
        {errors.username && (
          <div className="invalid-feedback">{errors.username.message}</div>
        )}
      </div>

      {/* EMAIL */}
      <div className="input-group mb-1">
        <span className="input-group-text"><i className="fa fa-envelope fa-fw"></i></span>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      {/* PASSWORD */}
      <div className="input-group mb-2">
        <span className="input-group-text"><i className="fa fa-lock fa-fw"></i></span>
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          placeholder="******"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <button 
        className="btn btn-primary fw-light w-100 btn-sm" 
        type="submit" 
        disabled={!isValid}>
        REGISTER
      </button>
    </form>
  );
}

export default RegisterForm;