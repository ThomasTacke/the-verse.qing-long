import { RootGetSchema } from './root.schema';
import { FastifyReply, FastifyRequest } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, Hook, AbstractController } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http'

@Controller({
  route: '',
  type: ControllerType.SINGLETON
}) export default class RootController extends AbstractController {
  @GET({ url: '/', options: { schema: RootGetSchema } }) async handle(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    request.log.info('GET called');
    reply.send('Hello World!');
  }
}
