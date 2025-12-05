import { MeshType as ApiMeshType } from '../api/openapi/auto-generated';
import { findByValue } from '../utils/types.util';

export type MeshType = keyof typeof ApiMeshType;
export type MeshTypeValue = (typeof ApiMeshType)[keyof typeof ApiMeshType];

export const MESH_TYPE_VALUES: MeshType[] = ['fixed', 'dynamic'];

const MESH_TYPE_TITLES: { [key in MeshType]: string } = {
    fixed: '15x15',
    dynamic: 'Dynamic',
    unknownDefaultOpenApi: 'Unknown',
};

export function meshTypeFromValue(meshTypeValue: string): MeshType | undefined {
    return findByValue(meshTypeValue, ApiMeshType);
}

export function meshTypeValue(meshType: MeshType): MeshTypeValue {
    return ApiMeshType[meshType];
}

export function meshTypeTitle(meshType: MeshType): string {
    return MESH_TYPE_TITLES[meshType] ?? 'Unknown';
}
