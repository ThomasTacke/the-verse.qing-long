interface IMqttComponent {
  topic: string;
  type: string | any;
  values?: Array<string | number | any>;
}

export interface IRoom {
  name: string;
  shortname: string;
}

export interface IDevice {
  name: string;
  displayName: string;
  room: IRoom;
  type: IDeviceType;
  mqttComponents?: Array<IMqttComponent>;
}

export interface IDeviceType {
  name: string;
}
