import CreateUserForm from "@/features/admin/CreateUserForm";

const CreateUserPage = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto bg ">

        <h2 className="text-center mb-4 text-3xl font-bold text-gray-00 mt-[-10]">
          Create User
        </h2>
        <div>
          <CreateUserForm />
        </div>
      </div>
    </>
  );
};

export default CreateUserPage;
