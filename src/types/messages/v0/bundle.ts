export interface IFrontendContext {
  oauthClientId: string;
  oauthAuthorityUrl: string;
}

export interface IEventList {
  values: IEvent[];
}

export interface IEvent {
  type: EventType;
  boat?: IBoat;
  zone?: IZone;
  sector?: ISector;
  team?: ITeam;
  track?: ITrack;
  playExecution?: IPlayExecution;
}

export interface IBoat {
  meta: IMeta;
  spec?: IBoatSpec;
  status: IBoatStatus;
}

export interface IBoatSpec {
  team?: string;
  type?: string;
  sizeClass?: string;
}

export interface IBoatStatus {
  position: IPosition;
  heading?: number;
  speed?: number;
  status?: string;
}

export interface IZone {
  meta: IMeta;
  zoneType?: ZoneType;
  coordinates?: ILocation[];
  area?: IGeoArea;
}

export interface ISector {
  meta: IMeta;
  area?: IGeoArea;
}

export interface ITeam {
  meta: IMeta;
  sector?: string;
  status?: ITeamStatus;
}

export interface ITeamStatus {
  play?: {
    data?: {
      key?: string;
      minBoats?: number;
    };
  };
}

export interface ITrack {
  meta: IMeta;
  waypoints?: ILocation[];
  area?: IGeoArea;
}

export interface IPlayExecution {
  meta: IMeta;
  spec?: IPlayExecutionSpec;
  status?: string;
}

export interface IPlayExecutionSpec {
  team?: {
    id?: string;
  };
}

export interface IMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPosition {
  location: ILocation;
  timestamp: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface ISubscription {
  updateInterval: number;
  encoding: number; // Allow all encoding values
  criteria: ISubscriptionCriteria[];
}

export interface ISubscriptionCriteria {
  resourceKind: ResourceKind;
  sectors?: string[];
  teams?: string[];
  zoneTypes?: ZoneType[];
  names?: string[];
  area?: IGeoArea;
}

export interface IGeoArea {
  northEast: ILocation;
  southWest: ILocation;
}

export const EventType = {
  EVENT_TYPE_UNSPECIFIED: 0,
  EVENT_TYPE_RESOURCE_CREATED: 1,
  EVENT_TYPE_RESOURCE_UPDATED: 2,
  EVENT_TYPE_RESOURCE_DELETED: 3,
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

export const ResourceKind = {
  RESOURCE_KIND_UNSPECIFIED: 0,
  RESOURCE_KIND_BOAT: 1,
  RESOURCE_KIND_ZONE: 2,
  RESOURCE_KIND_SECTOR: 3,
  RESOURCE_KIND_TEAM: 4,
  RESOURCE_KIND_TRACK: 5,
  RESOURCE_KIND_PLAY_EXECUTION: 6,
} as const;

export type ResourceKind = typeof ResourceKind[keyof typeof ResourceKind];

export const Encoding = {
  ENCODING_UNSPECIFIED: 0,
  ENCODING_PROTOBUF: 1,
  ENCODING_JSON: 2,
} as const;

export type Encoding = typeof Encoding[keyof typeof Encoding];

export const ZoneType = {
  ZONE_TYPE_UNSPECIFIED: 0,
  ZONE_TYPE_OVERLAY: 1,
  ZONE_TYPE_BEACH: 2,
} as const;

export type ZoneType = typeof ZoneType[keyof typeof ZoneType];

export const PlayKey = {
  PLAY_KEY_UNSPECIFIED: 0,
  PLAY_KEY_AVAST: 1,
  PLAY_KEY_CHECKPOINT: 2,
} as const;

export type PlayKey = typeof PlayKey[keyof typeof PlayKey];

export const Feature = {
  FEATURE_UNSPECIFIED: 0,
  FEATURE_VIDEO_STREAMING: 1,
} as const;

export type Feature = typeof Feature[keyof typeof Feature];