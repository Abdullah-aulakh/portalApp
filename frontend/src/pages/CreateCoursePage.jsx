import CreateCourseForm from "@/features/admin/CreateCourseForm";

const CreateCoursePage = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center mb-8 text-3xl font-bold text-gray-800">
          Create Course
        </h2>
        <div>
          <CreateCourseForm />
        </div>
      </div>
    </>
  );
};

export default CreateCoursePage;