import { useEffect, useRef } from 'react';
import { handleCallback } from './useAuth';

const Callback = () => {
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode or due to re-renders
    if (processedRef.current) {
      console.log('Callback: Already processed, skipping');
      return;
    }
    processedRef.current = true;

    const processCallback = async () => {
      try {
        console.log('Callback: Processing callback');
        const success = await handleCallback();
        console.log('Callback: handleCallback returned:', success);
        
        if (success) {
          console.log('Callback: Success, redirecting to /');
          // Small delay to ensure storage is flushed
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
        } else {
          console.log('Callback: Failed, redirecting to /');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Callback error:', error);
        window.location.href = '/';
      }
    };

    processCallback();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Processing login...
    </div>
  );
};

export default Callback;
