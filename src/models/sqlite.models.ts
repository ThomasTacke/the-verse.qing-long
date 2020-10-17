import { Entity, Column, ObjectID, OneToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { IRoom, IDeviceType, IDevice, IMqttComponent } from './types'

@Entity()
export class Room implements IRoom {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  shortname: string;

  @OneToMany(() => Device, device => device.id)
  devices: Array<Device>;
}

@Entity()
export class DeviceType implements IDeviceType {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  name: string;

  @OneToMany(() => Device, device => device.type)
  devices: Array<Device>;
}

@Entity()
export class Device implements IDevice {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  name: string;

  @ManyToOne(() => Room) @JoinColumn()
  room: Room;

  @ManyToOne(() => DeviceType) @JoinColumn()
  type: DeviceType;

  @OneToMany(() => MqttComponent, mqtt => mqtt.device)
  mqttComponents: Array<MqttComponent>;
}

@Entity()
export class MqttComponentType {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  type: string;

  @OneToMany(() => MqttComponent, component => component.type)
  mqttComponents: Array<MqttComponent>;
}

@Entity()
export class MqttComponent implements IMqttComponent {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  topic: string;

  @OneToMany(() => MqttComponentValue, value => value.mqttComponent)
  values: Array<MqttComponentValue>;

  @ManyToOne(() => MqttComponentType, type => type.id)
  type: MqttComponentType;

  @ManyToOne(() => Device, device => device.mqttComponents)
  device: Device;
}

@Entity()
export class MqttComponentValue {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  value: string;

  @Column()
  type: string;

  @ManyToOne(() => MqttComponent, mqttComponent => mqttComponent.values)
  mqttComponent: MqttComponent;
}
