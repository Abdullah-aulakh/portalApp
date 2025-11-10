import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { RoutePath } from "@/routes/routes";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import FullPageLoader from "@/components/FullPageLoader";

const LoginForm = () => {
  const navigate = useNavigate();
  const { response, error, loading, fetchData } = useAxios();
  const { setUser } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      await fetchData({ url: "auth/login", method: "post", data: values });
    },
  });

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Login successful!",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      setUser(response?.user || response);
      navigate(RoutePath.DASHBOARD || "/");
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to login. Please try again.",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  return (
    
    <>
  <div className="p-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-96 z-10">
    <div className="mb-6 text-center">
      <h3 className="text-2xl font-semibold text-gray-800">Login Account</h3>
      <p className="text-gray-500 text-sm mt-1">
        Welcome back! Please enter your credentials.
      </p>
    </div>
    {loading && <FullPageLoader />}

    <form onSubmit={formik.handleSubmit}>
      <CustomInput
        name="email"
        label="Email"
        placeholder="Enter email address"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        isInvalid={!!formik.errors.email && formik.touched.email}
        validationMsg={formik.errors.email || ""}
      />

      <CustomInput
        name="password"
        label="Password"
        placeholder="Enter your password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        isInvalid={!!formik.errors.password && formik.touched.password}
        validationMsg={formik.errors.password || ""}
      />

      <div className="flex justify-end mb-5">
        <a
          href={RoutePath.FORGOT_PASSWORD}
          className="text-[var(--color-primary)] text-sm hover:underline font-medium"
        >
          Forgot password?
        </a>
      </div>

      <CustomButton
        type="submit"
        variant="primary"
        size="md"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </CustomButton>
    </form>
  </div>
</>

  );
};

export default LoginForm;
