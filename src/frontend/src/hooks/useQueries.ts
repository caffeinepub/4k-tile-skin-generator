import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, CreationRecord } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllCreationRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CreationRecord[]>({
    queryKey: ['creationRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCreationRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveCreationRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      creativeFreedom,
      settings,
      thumbnailUrl,
    }: {
      title: string;
      creativeFreedom: boolean;
      settings: string;
      thumbnailUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCreationRecord(title, creativeFreedom, settings, thumbnailUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creationRecords'] });
    },
  });
}
