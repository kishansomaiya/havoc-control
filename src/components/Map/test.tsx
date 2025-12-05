import { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useGetWebsocketQuery, useUpdateWebsocketMutation } from '../../store/havocAPI';
import { havocai } from '../../types/messages/v0/bundle';

const Test = () => {
  const { frontendAccessToken } = useAppSelector(state => state.app)
  const { data: websocketData, error: websocketError, isLoading: websocketLoading } = useGetWebsocketQuery(frontendAccessToken);
  const [updateWebsocket, { isLoading: isUpdating, isError: updateError, isSuccess: updateSuccess }] = useUpdateWebsocketMutation();

  useEffect(() => {
    updateWebsocket({
      updateInterval: 500,
      encoding: havocai.messages.v0.Encoding.ENCODING_PROTOBUF, // 1 = ProtoBuf, 0 = JSON
      criteria: [{
        resource_kind: havocai.messages.v0.ResourceKind.RESOURCE_KIND_TEAM,
      }]
    });
  }, [updateWebsocket]);

  useEffect(() => {
    if (websocketData) {
      console.log('WebSocket team data received:', websocketData);
    }
  }, [websocketData]);


  return (
    <div>Test Component</div>
  )
}

export default Test
