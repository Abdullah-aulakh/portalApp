import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import CustomInput from "@components/CustomInput";
import { RoutePath } from "@/routes/routes";
import useAxios from "@/hooks/useAxios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location?.state?.token;
  const { response, error, loading, fetchData } = useAxios();

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      await fetchData({
        url: "auth/reset-password",
        method: "post",
        data: { token, password: values.newPassword },
      });
    },
  });

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Password has been reset successfully! Login with your new password.",
        icon: "success",
        confirmButtonColor: "#4880FF",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/${RoutePath.AUTH}/${RoutePath.LOGIN}`);
        }
      });
    }
  }, [response, navigate]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to reset password. Please try again.",
        icon: "error",
        confirmButtonColor: "#4880FF",
      });
    }
  }, [error]);

  return (
    <>
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-12 w-96 h-105 max-w-md">
        <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Reset Password
        </h3>
        <p className="text-center mb-6 text-gray-600">
          Choose your new password.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <CustomInput
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.newPassword && formik.touched.newPassword}
            validationMsg={formik.errors.newPassword || ""}
          />
          <CustomInput
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm new password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.confirmPassword && formik.touched.confirmPassword}
            validationMsg={formik.errors.confirmPassword || ""}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-medium transition-colors ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-[#4880FF] hover:bg-blue-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>
      </div>
    </>
  );
};

export default ResetPassword;
