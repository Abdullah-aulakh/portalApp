import CreateTimetableForm from "@/features/admin/CreateTimetableForm";

const CreateTimetablePage = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center mb-8 text-3xl font-bold text-gray-800">
          Create Timetable Entry
        </h2>
        <div>
          <CreateTimetableForm />
        </div>
      </div>
    </>
  );
};

export default CreateTimetablePage;