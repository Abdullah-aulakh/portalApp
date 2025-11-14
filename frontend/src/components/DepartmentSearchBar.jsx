import { useState, useEffect } from "react";
import useAxios from "@/hooks/useAxios";
import CustomButton from "@/components/CustomButton";
import FullPageLoader from "@/components/FullPageLoader";
import Swal from "sweetalert2";

const DepartmentSearchBar = ({ setResults }) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("name"); // 'name' or 'id'
  const { response, error, loading, fetchData } = useAxios();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    let url = "/departments";
    if (searchType === "id") {
      url = `/departments/${query}`;
    } else {
      url = `/departments?name=${encodeURIComponent(query)}`;
    }
    
    await fetchData({ url, method: "get" });
  };

  useEffect(() => {
    if (response) {
      setResults(response);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Search Error",
        text: error?.message || "Department not found!",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 p-4 bg-white rounded-lg shadow border border-[var(--color-primary)]">
      {loading && <FullPageLoader />}
      
      {/* Search Type Selector */}
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="border-2 border-[var(--color-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        <option value="name">Search by Name</option>
        <option value="id">Search by ID</option>
      </select>

      {/* Search Input */}
      <input
        type="text"
        placeholder={searchType === "name" ? "Enter department name..." : "Enter department ID..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border-2 border-[var(--color-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />

      <CustomButton
        onClick={handleSearch}
        disabled={loading || !query.trim()}
      >
        {loading ? "Searching..." : "Search"}
      </CustomButton>
    </div>
  );
};

export default DepartmentSearchBar;