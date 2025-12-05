import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const auth = useAuth();
console.log('Callback component rendered, auth state:', auth);
  useEffect(() => {
    if (!auth.isLoading) {
      navigate('/');
    }
  }, [auth, navigate]);

  return <>Loading...</>
};

export default Callback;
