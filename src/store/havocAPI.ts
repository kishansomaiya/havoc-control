import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { havocai } from '../types/messages/v0/bundle';
import { current } from '@reduxjs/toolkit';
import type { Message } from 'protobufjs';

const api_domain = 'localhost:8080'
const dev_api_domain = 'dev.havocai.net'

// Map the ResourceKind to the IEvent type
const ResourceKind = {
  RESOURCE_KIND_SECTOR: 'sector',
  RESOURCE_KIND_ZONE: 'zone',
  RESOURCE_KIND_TEAM: 'team',
  RESOURCE_KIND_BOAT: 'boat',
  RESOURCE_KIND_TRACK: 'track',
}

export const havocApi = createApi({
  reducerPath: 'havocApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${api_domain}/api/v0/`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().app.frontendAccessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getEntity: build.query<any, string>({
      query: (type: string) => `${type}`,
    }),
    getEntityById: build.query<any, { type: string; id: string }>({
      query: ({ type, id }) => `${type}/${id}`,
    }),
    getWebsocket: build.query<any, string>({
      query: () => `subscription/`,
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let pingInterval: ReturnType<typeof setInterval> | null = null

        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket(`ws://${api_domain}/api/v0/subscription/websocket?token=${arg}`)

        // when data is received from the socket connection to the server,
        // if it is a message and for the appropriate channel,
        // update our query result with the received message
        const onMessage = async (e: MessageEvent) => {
          try {
            const buffer = await e.data.arrayBuffer()
            const decodedData = havocai.messages.v0.EventList.decode(new Uint8Array(buffer));
            const serializedData = decodedData.values.map((event: any) => event.toJSON());
console.log('WebSocket message received:', decodedData);
            updateCachedData((draft) => {
              serializedData.forEach((data: any) => {
                const dataEventType = data.type;

                if (dataEventType === 'EVENT_TYPE_RESOURCE_UPDATED') {
                  // Handle resource updated event
                  const dataEntity = ResourceKind[data.resourceRef.kind as keyof typeof ResourceKind];
                  const dataEntityId = data[dataEntity].meta.id;

                  // Check if the entity array exists in the draft, if not, initialize it
                  if (!(dataEntity in draft)) {
                    draft[dataEntity] = [];
                  }

                  // Check to see if the draft data already has this entity
                  const existingIndex = draft[dataEntity].findIndex((item: any) => item.meta.id === dataEntityId);

                  if (existingIndex > -1) {
                    // If it exists, update the existing entity
                    draft[dataEntity][existingIndex] = data[dataEntity];
                    return;
                  }

                  // If it does not exist, add the new entity
                  draft[dataEntity] = [...draft[dataEntity], data[dataEntity]];
                } else if (dataEventType === 'EVENT_TYPE_RESOURCE_DELETED') {
                  // Handle resource deleted event
                }
              });
            });
          } catch (error) {
            console.error('Error processing WebSocket message:', error)
          }
        }

        const onOpen = (e: Event) => {
          pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send('ping')
            }
          }, 3000)
        }

        const onError = (e: Event) => {
          console.error('WebSocket error', e)
        }

        const onClose = (e: CloseEvent) => {
          console.log('WebSocket connection closed', e)
          if (pingInterval) {
            clearInterval(pingInterval)
          }
        }

        // Add event listeners before waiting for cacheDataLoaded
        // This ensures we don't miss messages that arrive early


        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          ws.addEventListener('open', onOpen)
          ws.addEventListener('message', onMessage)
          ws.addEventListener('error', onError)
          ws.addEventListener('close', onClose)
          console.log('WebSocket connection established')
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }

        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved

        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        if (pingInterval) {
          clearInterval(pingInterval)
        }

        ws.close()
      },
    }),
    updateWebsocket: build.mutation<any, any>({
      query: (data) => ({
        url: `subscription/`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useGetEntityQuery, useGetEntityByIdQuery, useGetWebsocketQuery, useUpdateWebsocketMutation } = havocApi;
