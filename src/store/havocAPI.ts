import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import * as bundle from '../types/messages/v0/bundle';

const boatsAdapter = createEntityAdapter({
  selectId: (boat: bundle.IBoat) => boat.meta.id,
});

const zonesAdapter = createEntityAdapter({
  selectId: (zone: bundle.IZone) => zone.meta.id,
});

const sectorsAdapter = createEntityAdapter({
  selectId: (sector: bundle.ISector) => sector.meta.id,
});

const teamsAdapter = createEntityAdapter({
  selectId: (team: bundle.ITeam) => team.meta.id,
});

const tracksAdapter = createEntityAdapter({
  selectId: (track: bundle.ITrack) => track.meta.id,
});

// Local socket state scoped to this cache entry
let socket: WebSocket | null = null;
let reconnectAttemptsLocal = 0;
let reconnectTimeoutId: number | null = null;
let closed = false;
let accessToken = '';
const RECONNECT_INTERVAL = 3000;
const MAX_RECONNECT_ATTEMPTS = 20;

interface StreamingData {
  boats: ReturnType<typeof boatsAdapter.getInitialState>;
  zones: ReturnType<typeof zonesAdapter.getInitialState>;
  sectors: ReturnType<typeof sectorsAdapter.getInitialState>;
  teams: ReturnType<typeof teamsAdapter.getInitialState>;
  tracks: ReturnType<typeof tracksAdapter.getInitialState>;
  connected: boolean;
  error: string | null;
}

