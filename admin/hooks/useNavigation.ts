import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNavigation, updateNavigation } from "../lib/api/navigation";

export function useNavigation(location?: "header" | "footer") {
  return useQuery({
    queryKey: ["navigation", location],
    queryFn: () => getNavigation(location),
  });
}

export function useNavigationMutations() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ location, items }: { location: "header" | "footer"; items: any[] }) =>
      updateNavigation(location, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
    },
  });

  return {
    updateNavigation: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
