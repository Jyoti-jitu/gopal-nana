import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPages, getPageBySlug, updatePage, publishPage } from "../lib/api/pages";
import { CMSPage } from "../lib/types/page";

export function usePages() {
  return useQuery({
    queryKey: ["pages"],
    queryFn: getPages,
  });
}

export function usePage(slug: string) {
  return useQuery({
    queryKey: ["page", slug],
    queryFn: () => getPageBySlug(slug),
    enabled: !!slug,
  });
}

export function usePageMutations() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CMSPage> }) => updatePage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["page"] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => publishPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["page"] });
    },
  });

  return {
    updatePage: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    publishPage: publishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
  };
}
