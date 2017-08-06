// TODO can i use more es6 features?

/** * Fibaro The Button Z-Way HA module ***************************************

 Version: 1.0.0
 -----------------------------------------------------------------------------
 Author: Marlon Alagoda
 Description: Fire usefull events on interactions with Fibaro's "The Button"
 ******************************************************************************/

function Ftb (id, controller) {
  // Call superconstructor first (AutomationModule)
  Ftb.super_.call(this, id, controller)
}

inherits(Ftb, AutomationModule)

_module = Ftb

/**
 * Get's called by framework on init
 * @param config - contains default values and values chosen by user via UI
 */
Ftb.prototype.init = function (config) {
  Ftb.super_.prototype.init.call(this, config)
  debugPrint('Fibaro\'s "The Button" module started #############################################################')

  const self = this
  const button = self.config.sourceDevice.button
  var lastEvent = {}

  self.buttons = [{
    name: 'Switch',
    deviceType: 'switchBinary',
    icon: 'switch',
    level: 'off'
  }, {
    name: '2xPress',
    deviceType: 'switchBinary',
    icon: 'media',
    level: 'on'
  }, {
    name: '3xPress',
    deviceType: 'switchBinary',
    icon: 'media',
    level: 'on'
  }, {
    name: '4xPress',
    deviceType: 'switchBinary',
    icon: 'media',
    level: 'on'
  }, {
    name: '5xPress',
    deviceType: 'switchBinary',
    icon: 'media',
    level: 'on'
  }, {
    name: 'longPress',
    deviceType: 'switchBinary',
    icon: 'media',
    level: 'on'
  }]
  self.vDevs = {}

  // Create dummy devices
  self.createDummyDevices()

  // Bind events
  self.controller.devices.on(button.device, 'change:metrics:level', function (event) {
    const updateTime = event.get('updateTime')

    debugPrint(JSON.stringify(self.controller.devices))

    // Make sure it does get fired only once
    if (!lastEvent.updateTime || lastEvent.updateTime < updateTime) {
      lastEvent = {level: event.get('metrics').level, updateTime: updateTime}

      // Handle event
      switch (parseInt(String(event.get('metrics').level).split('')[1])) {
        case 0:
          if (self.vDevs['Switch'].get('metrics:level') === 'on') {
            self.vDevs['Switch'].performCommand('off')
          } else {
            self.vDevs['Switch'].performCommand('on')
          }
          break
        case 2:
          self.vDevs['longPress'].performCommand('off')
          self.vDevs['longPress'].performCommand('on')
          break
        case 3:
          self.vDevs['2xPress'].performCommand('off')
          self.vDevs['2xPress'].performCommand('on')
          break
        case 4:
          self.vDevs['3xPress'].performCommand('off')
          self.vDevs['3xPress'].performCommand('on')
          break
        case 5:
          self.vDevs['4xPress'].performCommand('off')
          self.vDevs['4xPress'].performCommand('on')
          break
        case 6:
          self.vDevs['5xPress'].performCommand('off')
          self.vDevs['5xPress'].performCommand('on')
          break
        default:
          debugPrint('Unknown event in Ftb app')
      }
    }
  })
}

Ftb.prototype.createDummyDevices = function () {
  const self = this
  const buttonName = self.getInstanceTitle()

  for (var i in self.buttons) {
    var button = self.buttons[i]
    self.vDevs[button.name] = self.controller.devices.create({
      deviceId: 'ftb_' + button.name + '_' + self.id,
      defaults: {
        metrics: {
          title: buttonName + ' ' + button.name
        }
      },
      overlay: {
        deviceType: button.deviceType,
        metrics: {
          icon: button.icon,
          level: button.level
        }
      },
      handler: function (cmd, args) {
        if (cmd !== 'update' && this.get('deviceType') === 'switchBinary') {
          this.set('metrics:level', cmd)
        }
      },
      moduleId: self.id
    })
  }
}

Ftb.prototype.stop = function () {
  for (var i in Object.keys(this.vDevs)) {
    this.controller.devices.remove(this.vDevs[this.buttons[i].name].id)
  }

  Ftb.super_.prototype.stop.call(this)
}
