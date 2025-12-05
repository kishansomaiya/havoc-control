import { Route, Routes, Navigate } from 'react-router-dom';
import { ROUTES } from './const';
import { HomePage } from './pages/HomePage/HomePage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { PortfolioPage } from './pages/PortfolioPage/PortfolioPage';
import { LocationPage } from './pages/LocationPage/LocationPage';
import { PortfolioOverviewTab } from './pages/PortfolioPage/Overview/PortfolioOverviewTab';
import { PortfolioComplianceTab } from './pages/PortfolioPage/Compliance/PortfolioComplianceTab';
import { PortfolioHazardTab } from './pages/PortfolioPage/Hazard/PortfolioHazardTab';
import { PortfolioLocationsTab } from './pages/PortfolioPage/Locations/PortfolioLocationsTab';
import { PortfolioImpactsTab } from './pages/PortfolioPage/Impacts/PortfolioImpactsTab';
import { PortfolioScoringTab } from './pages/PortfolioPage/Scoring/PortfolioScoringTab';
import { CreatePortfolioPage } from './pages/PortfolioEditingPages/CreatePortfolioPage/CreatePortfolioPage';
import { EditPortfolioPage } from './pages/PortfolioEditingPages/EditPortfolioPage/EditPortfolioPage';
import { DuplicatePortfolioPage } from './pages/PortfolioEditingPages/DuplicatePortfolioPage/DuplicatePortfolioPage';
import { LocationHazardTab } from './pages/LocationPage/Hazard/LocationHazardTab';
import { LocationDamageAndLossTab } from './pages/LocationPage/DamageAndLoss/LocationDamageAndLossTab';
import { LocationFinancialMetricsTab } from './pages/LocationPage/FinancialMetrics/LocationFinancialMetricsTab';
import { LocationFloodMeshTab } from './pages/LocationPage/FloodMesh/LocationFloodMeshTab';
import { UserSettings } from './pages/ProfilePage/UserSettings/UserSettings';
import { RoleManagement } from './pages/ProfilePage/RoleManagement/RoleManagement';
import { UserGroupManagement } from './pages/ProfilePage/UserGroupManagement/UserGroupManagement';
import { CreateRole } from './pages/ProfilePage/RoleManagement/components/CreateRole';
import { EditRole } from './pages/ProfilePage/RoleManagement/components/EditRole';
import { EditRoleUsers } from './pages/ProfilePage/RoleManagement/components/EditRoleUsers';
import PortfolioSharing from './pages/ProfilePage/PortfolioSharing/PortfolioSharing';
import { useUserContext } from './context/UserContextProvider';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { PortfolioAdaptationTab } from './pages/PortfolioPage/Adaptation/PortfolioAdaptationTab';

export const AppRouting = () => {
    const {
        isAdministrator,
        isPortfolioSharer,
        isPermissionsLoading,
        isPortfolioCreator,
    } = useUserContext();

    return (
        <>
            <Routes>
                <Route
                    path={ROUTES.HOMEPAGE}
                    element={<HomePage />}
                />
                <Route
                    path={ROUTES.PROFILE_PAGE}
                    element={<ProfilePage />}
                >
                    <Route
                        index
                        element={<UserSettings />}
                    />
                    <Route
                        path={ROUTES.PROFILE_TABS.ROLE_MANAGEMENT}
                        element={
                            <ProtectedRoute
                                isAllowed={isAdministrator}
                                loading={isPermissionsLoading}
                                redirectPath={ROUTES.PROFILE_PAGE}
                            >
                                <RoleManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.PROFILE_TABS.USER_GROUP_MANAGEMENT}
                        element={
                            <ProtectedRoute
                                isAllowed={isAdministrator}
                                loading={isPermissionsLoading}
                                redirectPath={ROUTES.PROFILE_PAGE}
                            >
                                <UserGroupManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.PROFILE_ROLE_CREATE_PAGE}
                        element={
                            <ProtectedRoute
                                isAllowed={isAdministrator}
                                loading={isPermissionsLoading}
                                redirectPath={ROUTES.PROFILE_PAGE}
                            >
                                <CreateRole />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.PROFILE_ROLE_EDIT_PAGE}
                        element={
                            <ProtectedRoute
                                isAllowed={isAdministrator}
                                loading={isPermissionsLoading}
                                redirectPath={ROUTES.PROFILE_PAGE}
                            >
                                <EditRole />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.PROFILE_ROLE_EDIT_USERS_PAGE}
                        element={
                            <ProtectedRoute
                                isAllowed={isAdministrator}
                                loading={isPermissionsLoading}
                                redirectPath={ROUTES.PROFILE_PAGE}
                            >
                                <EditRoleUsers />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.PROFILE_TABS.PORTFOLIO_SHARING}
                        element={
                            <ProtectedRoute
                                isAllowed={isPortfolioSharer}
                                loading={isPermissionsLoading}
                                redirectPath={ROUTES.PROFILE_PAGE}
                            >
                                <PortfolioSharing />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.PORTFOLIO_SHARING_WITH_PORTFOLIO_ID}
                        element={<PortfolioSharing />}
                    />
                </Route>
                <Route
                    path={ROUTES.CREATE_PORTFOLIO_PAGE}
                    element={
                        <ProtectedRoute
                            isAllowed={isPortfolioCreator}
                            loading={isPermissionsLoading}
                            redirectPath={ROUTES.HOMEPAGE}
                        >
                            <CreatePortfolioPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.EDIT_PORTFOLIO_PAGE}
                    element={<EditPortfolioPage />}
                />
                <Route
                    path={ROUTES.DUPLICATE_PORTFOLIO_PAGE}
                    element={<DuplicatePortfolioPage />}
                />
                <Route
                    path={ROUTES.PORTFOLIO_PAGE}
                    element={<PortfolioPage />}
                >
                    <Route
                        index
                        element={<PortfolioOverviewTab />}
                    />
                    <Route
                        path={ROUTES.PORTFOLIO_TABS.HAZARD}
                        element={<PortfolioHazardTab />}
                    />
                    <Route
                        path={ROUTES.PORTFOLIO_TABS.LOCATIONS}
                        element={<PortfolioLocationsTab />}
                    />
                    <Route
                        path={ROUTES.PORTFOLIO_TABS.IMPACTS}
                        element={<PortfolioImpactsTab />}
                    />
                    <Route
                        path={ROUTES.PORTFOLIO_TABS.SCORING}
                        element={<PortfolioScoringTab />}
                    />
                    <Route
                        path={ROUTES.PORTFOLIO_TABS.COMPLIANCE}
                        element={<PortfolioComplianceTab />}
                    />
                    <Route
                        path={ROUTES.PORTFOLIO_TABS.ADAPTATION}
                        element={<PortfolioAdaptationTab />}
                    />
                </Route>
                <Route
                    path={ROUTES.LOCATION_PAGE}
                    element={<LocationPage />}
                >
                    <Route
                        index
                        element={<LocationHazardTab />}
                    />
                    <Route
                        path={ROUTES.LOCATION_TABS.DAMAGE_AND_LOSS}
                        element={<LocationDamageAndLossTab />}
                    />
                    <Route
                        path={ROUTES.LOCATION_TABS.FINANCIAL_METRICS}
                        element={<LocationFinancialMetricsTab />}
                    />
                    <Route
                        path={ROUTES.LOCATION_TABS.FLOOD_MESH}
                        element={<LocationFloodMeshTab />}
                    />
                </Route>

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={ROUTES.HOMEPAGE}
                            replace
                        />
                    }
                />
            </Routes>
        </>
    );
};
