import { FastifyInstance, FastifyReply, FastifyRequest, RawServerBase } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, FastifyInstanceToken, getInstanceByToken } from 'fastify-decorators';
import { Device, Room, DeviceType, MqttComponent } from '../models/sqlite.models';
import S from 'fluent-json-schema';

const tag = 'Device';

export const deviceResponseSchema = S.object()
  .id('#device')
  .prop('id', S.number())
  .prop('name', S.string())
  .prop('displayName', S.string())
  .prop('room', S.ref('#room'))
  .prop('devicetype', S.ref('#devicetype'))
  .prop('mqttComponents', S.array().ref('#mqttcomponent'));

export const devicesResponseSchema = S.object()
  .id('#devices')
  .prop('devices', S.array().ref('#device'));

const deviceBodySchema = S.object()
  .prop('name', S.string()).required()
  .prop('displayName', S.string()).required()
  .prop('deviceTypeId', S.number()).required()
  .prop('roomId', S.number())
  .prop('mqttComponentIds', S.array().items(S.number()));

const idParam = S.object()
  .prop('id', S.number());

const getDevicesSchema = {
  tags: [tag],
  description: 'Get Devices',
  response: { 200: devicesResponseSchema }
};

const getDeviceSchema = {
  tags: [tag],
  description: 'Get Specific Device',
  params: idParam,
  response: { 200: deviceResponseSchema }
};

const putDeviceSchema = {
  tags: [tag],
  description: 'Update Device',
  params: idParam,
  body: deviceBodySchema,
  response: { 200: deviceResponseSchema }
};

const postDeviceSchema = {
  tags: [tag],
  description: 'Create Device',
  body: deviceBodySchema,
  response: { 201: deviceResponseSchema }
};

const deleteDeviceSchema = {
  tags: [tag],
  description: 'Delete Device',
  params: idParam,
  response: { 204: { type: 'null' } }
};

@Controller({
  route: 'device',
  type: ControllerType.SINGLETON
}) export default class DeviceController {
  private instance: FastifyInstance = getInstanceByToken(FastifyInstanceToken);

  @GET({ url: '/', options: { schema: getDevicesSchema } }) async getDevices(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    this.instance.log.info("Das ist ein Test");
    const deviceRepository = this.instance.orm.getRepository(Device);
    const devices = await deviceRepository.find({ relations: ['room', 'type', 'mqttComponents'] });
    return reply.code(200).send(JSON.stringify({ devices: devices }));
  }

  @GET({ url: '/:id', options: { schema: getDeviceSchema } }) async getOneDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const deviceRepository = this.instance.orm.getRepository(Device);
    const device = await deviceRepository.findOne(request.params.id, { relations: ['room', 'type', 'mqttComponents'] });
    return reply.code(200).send(JSON.stringify(device));
  }

  @PUT({ url: '/:id', options: { schema: putDeviceSchema } }) async updateDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const deviceRepository = this.instance.orm.getRepository(Device);
    const deviceTypeRepository = this.instance.orm.getRepository(DeviceType);
    const roomRepository = this.instance.orm.getRepository(Room);
    const mqttComponentRepository = this.instance.orm.getRepository(MqttComponent);
    const device = await deviceRepository.findOne(request.params.id);
    device.name = request.body.name;
    device.displayName = request.body.displayName;
    if (request.body.roomId)
      device.room = await roomRepository.findOne(request.body.roomId);
    if (request.body.deviceTypeId)
      device.type = await deviceTypeRepository.findOne(request.body.deviceTypeId);
    if (request.body.mqttComponentIds)
      device.mqttComponents = await mqttComponentRepository.findByIds(request.body.mqttComponentIds);

    await deviceRepository.save(device);
    return reply.code(200).send(device);
  }

  @POST({ url: '/', options: { schema: postDeviceSchema } }) async createDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const deviceRepository = this.instance.orm.getRepository(Device);
    const deviceTypeRepository = this.instance.orm.getRepository(DeviceType);
    const roomRepository = this.instance.orm.getRepository(Room);
    const mqttComponentRepository = this.instance.orm.getRepository(MqttComponent);
    const results = await Promise.all([
      roomRepository.findOne(request.body.roomId),
      deviceTypeRepository.findOne(request.body.deviceTypeId),
      mqttComponentRepository.findByIds(request.body.mqttComponentIds)
    ]);
    let device = new Device();
    device.name = request.body.name;
    device.displayName = request.body.displayName;
    device.room = results[0] as Room;
    device.type = results[1];
    device.mqttComponents = results[2];

    device = await deviceRepository.save(device);
    return reply.code(200).send(device);
  }

  @DELETE({ url: '/:id', options: { schema: deleteDeviceSchema } }) async deleteDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const deviceRepository = this.instance.orm.getRepository(Device);
    const device = await deviceRepository.findOne(request.params.id);
    await deviceRepository.remove(device);
    return reply.code(204).send();
  }
}
