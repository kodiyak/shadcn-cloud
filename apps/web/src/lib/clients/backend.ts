import type { Api } from '@workspace/core';
import axios, { toFormData } from 'axios';
import { z } from 'zod';

function getToken() {
  return localStorage.getItem('auth_token') || undefined;
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const uploadTrackSchema = z.object({
  title: z.string().min(1, 'Track title is required'),
  track: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'Track file is required',
  }),
  cover: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size > 0, {
      message: 'Cover image must be a valid file or empty',
    }),
  playlistId: z.string().optional(),
  albumId: z.string().optional(),
  artistId: z.string().optional(),
});

const validations = {
  createRoom: z.object({
    name: z.string().min(1, 'Room name is required'),
  }),
  createPlaylist: z.object({
    name: z.string().min(1, 'Playlist name is required'),
    isPublic: z.boolean(),
    description: z.string().nullish(),
    tracks: uploadTrackSchema.array().optional(),
  }),
  uploadTrack: uploadTrackSchema,
  updateRoom: z.object({
    playlistId: z.string().nullable(),
    name: z.string().nullish(),
  }),
  addTracksToRoom: z.object({
    roomId: z.string().min(1, 'Room ID is required'),
    tracksIds: z.array(z.string()).min(1, 'At least one track is required'),
  }),
  installPlugin: z.object({
    roomId: z.string(),
    pluginId: z.string(),
  }),
};

export type AddTracksToRoomRequest = z.infer<
  typeof validations.addTracksToRoom
>;
export type CreateRoomRequest = z.infer<typeof validations.createRoom>;
export type CreatePlaylistRequest = z.infer<typeof validations.createPlaylist>;
export type UploadTrackRequest = z.infer<typeof validations.uploadTrack>;
export type InstallPluginRequest = z.infer<typeof validations.installPlugin>;

const backendClient = {
  getRoom: async (roomId: string) =>
    client.get<Api.Room>(`/rooms/${roomId}`).then((r) => r.data),
  getRoomWsUrl: (roomId: string, memberId: string) => {
    const url = new URL(
      `/rooms/${roomId}/members/${memberId}/ws`,
      process.env.NEXT_PUBLIC_BACKEND_API_URL,
    );

    return url
      .toString()
      .replace('http://', 'ws://')
      .replace('https://', 'wss://');
  },
  getRoomMembers: async (roomId: string) =>
    client
      .get<Api.RoomMember[]>(`/rooms/${roomId}/members`)
      .then((r) => r.data),
  getRoomTracks: async (roomId: string) =>
    client.get<Api.Track[]>(`/rooms/${roomId}/tracks`).then((r) => r.data),
  createRoom: async (data: CreateRoomRequest) => {
    return client.post<Api.Room>('/rooms', data).then((r) => r.data);
  },
  createPlaylist: async (data: CreatePlaylistRequest) => {
    return client.post<Api.Playlist>('/playlists', data).then((r) => r.data);
  },
  getPlaylists: async () => {
    return client.get<Api.Playlist[]>('/playlists').then((r) => r.data);
  },
  uploadTrack: async (data: UploadTrackRequest) => {
    return client
      .post<Api.Track>('/tracks', toFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  installPlugin: async ({ pluginId, roomId }: InstallPluginRequest) => {
    return client
      .post<Api.Plugin>(`/plugins/${pluginId}/install`, { roomId })
      .then((r) => r.data);
  },
  uninstallPlugin: async ({ pluginId, roomId }: InstallPluginRequest) => {
    return client
      .post<Api.Plugin>(`/plugins/${pluginId}/uninstall`, { roomId })
      .then((r) => r.data);
  },
  updateRoom: async (
    roomId: string,
    data: Partial<{
      playlistId: string | null;
      name: string;
    }>,
  ) => {
    return client.put<Api.Room>(`/rooms/${roomId}`, data).then((r) => r.data);
  },
  addTracksToRoom: async (data: AddTracksToRoomRequest) => {
    return client
      .post<Api.Room>(`/rooms/${data.roomId}/tracks`, data)
      .then((r) => r.data);
  },
  getTrack: async (trackId: string) =>
    client.get<Api.Track>(`/tracks/${trackId}`).then((r) => r.data),
  setToken: (token: string) => {
    console.log('Setting token:', token);
    localStorage.setItem('auth_token', token);
    client.defaults.headers.common['Authorization'] = `${token}`;
  },
  getToken,
  client,
  validations,
};

export { backendClient };
