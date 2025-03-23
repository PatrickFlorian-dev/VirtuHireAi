import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/userSlice";
import { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { User } from "../interfaces/userTypes";
import { RegisterFormInputs } from "../interfaces/forms/registerFormInputs";
import { mapRegisterFormToUser } from "../utils/mapping/formToObjMapper";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormInputs>({ mode: "onChange" });

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const username = watch("username");
  const email = watch("email");
  const password = watch("password");
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const companyName = watch("companyName");

  const onSubmit = async (data: RegisterFormInputs) => {
    const user: User = mapRegisterFormToUser(data);
    await dispatch(registerUser(user));
    await navigate("/profile");
  };

  if (user?.username) {
    return (
      <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
        <h2 className="text-2xl font-semibold">Welcome {user.username} 🎉</h2>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register("firstName", { required: "First name is required" })}
            placeholder="First Name"
            className="border p-2 w-full rounded"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        <div className="mb-4">
          <input
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Last Name"
            className="border p-2 w-full rounded"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>

        <div className="mb-4">
          <input
            {...register("username", { required: "Username is required", minLength: { value: 3, message: "Must be at least 3 characters" } })}
            placeholder="Username"
            className="border p-2 w-full rounded"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <input
            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } })}
            placeholder="Email"
            className="border p-2 w-full rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Must be at least 6 characters" } })}
            placeholder="Password"
            className="border p-2 w-full rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="mb-4">
          <input
            {...register("companyName", { required: "Company name is required" })}
            placeholder="Company Name"
            className="border p-2 w-full rounded"
          />
          {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
        </div>

        {/* Hidden roleId input */}
        <input type="hidden" value={4} {...register("roleId")} />

        <button
          type="submit"
          disabled={!username || !email || !password || !firstName || !lastName || !companyName || !isValid}
          className={`px-4 py-2 w-full rounded ${!username || !email || !password || !firstName || !lastName || !companyName || !isValid ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
