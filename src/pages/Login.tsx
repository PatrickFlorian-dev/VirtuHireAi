import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";
import { AppDispatch, RootState } from "../store/store";

type LoginFormInputs = {
  username: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<LoginFormInputs>({
    mode: "onChange",
  });
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const username = watch("username");
  const password = watch("password");

  const onSubmit = async (data: LoginFormInputs) => {
    await dispatch(loginUser(data));
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
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register("username", { required: "Username is required" })}
            placeholder="Username"
            className="border p-2 w-full rounded"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className="border p-2 w-full rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={!username || !password || !isValid}
          className={`px-4 py-2 w-full rounded ${
            !username || !password || !isValid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
