const _ = require('lodash');
const {
  deleteDisableAction
} = require('../../../cronjob/trailingTradeHelper/common');
const queue = require('../../../cronjob/trailingTradeHelper/queue');

const handleSymbolEnableAction = async (logger, ws, payload) => {
  logger.info({ payload }, 'Start symbol enable action');

  const { data: symbolInfo } = payload;

  const { symbol } = symbolInfo;

  const deleteDisableActionFn = async () => {
    await deleteDisableAction(logger, symbol);
  };

  await queue.execute(
    logger,
    symbol,
    {
      preprocessFn: deleteDisableActionFn
    },
    {
      correlationId: _.get(logger, 'fields.correlationId', '')
    }
  );

  ws.send(
    JSON.stringify({ result: true, type: 'symbol-enable-action-result' })
  );
};

module.exports = { handleSymbolEnableAction };
