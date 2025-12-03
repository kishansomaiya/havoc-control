import { useEffect, useState } from 'react';
import { useGetEntityQuery } from '../../store/havocAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setAppOpenDrawers } from '../../store/features/appSlice';
import EntityDetails from './entityDetails';
import Header from '../header/header';
import { havocTheme } from '../../common/havocTheme';

const EntityManager = () => {
  const dispatch = useDispatch();
  const [entities, setEntities] = useState(null);
  const activeEntity = useSelector((state: any) => state.app.activeEntity);
  const [activeEntityItem, setActiveEntityItem] = useState(null);
  const { data: entitiesData, error: entitiesError, isLoading: entitiesLoading } = useGetEntityQuery(activeEntity || '');

  useEffect(() => {
    if (!entitiesData) return;

    setActiveEntityItem(null);
    setEntities(entitiesData.values);
  }, [entitiesData]);

  if (entitiesLoading) return <div>Loading...</div>;
  if (entitiesError) return <div>Error loading data</div>;
  return (
    <div className='entity-manager' style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Header
        sx= {{ borderBottom: `1px solid ${havocTheme.palette.divider}`}}
        title={activeEntityItem ? activeEntityItem.meta.name : activeEntity}
        onClose={() => {
          dispatch(setAppOpenDrawers({ left: false }));
        }}
        onBack={activeEntityItem ? () => setActiveEntityItem(null) : undefined}
      />
      {!activeEntityItem &&
        <div className='entity-manager__list'>
          <div className='entity-manager__list-inner'>
            {entities && entities.map((entityItem) => {
              return (
                <div
                  key={entityItem.meta.id}
                  onClick={() => setActiveEntityItem(entityItem)}
                >
                  <p>{entityItem.meta.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      }
      {activeEntityItem &&
        <div className='entity-manager__details' style={{ overflowY: 'auto' }}>
          <div className='entity-manager__details-inner'>
            <p>{activeEntityItem.meta.name}</p>
            <p>ID: {activeEntityItem.meta.id}</p>
            <p>Type: {activeEntityItem.type}</p>
            <EntityDetails entityType={activeEntity} entityDetails={activeEntityItem} />
          </div>
        </div>
      }
    </div>
  );
};

export default EntityManager;
