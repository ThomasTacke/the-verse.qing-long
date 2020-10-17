import { FastifyInstance, FastifyReply, FastifyRequest, RawServerBase } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, Inject, FastifyInstanceToken } from 'fastify-decorators';
import { Room } from '../models/sqlite.models';
import S from 'fluent-schema';

const tag = 'Room';

export const roomSchema = S.object()
  .id('#room')
  .prop('id', S.number())
  .prop('name', S.string())
  .prop('shortname', S.string());

export const roomsSchema = S.object()
  .id('#rooms')
  .prop('rooms', S.array().ref('#room'));

const roomBodySchema = S.object()
  .prop('name', S.string()).required()
  .prop('shortname', S.string()).required();

const idParam = S.object()
  .prop('id', S.number());

const getRoomsSchema = {
  tags: [tag],
  description: 'Get Rooms',
  response: { 200: roomsSchema }
};

const getRoomSchema = {
  tags: [tag],
  description: 'Get Specific Room',
  params: idParam,
  response: { 200: roomSchema }
};

const putRoomSchema = {
  tags: [tag],
  description: 'Update Room',
  params: idParam,
  body: roomBodySchema,
  response: { 200: roomSchema }
};

const postRoomSchema = {
  tags: [tag],
  description: 'Create Room',
  body: roomBodySchema,
  response: { 201: roomSchema }
};

const deleteRoomSchema = {
  tags: [tag],
  description: 'Delete Room',
  params: idParam,
  response: { 204: { type: 'null' } }
};

@Controller({
  route: 'room',
  type: ControllerType.SINGLETON
}) export default class RoomController {
  @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

  @GET({ url: '/', options: { schema: getRoomsSchema } }) async getRooms(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const roomRepository = this.instance.orm.getRepository(Room);
    const rooms = await roomRepository.find();
    return reply.code(200).send(JSON.stringify({ rooms: rooms }));
  }

  @GET({ url: '/:id', options: { schema: getRoomSchema } }) async getOneDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const roomRepository = this.instance.orm.getRepository(Room);
    const room = await roomRepository.findOne(request.params.id);
    return reply.code(200).send(JSON.stringify(room));
  }

  @PUT({ url: '/:id', options: { schema: putRoomSchema } }) async updateDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const roomRepository = this.instance.orm.getRepository(Room);
    const room = await roomRepository.findOne(request.params.id);
    room.name = request.body.name;
    room.shortname = request.body.shortname;
    await roomRepository.save(room);
    return reply.code(200).send(room);
  }

  @POST({ url: '/', options: { schema: postRoomSchema } }) async createDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const roomRepository = this.instance.orm.getRepository(Room);
    let room = new Room();
    room.name = request.body.name;
    room.shortname = request.body.shortname;
    room = await roomRepository.save(room);
    return reply.code(200).send(room);
  }

  @DELETE({ url: '/:id', options: { schema: deleteRoomSchema } }) async deleteDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const roomRepository = this.instance.orm.getRepository(Room);
    const room = await roomRepository.findOne(request.params.id);
    await roomRepository.remove(room);
    return reply.code(204).send();
  }
}
