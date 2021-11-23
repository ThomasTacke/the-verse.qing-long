import { FastifyInstance, FastifyReply, FastifyRequest, RawServerBase } from 'fastify'
import { Controller, ControllerType, GET, FastifyInstanceToken, getInstanceByToken } from 'fastify-decorators';
import S from 'fluent-json-schema';

const tag = 'Index';

const indexSchema = S.object()
  .prop('code', S.number())
  .prop('msg', S.string())
  .prop('root', S.boolean());

const getIndexSchema = {
  tags: [tag],
  description: 'Get Index Route',
  response: { 200: indexSchema }
}

@Controller({
  route: '',
  type: ControllerType.SINGLETON
}) export default class IndexController {
  private instance: FastifyInstance = getInstanceByToken(FastifyInstanceToken);

  @GET({ url: '/', options: { schema: getIndexSchema } }) async getIndex(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    return reply.code(200).send({
      code: 200,
      msg: 'Qing-Long Service up and running!',
      root: true
    });
  }
}
