import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";

export const useLogout = () => {
  const { response, error, loading, fetchData } = useAxios();
  const { setUser } = useAuth();

  const logout = async () => {
    setUser(null);
    await fetchData({ url: "auth/logout", method: "post" });

    if (error) {
      console.log(error);
    }
  };

  return { logout, loading };
};
