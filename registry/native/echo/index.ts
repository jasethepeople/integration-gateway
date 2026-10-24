import type { IIntegrationComponent } from '../_types.js';

const component: IIntegrationComponent = {
  def: {
    key: 'native_echo',
    name: 'Native Echo',
    description:
      'Passthrough action that echoes the incoming event back (smoke-test target).',
    type: 'action',
    version: '1.0.0',
    propsSchema: {
      type: 'object',
      additionalProperties: true,
      description: 'Any payload; echoed back verbatim.',
    },
  },
  async run(ctx, event, _steps) {
    ctx.log('info', 'native_echo received event', event);
    return { echo: event };
  },
};

export default component;
