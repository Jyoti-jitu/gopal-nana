import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, publishTestimonial } from "../lib/api/testimonials";
import { Testimonial } from "../lib/types/testimonial";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });
}

export function useTestimonialMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Testimonial>) => createTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Testimonial> }) => updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => publishTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  return {
    createTestimonial: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTestimonial: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTestimonial: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    publishTestimonial: publishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
  };
}
