import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { RoutePath } from "@/routes/routes";
import useAxios from "@/hooks/useAxios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { response, error, loading, fetchData } = useAxios();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async (values) => {
      await fetchData({
        url: "otp/generate",
        method: "post",
        data: {
          ...values,
          message:
            "Enter this OTP to reset your password. If you didn't request this, please ignore.",
        },
      });
    },
  });

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "OTP Sent!",
        text: "Check your email for the OTP to reset your password.",
        icon: "success",
        confirmButtonColor: "#4880FF",
      });

      navigate("/" + RoutePath.AUTH + "/" + RoutePath.OTP, {
        state: { email: formik.values.email },
      });
    }
  }, [response, navigate, formik.values.email]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to send OTP. Please try again.",
        icon: "error",
        confirmButtonColor: "#4880FF",
      });
    }
  }, [error]);

  return (
    <>
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-10 w-96 max-w-md  z-10">
        <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Forgot Password
        </h3>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <CustomInput
            name="email"
            label="Email"
            placeholder="Enter your email address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.email && formik.touched.email}
            validationMsg={formik.errors.email || ""}
          />

          <CustomButton
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </CustomButton>
        </form>

        <p className="text-center mt-5 text-gray-600 text-sm">
          Remembered your password?{" "}
          <a
            href={RoutePath.LOGIN}
            className="text-[#4880FF] hover:text-blue-800 font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </>
  );
};

export default ForgotPassword;
