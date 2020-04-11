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
}

@Entity()
export class DeviceType implements IDeviceType {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  name: string;
}

@Entity()
export class Device implements IDevice {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  name: string;

  @OneToOne(() => Room) @JoinColumn()
  room: Room;

  @OneToOne(() => DeviceType)  @JoinColumn()
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
}

@Entity()
export class MqttComponent implements IMqttComponent {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  topic: string;

  @OneToMany(() => MqttComponentValue, value => value.mqttComponent)
  values: Array<MqttComponentValue>;

  @OneToOne(() => MqttComponentType) @JoinColumn()
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

  @ManyToOne(() => MqttComponent, mqttComponent => mqttComponent.values)
  mqttComponent: MqttComponent;
}
