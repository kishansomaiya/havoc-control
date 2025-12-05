import { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useGetWebsocketQuery, useUpdateWebsocketMutation } from '../../store/havocAPI';
import { havocai } from '../../types/messages/v0/bundle';

const Websocket = () => {
  const { frontendAccessToken } = useAppSelector(state => state.app)
  const { data: websocketData, error: websocketError, isLoading: websocketLoading } = useGetWebsocketQuery(frontendAccessToken);
  const [updateWebsocket, { isLoading: isUpdating, isError: updateError, isSuccess: updateSuccess }] = useUpdateWebsocketMutation();
  const { activeSectorId } = useAppSelector(state => state.app);

  useEffect(() => {
    const criteria = Object.values(havocai.messages.v0.ResourceKind).map((value) => ({ resourceKind: value }));

    updateWebsocket({
      updateInterval: 500,
      encoding: havocai.messages.v0.Encoding.ENCODING_PROTOBUF, // 1 = ProtoBuf, 0 = JSON
      criteria: criteria,
    });
  }, [updateWebsocket]);

  useEffect(() => {
    if (websocketData) {
      console.log('WebSocket Data:', websocketData);
    }
  }, [websocketData]);

  return false
}

export default Websocket
