import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedia, uploadMedia, updateMediaMetadata, deleteMedia, GetMediaParams } from "../lib/api/media";

export function useMedia(params: GetMediaParams = {}) {
  return useQuery({
    queryKey: ["media", params],
    queryFn: () => getMedia(params),
  });
}

export function useMediaMutations() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: ({ file, altText, folder }: { file: File; altText?: string; folder?: string }) =>
      uploadMedia(file, altText, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const updateMetadataMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { alt_text?: string; caption?: string; folder?: string } }) =>
      updateMediaMetadata(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  return {
    uploadMedia: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    updateMediaMetadata: updateMetadataMutation.mutateAsync,
    isUpdatingMetadata: updateMetadataMutation.isPending,
    deleteMedia: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
