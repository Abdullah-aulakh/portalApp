import { useState, useEffect } from "react";
import useAxios from "@/hooks/useAxios";
import Button from "@/components/CustomButton";
import FullpageLoader from "@/components/FullPageLoader";
import Swal from "sweetalert2";

const SearchBar = ({ endpoint, placeholder, setResults }) => {
  const [query, setQuery] = useState("");
  const { response, error, loading, fetchData } = useAxios();

  const handleSearch = async () => {
    if (!query.trim()) return;
    await fetchData({
      url: `${endpoint}/${encodeURIComponent(query)}`,
      method: "get",
    });
  };

  useEffect(() => {
    if (response) {
      setResults(response);
    }
  }, [response, setResults]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Oops...",
        text: error?.message || "Something went wrong!",
        icon: "error",
        confirmButtonText: "Ok",
        customClass: {
          popup: 'text-sm sm:text-base'
        }
      });
    }
  }, [error]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-lg shadow w-full">
      {loading && <FullpageLoader />}
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border-2 border-(--color-primary) rounded-lg px-3 py-2 text-sm focus:outline-none min-w-0"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Button
        onClick={handleSearch}
        disabled={loading}
        size="sm"
        className="w-full sm:w-auto"
      >
        {loading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default SearchBar;