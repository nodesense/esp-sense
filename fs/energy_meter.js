let EnergyMeter = {
    config: {
        coils: {
          offset: 0,
          size: 20
        },
        discreteInputs: {
          offset: 0,
          size: 20,
          le: false
        },
        holdingRegisters: {
          offset: 0,
          size: 100,
          le: false
        },
        inputRegisters: {
          offset: 0,
          size: 20,
          le: false
        }
    },

    profile: [
      {
        name: "FWVersion",
        location: MODBUS_HOLDING_REGISTERS,
        mode: READ,
        dataType: INT16,
        address: 1,
        value: 11
      },
      {
        name: "HWVersion",
        location: MODBUS_HOLDING_REGISTERS,
        mode: READ,
        dataType: INT16,
        address: 15,
        value: 33
      },
    
      {
        name: "SerialNumber", 
        location: MODBUS_HOLDING_REGISTERS,
        mode: READ,
        dataType: INT32,
        address: 16,
        value: 500
      },
    
      {
        name: "WT1", 
        location: MODBUS_HOLDING_REGISTERS,
        mode: READ,
        dataType: INT32,
        address: 28,
        value: 1020
      },
    
      {
        name: "WT1_PARTIAL", 
        location: MODBUS_HOLDING_REGISTERS,
        mode: READWRITE,
        dataType: INT32,
        address: 30,
        value: 2000
      },
      {
        name: "URMS_PH1", 
        location: MODBUS_HOLDING_REGISTERS,
        mode: READWRITE,
        dataType: INT16,
        address: 36,
        value: 230 //volt
      },
      
      {
        name: "IRMS_PH1", 
        location: MODBUS_HOLDING_REGISTERS,
        mode: READWRITE,
        dataType: INT16,
        address: 37,
        value: 5 //amp
      },

      {
        name: "PRMS_PH1", 
        location: MODBUS_HOLDING_REGISTERS,
        mode: READWRITE,
        dataType: INT16,
        address: 38,
        value: 50 //amp * voltage / 1000 to get KW
      }
      
    ],

    _Meter: {
      
      init: function(deviceId, config) {
        this.slave = Object.create(ModbusSlave);
        this.slave.deviceId = deviceId;

        this.slave.init(config);
        this.slave.setProfile(EnergyMeter.profile);
        this.slave.initDefaultValues();

        Timer.set(5000 /* milliseconds */, Timer.REPEAT, function(that) {
          
          let voltage = 220 + Math.floor(Math.random() * 10);
          let amp = 5 + Math.floor(Math.random() * 10);
          let current = voltage * amp;

          print(' Energy Meter : ', + that.slave.deviceId,voltage,amp,   current);

          that.slave.setHoldingRegister(36, voltage);
          
          that.slave.setHoldingRegister(37, amp);
          
          that.slave.setHoldingRegister(38, current);

        }, this);

      }

    },

    create: function(deviceId) {
      let energyDevice =  Object.create(EnergyMeter._Meter); 
      energyDevice.init(deviceId, EnergyMeter.config);
      return energyDevice;
    }
};
