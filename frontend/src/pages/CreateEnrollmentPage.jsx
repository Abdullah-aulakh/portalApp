import CreateEnrollmentForm from "@/features/admin/CreateEnrollmentForm";

const CreateEnrollmentPage = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center mb-8 text-3xl font-bold text-gray-800">
          Create Enrollment
        </h2>
        <div>
          <CreateEnrollmentForm />
        </div>
      </div>
    </>
  );
};

export default CreateEnrollmentPage;