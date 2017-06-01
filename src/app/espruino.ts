var bulbDevice = null;
var bulbChar = null;

function setColor(r, g, b) {
  try {
    bulbChar.writeValue(new Uint8Array([0x56, r, g, b, 0, 0xf0, 0xaa]));
  } catch (e) {
  }
}
var mpu = require("MPU6050").connect(I2C1);

function startLoop(char) {
  console.log('Connected !');

  setInterval(() => {light();}, 50);

  bulbChar = char;
}

function getValue() {
  return mpu.getGravity();
}

function m(degree) {
  return Math.abs(degree * 100);
}

function light() {
  var rot = getValue();
  setColor(m(rot[0]), m(rot[1]) ,m(rot[2]));
}

(NRF.requestDevice({ filters: [{ services: ['ffe5'] }] })
  .then(device => {
    bulbDevice = device;
    return device.gatt.connect();
  })
  .then(gatt => gatt.getPrimaryService('ffe5'))
  .then(service => service.getCharacteristic('ffe9'))
  .then(startLoop));
