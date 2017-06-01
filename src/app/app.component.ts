/// <reference types="web-bluetooth" />
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  characteristic: BluetoothRemoteGATTCharacteristic;

  constructor() {
  }

  async connect() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [ { services: [ 0xffe5 ] } ]
    });
    const gatt = await device.gatt.connect();
    const service = await gatt.getPrimaryService(0xffe5);
    this.characteristic = await service.getCharacteristic(0xffe9);
  }

  async turnOn() {
    const data = new Uint8Array([ 0xcc, 0x23, 0x33 ]);
    this.characteristic.writeValue(data)
      .then(
        success => console.log('success on'),
        error => console.error('error on')
      );
  }

  async color(red, green, blue) {
    await this.characteristic.writeValue(
      new Uint8Array([ 0x56, red, green, blue, 0x00, 0xf0, 0xaa ])
    ).then(
      success => console.log('success light'),
      error => console.error('error light')
    );
  }

  async turnOff() {
    const data = new Uint8Array([0xcc, 0x24, 0x33]);
    return this.characteristic.writeValue(data)
      .then(
        success => console.log('success darkness'),
        error => console.error('error darkness')
      );
  }
}
