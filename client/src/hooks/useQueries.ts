// src/hooks/useQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// Auth queries
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.getCurrentUser().then(data => data.user),
    retry: false,
    // Don't automatically fetch user on page load
    enabled: false,
  });
}

// Video queries
export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: () => api.videos.getAll(),
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['videos', id],
    queryFn: () => api.videos.getById(id),
    enabled: !!id,
  });
}

export function useUploadVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => api.videos.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

// Match queries
export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: () => api.matches.getAll(),
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: ['matches', id],
    queryFn: () => api.matches.getById(id),
    enabled: !!id,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (creatorId: string) => api.matches.create(creatorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

export function useUpdateMatchStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'accepted' | 'rejected' | 'completed';
    }) => api.matches.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['matches', variables.id] });
    },
  });
}

// Message queries
export function useMessages(matchId: string) {
  return useQuery({
    queryKey: ['messages', matchId],
    queryFn: () => api.messages.getByMatchId(matchId),
    enabled: !!matchId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      matchId,
      content,
    }: {
      matchId: string;
      content: string;
    }) => api.messages.send(matchId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.matchId] });
    },
  });
}