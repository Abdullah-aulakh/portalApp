import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import TimetableTile from "@/components/TimetableTile";
import SearchBar from "@/components/SearchBar";
import EditTimetableForm from "@/features/admin/EditTimetableForm";
import FullPageLoader from "@/components/FullPageLoader";
import CustomButton from "@/components/CustomButton";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageTimetablesPage = () => {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editingTimetable, setEditingTimetable] = useState(null);

  const { response, error, loading, fetchData } = useAxios();

  // Fetch all timetables on component mount
  useEffect(() => {
    fetchTimetables();
  }, []);

  useEffect(() => {
    if (response) {
      if (Array.isArray(response)) {
        setTimetables(response);
        setFilteredTimetables(response);
      } else if (response.id) {
        // Single timetable from search
        setSearchResults(response);
      }
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to load timetables",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const fetchTimetables = async () => {
    await fetchData({ url: "/timetables", method: "get" });
  };

  const handleSearch = (results) => {
    setSearchResults(results);
    setActiveTab(1);
  };

  const handleViewDetails = (timetable) => {
    const formatTime = (timeString) => {
      if (!timeString) return '';
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    };

    Swal.fire({
      title: `Timetable Details`,
      html: `
        <div class="text-left space-y-3">
          <div class="border-b pb-2">
            <p class="font-semibold text-gray-700">Course Information</p>
            <p><strong>Code:</strong> ${timetable.course?.code}</p>
            <p><strong>Title:</strong> ${timetable.course?.title}</p>
            <p><strong>Credit Hours:</strong> ${timetable.course?.creditHours}</p>
            <p><strong>Teacher:</strong> ${timetable.course?.teacher ? `${timetable.course.teacher.user?.firstName} ${timetable.course.teacher.user?.lastName}` : 'Not assigned'}</p>
          </div>
          <div class="border-b pb-2">
            <p class="font-semibold text-gray-700">Schedule Information</p>
            <p><strong>Day:</strong> ${timetable.dayOfWeek}</p>
            <p><strong>Time:</strong> ${formatTime(timetable.startTime)} - ${formatTime(timetable.endTime)}</p>
            <p><strong>Room:</strong> ${timetable.room || 'Not specified'}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-700">Timetable Details</p>
            <p><strong>Timetable ID:</strong> ${timetable.id}</p>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "var(--color-primary)",
      width: 500,
      customClass: {
        popup: 'text-sm sm:text-base',
        title: 'text-lg sm:text-xl'
      }
    });
  };

  const handleEdit = (timetable) => {
    setEditingTimetable(timetable);
  };

  const handleDelete = async (timetable) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete timetable entry for "${timetable.course?.code}" on ${timetable.dayOfWeek}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "var(--color-primary)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'text-sm sm:text-base'
      }
    });

    if (result.isConfirmed) {
      await deleteTimetable(timetable);
    }
  };

  const deleteTimetable = async (timetable) => {
    try {
      await fetchData({
        url: `/timetables/${timetable.id}`,
        method: "delete",
      });

      // Update UI immediately
      setTimetables(prev => prev.filter(t => t.id !== timetable.id));
      setFilteredTimetables(prev => prev.filter(t => t.id !== timetable.id));
      
      // Update search results if needed
      if (searchResults) {
        if (Array.isArray(searchResults)) {
          setSearchResults(prev => prev.filter(t => t.id !== timetable.id));
        } else if (searchResults.id === timetable.id) {
          setSearchResults(null);
        }
      }

      Swal.fire({
        title: "Deleted!",
        text: `Timetable entry has been deleted successfully.`,
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
    } catch (deleteError) {
      Swal.fire({
        title: "Error!",
        text: deleteError?.message || "Failed to delete timetable entry",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  };

  const handleEditSave = (updatedTimetable) => {
    // Update the timetable in the local state
    setTimetables(prev => 
      prev.map(t => t.id === updatedTimetable.id ? updatedTimetable : t)
    );
    setFilteredTimetables(prev => 
      prev.map(t => t.id === updatedTimetable.id ? updatedTimetable : t)
    );
    
    // Update search results
    if (searchResults) {
      if (Array.isArray(searchResults)) {
        setSearchResults(prev => 
          prev.map(t => t.id === updatedTimetable.id ? updatedTimetable : t)
        );
      } else if (searchResults.id === updatedTimetable.id) {
        setSearchResults(updatedTimetable);
      }
    }
    
    setEditingTimetable(null);
  };

  const handleEditCancel = () => {
    setEditingTimetable(null);
  };

  const handleRefresh = () => {
    fetchTimetables();
    setSearchResults(null);
    setActiveTab(0);
  };

  // Group timetables by day for better organization
  const timetablesByDay = filteredTimetables.reduce((acc, timetable) => {
    const day = timetable.dayOfWeek;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(timetable);
    return acc;
  }, {});

  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Timetable</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            View and manage all course schedules
          </p>
        </div>
        <div className="flex justify-center sm:justify-end">
          <CustomButton 
            onClick={handleRefresh}
            variant="primary"
            disabled={loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            Refresh
          </CustomButton>
        </div>
      </div>

      {loading && <FullPageLoader />}

      <div className="bg-white/90 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-[var(--color-primary)] p-4 sm:p-6">
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
          <TabList className="flex flex-col sm:flex-row mb-4 sm:mb-6 gap-2 sm:gap-4 border-b border-gray-200">
            <Tab
              className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
              selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
            >
              All Timetables ({timetables.length})
            </Tab>
            <Tab
              className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
              selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
            >
              Search Timetable
            </Tab>
            <Tab
              className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
              selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
            >
              Weekly View
            </Tab>
          </TabList>

          {/* Tab 1: All Timetables */}
          <TabPanel>
            {filteredTimetables.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredTimetables.map((timetable) => (
                  <TimetableTile
                    key={timetable.id}
                    timetable={timetable}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📅</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  No Timetable Entries Found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  There are no timetable entries in the system yet.
                </p>
              </div>
            )}
          </TabPanel>

          {/* Tab 2: Search Timetable */}
          <TabPanel>
            <div className="space-y-4 sm:space-y-6">
              <SearchBar
                endpoint="timetables"
                placeholder="Search by timetable ID or course code..."
                setResults={handleSearch}
              />
              
              {searchResults ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {Array.isArray(searchResults) ? (
                    searchResults.map((timetable) => (
                      <TimetableTile
                        key={timetable.id}
                        timetable={timetable}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <TimetableTile
                      key={searchResults.id}
                      timetable={searchResults}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-gray-400 text-3xl sm:text-4xl mb-2 sm:mb-3">🔍</div>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Use the search bar above to find timetable entries by ID or course code.
                  </p>
                </div>
              )}
            </div>
          </TabPanel>

          {/* Tab 3: Weekly View */}
          <TabPanel>
            {Object.keys(timetablesByDay).length > 0 ? (
              <div className="space-y-6">
                {daysOrder.map(day => {
                  const dayTimetables = timetablesByDay[day] || [];
                  if (dayTimetables.length === 0) return null;

                  return (
                    <div key={day} className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">{day}</h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {dayTimetables.map((timetable) => (
                            <TimetableTile
                              key={timetable.id}
                              timetable={timetable}
                              onViewDetails={handleViewDetails}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📅</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  No Weekly Schedule
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  There are no timetable entries to display in weekly view.
                </p>
              </div>
            )}
          </TabPanel>
        </Tabs>
      </div>

      {/* Statistics Footer */}
      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{timetables.length}</div>
          <div className="text-xs sm:text-sm text-blue-800">Total Entries</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {new Set(timetables.map(t => t.course?.id)).size}
          </div>
          <div className="text-xs sm:text-sm text-green-800">Unique Courses</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {new Set(timetables.map(t => t.dayOfWeek)).size}
          </div>
          <div className="text-xs sm:text-sm text-purple-800">Days Scheduled</div>
        </div>
      </div>

      {/* Edit Timetable Modal */}
      {editingTimetable && (
        <EditTimetableForm
          timetable={editingTimetable}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default ManageTimetablesPage;