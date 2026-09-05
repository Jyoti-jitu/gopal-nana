import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEnquiries, getEnquiry, updateEnquiryStatus, deleteEnquiry, GetEnquiriesParams } from "../lib/api/enquiries";
import { EnquiryStatus } from "../lib/types/enquiry";

export function useEnquiries(params: GetEnquiriesParams = {}) {
  return useQuery({
    queryKey: ["enquiries", params],
    queryFn: () => getEnquiries(params),
  });
}

export function useEnquiry(id: string) {
  return useQuery({
    queryKey: ["enquiry", id],
    queryFn: () => getEnquiry(id),
    enabled: !!id,
  });
}

export function useEnquiryMutations() {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: EnquiryStatus; notes?: string }) =>
      updateEnquiryStatus(id, status, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["enquiry", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEnquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  return {
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    deleteEnquiry: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
