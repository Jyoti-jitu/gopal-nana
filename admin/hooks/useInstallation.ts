import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstallationSteps, createInstallationStep, updateInstallationStep, deleteInstallationStep, reorderInstallationSteps, InstallationStep } from "../lib/api/installation";

export function useInstallation() {
  return useQuery({
    queryKey: ["installation-steps"],
    queryFn: getInstallationSteps,
  });
}

export function useInstallationMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<InstallationStep>) => createInstallationStep(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installation-steps"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InstallationStep> }) => updateInstallationStep(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installation-steps"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInstallationStep(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installation-steps"] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; display_order: number }[]) => reorderInstallationSteps(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installation-steps"] });
    },
  });

  return {
    createStep: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateStep: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteStep: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    reorderSteps: reorderMutation.mutateAsync,
    isReordering: reorderMutation.isPending,
  };
}
