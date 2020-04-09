import { FastifyReply, FastifyRequest } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, Hook, AbstractController } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http'
import { Device } from '../models/sqlite.models';
import { DeviceGetSchema } from './device.schema';

@Controller({
  route: '',
  type: ControllerType.SINGLETON
}) export default class DeviceController extends AbstractController {
  
  @GET({ url: '/devices', options: { schema: DeviceGetSchema } }) async handle(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const deviceRepository = this.instance.orm.getRepository(Device);
    this.instance.log.info('GET called');
    const devices = await deviceRepository.findOne(1,  { relations: ['room', 'type', 'mqttComponents'] });
    this.instance.log.info(devices);
    return reply.code(200).send(devices);
  }
}
