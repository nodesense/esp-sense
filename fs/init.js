load('api_dataview.js');
load('api_timer.js');
load('api_uart.js');
load('api_sys.js');
load('api_gpio.js');
load('api_config.js');
load('api_file.js');
load('api_rpc.js');
load('api_http.js');
load('api_mqtt.js');

load('buffer.js');
load('fetch.js');
load("rs485.js");
load("modbus_slave.js");

load("modbus_rtu.js");

load("registry.js");

//load("energy_meter.js");
//load("temperature_meter.js");
print("welcome ESP32");

RPC.call(RPC.LOCAL, 'Sys.GetInfo', null, function(resp, ud) {
  //print('Response:', JSON.stringify(resp));
  print('MAC address:', resp.mac);
}, null);

Cfg.set({debug: {level: 3}});


Registry.loadEdge();

if (Registry.edge) {
  print("Edge Setting found");
  if (Registry.edge.enableModbus === true) {
    print("Modbus Enabled, loading modbus");

    let rs485 = Registry.edge.rs485;

    if (!rs485 || rs485 === null || rs485 === undefined) {
      print("RS 485 settings not found");
      rs485 = {
          baudRate: 9600,
          parity: 0,
          numStopBits: 1
        };
    }
    print("Baud is ", rs485.baudRate);

    print("parity is ", rs485.parity);

    print("numStopBits is ", rs485.numStopBits);
    
    let serialPortConfig = {
      uartNo: 2,
      controlPin: 23,
      config: {
            baudRate: rs485.baudRate,
            parity: rs485.parity,
            numStopBits: rs485.numStopBits,
            esp32: {
              gpio: {
                rx: 16,
                tx: 17
              }
            }
          }
    };
    
    RS485.setFlowControl(23);
    
    RS485.init(serialPortConfig);
    
    Registry.loadModbus();
  } 
  else{
    print("Modbus not enabled");
  }
}
else
{
  print("Edge Setting  not found");
}

// let rs485Config = {
//   baudRate: 9600,
//   parity: 0,
//   numStopBits: 1
// };

// File.write(JSON.stringify(rs485Config), "rs485.json");

 
// let rs485Text = File.read("rs485.json");

// let rs485 = JSON.parse(rs485Text);



// let energyMeter1 = EnergyMeter.create(1);
 
// RS485.addDevice(energyMeter1.slave);

// let tempMeter1 = TemperatureMeter.create(5);
// RS485.addDevice(tempMeter1.slave);
 

Timer.set(60000 /* milliseconds */, Timer.REPEAT, function() {
   print(' RAM: ' + JSON.stringify(Sys.free_ram()));

  //let res = MQTT.pub('presence', JSON.stringify({ ram: Sys.free_ram(), b: 2 }), 0);
  //print('Published:', res ? 'yes' : 'no');
 

}, null);

// Registry.loadEdge();
  
let pin = 0;

GPIO.set_button_handler(pin, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
  print("Button pressed");

//  Registry.loadEdge();

  RPC.call(RPC.LOCAL, 'Sys.GetInfo', null, function(resp, ud) {
    //print('Response:', JSON.stringify(resp));
    print('MAC address:', resp.mac);
    Fetch.fetchEdge(resp.mac);
    print("Fetch completed");
  }, null);

}, null);
 

let delpin=22;

GPIO.set_button_handler(delpin, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
  print("Delete Button pressed");
Registry.resetEdge();
}, null);


//  MQTT.sub('presence', function(conn, topic, msg) {
//     print('Topic:', topic, 'message:', msg);
//   }, null);

  // MQTT.setEventHandler(function(conn, ev, edata) {
  //   if (ev !== 0) print('MQTT event handler: got', ev);
  //   // if (edata !== 0) print('MQTT event handler: got edata', edata);
    
  // }, null);