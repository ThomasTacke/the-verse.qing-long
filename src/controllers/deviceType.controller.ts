import { FastifyInstance, FastifyReply, FastifyRequest, RawServerBase } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, FastifyInstanceToken, getInstanceByToken } from 'fastify-decorators';
import { DeviceType } from '../models/sqlite.models';
import S from 'fluent-json-schema';

const tag = 'Device Type';

export const deviceTypeSchema = S.object()
  .id('#devicetype')
  .prop('id', S.number())
  .prop('name', S.string());

export const deviceTypesSchema = S.object()
  .id('#devicetypes')
  .prop('deviceTypes', S.array().ref('#devicetype'));

const deviceTypeBodySchema = S.object()
  .prop('name', S.string()).required();

const idParam = S.object()
  .prop('id', S.number());

const getDeviceTypesSchema = {
  tags: [tag],
  description: 'Get Device Types',
  response: { 200: deviceTypesSchema }
};

const getDeviceTypeSchema = {
  tags: [tag],
  description: 'Get Specific Device Type',
  params: idParam,
  response: { 200: deviceTypeSchema }
};

const putDeviceTypeSchema = {
  tags: [tag],
  description: 'Update Device Type',
  params: idParam,
  body: deviceTypeBodySchema,
  response: { 200: deviceTypeSchema }
};

const postDeviceTypeSchema = {
  tags: [tag],
  description: 'Create Device Type',
  body: deviceTypeBodySchema,
  response: { 201: deviceTypeSchema }
};

const deleteDeviceTypeSchema = {
  tags: [tag],
  description: 'Delete Device Type',
  params: idParam,
  response: { 204: { type: 'null' } }
};

@Controller({
  route: 'devicetype',
  type: ControllerType.SINGLETON
}) export default class DeviceTypeController {
  private instance: FastifyInstance = getInstanceByToken(FastifyInstanceToken);
  
  @GET({ url: '/', options: { schema: getDeviceTypesSchema } }) async getRooms(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const deviceTypeRepository = this.instance.orm.getRepository(DeviceType);
    const deviceTypes = await deviceTypeRepository.find();
    return reply.code(200).send(JSON.stringify({ deviceTypes: deviceTypes }));
  }

  @GET({ url: '/:id', options: { schema: getDeviceTypeSchema } }) async getOneDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const deviceTypeRepository = this.instance.orm.getRepository(DeviceType);
    const deviceType = await deviceTypeRepository.findOne(request.params.id);
    return reply.code(200).send(JSON.stringify(deviceType));
  }

  @PUT({ url: '/:id', options: { schema: putDeviceTypeSchema } }) async updateDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const deviceTypeRepository = this.instance.orm.getRepository(DeviceType);
    const deviceType = await deviceTypeRepository.findOne(request.params.id);
    deviceType.name = request.body.name;
    await deviceTypeRepository.save(deviceType);
    return reply.code(200).send(deviceType);
  }

  @POST({ url: '/', options: { schema: postDeviceTypeSchema } }) async createDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const deviceTypeRepository = this.instance.orm.getRepository(DeviceType);
    let deviceType = new DeviceType();
    deviceType.name = request.body.name;
    deviceType = await deviceTypeRepository.save(deviceType);
    return reply.code(200).send(deviceType);
  }

  @DELETE({ url: '/:id', options: { schema: deleteDeviceTypeSchema } }) async deleteDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const deviceTypeRepository = this.instance.orm.getRepository(DeviceType);
    const deviceType = await deviceTypeRepository.findOne(request.params.id);
    await deviceTypeRepository.remove(deviceType);
    return reply.code(204).send();
  }
}
