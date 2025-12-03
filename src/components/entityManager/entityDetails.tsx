import { useEffect, useState } from 'react';
import { useGetEntityByIdQuery } from '../../store/havocAPI';

const EntityDetails = ({ entityType, entityDetails }) => {
  const [entity, setEntity] = useState(null);
  const { data: entityData, error: entityError, isLoading: entityLoading } = useGetEntityByIdQuery({ type: entityType, id: entityDetails.meta.id });

  useEffect(() => {
    if (!entityData) return;

    setEntity(entityData);
  }, [entityData]);

  if (entityLoading) return <div>Loading...</div>;
  if (entityError) return <div>Error loading entity details</div>;

  return (
    <div className='entity-details'>
      {entity &&
        <pre>{JSON.stringify(entity, null, 2)}</pre>
      }
    </div>
  );
};

export default EntityDetails;
