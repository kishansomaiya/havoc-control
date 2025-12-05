import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

interface ProtectedRouteProps {
    isAllowed: boolean;
    loading?: boolean;
    redirectPath?: string;
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isAllowed,
    loading = false,
    redirectPath = '/',
    children,
}) => {
    if (loading) {
        return <LoadingSpinner loading={loading} />;
    }

    if (!isAllowed) {
        return (
            <Navigate
                to={redirectPath}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;
