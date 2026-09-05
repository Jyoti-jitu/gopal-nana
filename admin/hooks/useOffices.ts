import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOffices, createOffice, updateOffice, deleteOffice } from "../lib/api/offices";
import { Office } from "../lib/types/office";

export function useOffices() {
  return useQuery({
    queryKey: ["offices"],
    queryFn: getOffices,
  });
}

export function useOfficeMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Office>) => createOffice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Office> }) => updateOffice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOffice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
    },
  });

  return {
    createOffice: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateOffice: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteOffice: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
