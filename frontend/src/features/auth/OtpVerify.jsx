import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import OTPInput from "@components/OTPInput";
import { RoutePath } from "@/routes/routes";
import useAxios from "@/hooks/useAxios";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;
  const { response, error, loading, fetchData } = useAxios();

  // Handle successful OTP verification
  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "OTP verified successfully!",
        icon: "success",
        confirmButtonColor: "#4880FF",
      });
      navigate("/" + RoutePath.AUTH + "/" + RoutePath.RESET_PASSWORD, {
        state: { token: response.token },
      });
    }
  }, [response, navigate]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to verify OTP. Please try again.",
        icon: "error",
        confirmButtonColor: "#4880FF",
      });
    }
  }, [error]);

  // Form validation
  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^[0-9]+$/, "OTP must contain only numbers")
      .length(6, "OTP must be exactly 6 digits"),
  });

  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema,
    onSubmit: async (values) => {
      await fetchData({
        url: "otp/verify",
        method: "post",
        data: { ...values, email },
      });
    },
  });

  return (
    <>
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Verify OTP
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Enter the OTP sent to your registered email address
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <OTPInput
              value={formik.values.otp}
              onChange={(value) => formik.setFieldValue("otp", value)}
              isInvalid={!!formik.errors.otp && formik.touched.otp}
            />
            {formik.errors.otp && (
              <div className="text-red-500 text-sm text-center mt-1">
                {formik.errors.otp}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-medium transition-colors ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-[#4880FF] hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </>
  );
};

export default OtpVerify;
