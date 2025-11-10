import CreateDepartmentForm from "@/features/admin/CreateDepartmentForm";

const CreateDepartmentPage = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto bg">

        <h2 className="text-center mb-40 text-3xl font-bold text-gray-00">
          Create Department
        </h2>
        <div>
            <CreateDepartmentForm />
        </div>
      </div>
    </>
  );
};

export default CreateDepartmentPage;
