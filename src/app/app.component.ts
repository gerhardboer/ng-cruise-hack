/// <reference types="web-bluetooth" />
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  characteristic: BluetoothRemoteGATTCharacteristic;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      color: ''
    });

    this.form.controls['color']
      .valueChanges
      .map(hex => this.hexToRgb(hex))
      .subscribe(color => this.color(color.r, color.g, color.b));
  }

  private hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
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
