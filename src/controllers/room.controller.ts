import { FastifyReply, FastifyRequest } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, Hook, AbstractController } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http'
import { MqttComponent, Room } from '../models/sqlite.models';

@Controller({
  route: '/room',
  type: ControllerType.SINGLETON
}) export default class RoomController extends AbstractController {
  @GET({ url: '/:id'}) async getHandle(requst: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const roomRepository = this.instance.orm.getRepository(Room);
    const room = await roomRepository.findOne(requst.params.id, {relations: ['device']});
    this.instance.log.info(room);
    return reply.code(200).send(room);
  }
}