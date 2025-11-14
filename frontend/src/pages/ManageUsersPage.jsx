import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SearchBar from "@/components/SearchBar";
import UserTile from "@/components/UserTile";
import { useState } from "react";
const ManageUsersPage = () => {

const [student, setStudent] = useState(null);

const studentTabPanel = (
  <div 
  className=""
  >
    <SearchBar placeholder={"Search by Registraion Number"} endpoint="students/reg" setResults={setStudent} />
    {
        student &&(
            <>
            <div
            className="mt-2 mb-2 font-bold text-2xl"
            >Results</div>
            <UserTile data={student} />
            </>
        )
    }
  </div>
);




  return (
    <>
      <div className="max-w-4xl mx-auto bg">
        <h2 className="text-center mb-4 text-3xl font-bold text-gray-00 mt-[-10]">
          Manage Users
        </h2>
        <div>
          <Tabs>
            {/* Tab headers */}
            <TabList className="flex mb-6 justify-around space-x-4">
              <Tab
                className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
                selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
              >
                Students
              </Tab>
              <Tab
                className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
                selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
              >
                Teachers
              </Tab>
              <Tab
                className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
                selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
              >
                Admin
              </Tab>
            </TabList>

            {/* Tab content */}
            <TabPanel className="">
              {studentTabPanel}
            </TabPanel>

            <TabPanel>
              
            </TabPanel>

            <TabPanel>
              <p>Here you can manage users.</p>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ManageUsersPage;