export const havocApi = createApi({
  reducerPath: 'havocApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL
      ? `http://${import.meta.env.VITE_API_URL}/api/v0`
      : '/api/v0',
    prepareHeaders: (headers) => {
      try {
        const userData = localStorage.getItem('oidc.user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.access_token) {
            headers.set('Authorization', `Bearer ${user.access_token}`);
          }
        }
      } catch (error) {
        console.error('Error getting access token:', error);
      }
      return headers;
    },
  }),
  tagTypes: ['Boat', 'Zone', 'Sector', 'Team', 'Track', 'Stream'],
  endpoints: (builder) => ({
    getBoats: builder.query<bundle.IBoat[], void>({
      query: () => '/boat',
      providesTags: ['Boat'],
    }),

    getZones: builder.query<bundle.IZone[], string | void>({
      query: (sectorName) => sectorName ? `/zone?sector=${sectorName}` : '/zone',
      providesTags: ['Zone'],
    }),

    getSectors: builder.query<bundle.ISector[], void>({
      query: () => '/sector',
      providesTags: ['Sector'],
    }),

    getTeams: builder.query<bundle.ITeam[], string | void>({
      query: (sectorName) => sectorName ? `/team?sector=${sectorName}` : '/team',
      providesTags: ['Team'],
    }),

    getTracks: builder.query<bundle.ITrack[], string | void>({
      query: (sectorName) => sectorName ? `/track?sector=${sectorName}` : '/track',
      providesTags: ['Track'],
    }),

    getFrontendContext: builder.query<bundle.IFrontendContext, void>({
      query: () => ({
        url: '/.frontend/context',
        responseHandler: async (response) => {
          const arrayBuffer = await response.arrayBuffer();
          const responseText = new TextDecoder().decode(arrayBuffer);
          const [, , , oauthClientId, oauthAuthorityUrl] = responseText.match(/([^"]*)\"([^"]*)\"\*([^*]*)/) || [];
          return {
            oauthClientId: oauthClientId?.trim() || '',
            oauthAuthorityUrl: oauthAuthorityUrl?.trim() || '',
          };
        },
      }),
    }),

    updateSubscription: builder.mutation<void, { sectorName: string; area?: bundle.IGeoArea }>({
      async queryFn({ sectorName, area }) {
        try {
          const encoding = import.meta.env.VITE_WEBSOCKET_ENCODING === 'json'
            ? bundle.Encoding.ENCODING_JSON
            : bundle.Encoding.ENCODING_PROTOBUF;

          const subscription: bundle.ISubscription = {
            updateInterval: 500,
            encoding,
            criteria: [
              {
                resourceKind: bundle.ResourceKind.RESOURCE_KIND_BOAT,
                sectors: [sectorName],
              },
              {
                resourceKind: bundle.ResourceKind.RESOURCE_KIND_ZONE,
                sectors: [sectorName],
              },
              {
                resourceKind: bundle.ResourceKind.RESOURCE_KIND_TEAM,
                sectors: [sectorName],
              },
              {
                resourceKind: bundle.ResourceKind.RESOURCE_KIND_TRACK,
                sectors: [sectorName],
                area,
              },
              {
                resourceKind: bundle.ResourceKind.RESOURCE_KIND_PLAY_EXECUTION,
              },
            ],
          };

          await axios.put('/api/v0/subscription', subscription);
          return { data: undefined };
        } catch (error: any) {
          console.error('Subscription update failed:', error);
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),

    streamEvents: builder.query<StreamingData, void>({
      queryFn: () => ({
        data: {
          boats: boatsAdapter.getInitialState(),
          zones: zonesAdapter.getInitialState(),
          sectors: sectorsAdapter.getInitialState(),
          teams: teamsAdapter.getInitialState(),
          tracks: tracksAdapter.getInitialState(),
          connected: false,
          error: null,
        },
      }),
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          const userData = localStorage.getItem('oidc.user');
          if (userData) {
            const user = JSON.parse(userData);
            accessToken = user.access_token || '';
          }
        } catch (error) {
          console.error('Error getting access_token for WebSocket:', error);
        }

        if (!accessToken) {
          updateCachedData((draft) => {
            draft.error = 'No access_token available';
          });
          return;
        }

        const encoding = import.meta.env.VITE_WEBSOCKET_ENCODING === 'json'
          ? bundle.Encoding.ENCODING_JSON
          : bundle.Encoding.ENCODING_PROTOBUF;

        // Build ws uri (token is percent-encoded)
        let ws_uri = import.meta.env.VITE_API_URL
          ? `//${import.meta.env.VITE_API_URL}/api/v0/subscription/websocket?token=${encodeURIComponent(accessToken)}`
          : `//${location.host}/api/v0/subscription/websocket?token=${encodeURIComponent(accessToken)}`;

        if (location.protocol === 'https:') {
          ws_uri = 'wss:' + ws_uri;
        } else {
          ws_uri = 'ws:' + ws_uri;
        }

        const connectWebSocket = async () => {
          if (closed) return;

          try {
            socket = new WebSocket(ws_uri);

            socket.onopen = () => {
              reconnectAttemptsLocal = 0;
              updateCachedData((draft) => {
                draft.connected = true;
                draft.error = null;
              });
            };

            socket.onmessage = async (event) => {
              try {
                // Normalize different event.data types to a string
                let payloadStr: string;
                if (typeof event.data === 'string') {
                  payloadStr = event.data;
                } else if (event.data instanceof Blob) {
                  payloadStr = await event.data.text();
                } else if (event.data instanceof ArrayBuffer) {
                  payloadStr = new TextDecoder().decode(event.data);
                } else {
                  payloadStr = String(event.data);
                }

                // Attempt to parse JSON (same behavior as original code)
                // If your server truly sends binary protobuf, you'll need to decode here with protobuf runtime.
                let decodedResponse: bundle.IEventList;
                try {
                  decodedResponse = JSON.parse(payloadStr) as bundle.IEventList;
                } catch (parseErr) {
                  console.error('Failed to JSON.parse websocket payload:', parseErr);
                  return;
                }

                updateCachedData((draft) => {
                  for (const evt of decodedResponse.values || []) {
                    if (evt.boat) {
                      if (evt.type === bundle.EventType.EVENT_TYPE_RESOURCE_DELETED) {
                        boatsAdapter.removeOne(draft.boats, evt.boat.meta.id);
                      } else {
                        boatsAdapter.upsertOne(draft.boats, evt.boat);
                      }
                    }
                    if (evt.zone) {
                      if (evt.type === bundle.EventType.EVENT_TYPE_RESOURCE_DELETED) {
                        zonesAdapter.removeOne(draft.zones, evt.zone.meta.id);
                      } else {
                        zonesAdapter.upsertOne(draft.zones, evt.zone);
                      }
                    }
                    if (evt.sector) {
                      if (evt.type === bundle.EventType.EVENT_TYPE_RESOURCE_DELETED) {
                        sectorsAdapter.removeOne(draft.sectors, evt.sector.meta.id);
                      } else {
                        sectorsAdapter.upsertOne(draft.sectors, evt.sector);
                      }
                    }
                    if (evt.team) {
                      if (evt.type === bundle.EventType.EVENT_TYPE_RESOURCE_DELETED) {
                        teamsAdapter.removeOne(draft.teams, evt.team.meta.id);
                      } else {
                        teamsAdapter.upsertOne(draft.teams, evt.team);
                      }
                    }
                    if (evt.track) {
                      if (evt.type === bundle.EventType.EVENT_TYPE_RESOURCE_DELETED) {
                        tracksAdapter.removeOne(draft.tracks, evt.track.meta.id);
                      } else {
                        tracksAdapter.upsertOne(draft.tracks, evt.track);
                      }
                    }
                  }
                });
              } catch (error) {
                console.error('Error processing WebSocket message:', error);
              }
            };

            socket.onerror = (error) => {
              console.error('WebSocket error:', error);
              updateCachedData((draft) => {
                draft.error = 'WebSocket connection error';
                draft.connected = false;
              });
            };

            socket.onclose = () => {
              updateCachedData((draft) => {
                draft.connected = false;
              });

              if (!closed && reconnectAttemptsLocal < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttemptsLocal++;
                if (reconnectTimeoutId !== null) {
                  clearTimeout(reconnectTimeoutId);
                  reconnectTimeoutId = null;
                }
                reconnectTimeoutId = window.setTimeout(() => {
                  if (!closed) connectWebSocket();
                }, RECONNECT_INTERVAL);
              } else if (!closed) {
                console.error('Max reconnection attempts reached');
                updateCachedData((draft) => {
                  draft.error = 'Failed to reconnect to WebSocket';
                });
              }
            };

            await cacheDataLoaded;
          } catch (error: any) {
            console.error('WebSocket connection failed:', error);
            updateCachedData((draft) => {
              draft.error = error.message || 'Failed to connect';
              draft.connected = false;
            });
          }
        };

        connectWebSocket();

        await cacheEntryRemoved;

        // Cleanup: prevent further reconnects, clear timeout, and close socket
        closed = true;
        if (reconnectTimeoutId !== null) {
          clearTimeout(reconnectTimeoutId);
          reconnectTimeoutId = null;
        }
        if (socket) {
          try {
            socket.close();
          } catch (err) {
            // ignore
          }
          socket = null;
        }
        reconnectAttemptsLocal = 0;
      },
      providesTags: ['Stream'],
    }),
  }),
});

export const {
  useGetBoatsQuery,
  useGetZonesQuery,
  useGetSectorsQuery,
  useGetTeamsQuery,
  useGetTracksQuery,
  useGetFrontendContextQuery,
  useUpdateSubscriptionMutation,
  useStreamEventsQuery,
} = havocApi;

export const boatsSelectors = boatsAdapter.getSelectors();
export const zonesSelectors = zonesAdapter.getSelectors();
export const sectorsSelectors = sectorsAdapter.getSelectors();
export const teamsSelectors = teamsAdapter.getSelectors();
export const tracksSelectors = tracksAdapter.getSelectors();
