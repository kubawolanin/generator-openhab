'use strict';
const _ = require('lodash');
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const s = require('underscore.string');
const i18n = require('i18n');
const yosay = require('yosay');

/**
 * i18n definitions
 */
let languages = [
  { name: 'English', value: 'en' },
  { name: 'Polish', value: 'pl' }
];

/**
 * Structure definitions
 */
let floors = [
  { name: 'GF', value: 'GroundFloor', icon: 'groundfloor' },
  { name: 'FF', value: 'FirstFloor', icon: 'firstfloor' },
  { name: 'F2', value: 'SecondFloor', icon: 'attic' },
  { name: 'F3', value: 'ThirdFloor', icon: 'attic' },
  { name: 'F4', value: 'FourthFloor', icon: 'attic' }
];

let rooms = [
  { value: 'Attic', icon: 'attic' },
  { value: 'Balcony', icon: '' },
  { value: 'Basement', icon: 'cellar' },
  { value: 'Bathroom', icon: 'bath' },
  { value: 'Bedroom', icon: 'bedroom' },
  { value: 'Boiler', icon: 'boiler_viessmann' },
  { value: 'Wardrobe', icon: 'wardrobe' },
  { value: 'Corridor', icon: 'corridor' },
  { value: 'Dining', icon: '' },
  { value: 'ElderlyRoom', icon: '' },
  { value: 'Entrance', icon: 'frontdoor' },
  { value: 'Garage', icon: 'garage' },
  { value: 'Hallway', icon: 'corridor' },
  { value: 'HomeCinema', icon: 'television' },
  { value: 'KidRoom1', icon: '' },
  { value: 'KidRoom2', icon: '' },
  { value: 'KidRoom3', icon: '' },
  { value: 'KidsRoom', icon: '' },
  { value: 'Kitchen', icon: 'kitchen' },
  { value: 'LaundryRoom', icon: 'washingmachine' },
  { value: 'Library', icon: 'office' },
  { value: 'Living', icon: 'sofa' },
  { value: 'LivingDining', icon: 'sofa' },
  { value: 'Loft', icon: 'attic' },
  { value: 'Lounge', icon: 'sofa' },
  { value: 'MasterBathroom', icon: '' },
  { value: 'MasterBedroom', icon: 'bedroom_red' },
  { value: 'NannyRoom', icon: 'woman_1' },
  { value: 'Office', icon: 'office' },
  { value: 'Outdoor', icon: 'garden' },
  { value: 'Porch', icon: 'group' },
  { value: 'SecondBathroom', icon: 'bath' },
  { value: 'SecondBedroom', icon: 'bedroom_orange' },
  { value: 'Stairwell', icon: '' },
  { value: 'StorageRoom', icon: 'suitcase' },
  { value: 'Studio', icon: '' },
  { value: 'Toilet', icon: 'toilet' },
  { value: 'Terrace', icon: 'terrace' }
];

let devices = [
  { value: 'Light', icon: 'light', type: 'Switch:OR(ON, OFF)' },
  { value: 'Window', icon: 'window', type: 'Contact:OR(OPEN, CLOSED)' },
  { value: 'Door', icon: 'door', type: 'Contact:OR(OPEN, CLOSED)' },
  { value: 'Motion', icon: 'motion', type: 'Switch:OR(ON, OFF)' },
  { value: 'Power', icon: 'poweroutlet', type: 'Switch:OR(ON, OFF)', noPlural: true },
  { value: 'Shutter', icon: 'rollershutter', type: 'Rollershutter:OR(UP, DOWN)' },
  { value: 'Fan', icon: 'fan_ceiling', type: 'Switch:OR(ON, OFF)' },
  { value: 'AirCon', icon: 'climate', type: 'Switch:OR(ON, OFF)' },
  { value: 'Heating', icon: 'heating', type: 'Number:AVG', noPlural: true },
  { value: 'Temperature', icon: 'temperature', type: 'Number:AVG', noPlural: true },
  { value: 'Humidity', icon: 'humidity', type: 'Number:AVG', noPlural: true }
];

/**
 * Initial prompting
 */
const initPrompts = [{
    type: 'list',
    name: 'language',
    message: 'Please select your language',
    choices: languages,
    default: 'en',
    store: true
  },

  {
    type: 'checkbox',
    name: 'filesGenerated',
    message: 'What would you like to generate?',
    store: true,
    choices: [
      { name: 'Items file', value: 'items' },
      { name: 'Sitemap', value: 'sitemap' },
      { name: 'HABpanel Dashboards', value: 'habpanel' }
    ],
    default: ['items', 'sitemap']
  },

  {
    type: 'input',
    name: 'homeName',
    message: 'How do you want to call your home?',
    default: 'Our Home',
    store: true
  },

  {
    type: 'input',
    name: 'floorsCount',
    message: 'How many floors do you have? (max 5)',
    default: 1,
    store: true,
    validate: function(value) {
      var valid = !isNaN(parseFloat(value)) && value <= 5 && value > 0;
      return valid || 'Please enter a number higher than zero and lower than six.';
    }
  }
];

let roomsTemplate = {
  type: 'checkbox',
  choices: rooms,
  store: true,
  default: [
    'Bathrom',
    'Bedroom',
    'Dining',
    'Kitchen',
    'Living',
    'Office'
  ]
};

let devicesTemplate = {
  type: 'checkbox',
  store: true,
  choices: devices
};

let structure = [];
let floorsPrompts = [];
let roomsPrompts = [];
let chosenDevices = [];

let makeWidgets = function(device) {
  let type = device.type.split(':')[0] === 'Switch' ? 'switch' : 'dummy';
  let widgets = [];

  structure.forEach(function(floor, index, floors) {
    floor.rooms.forEach(function(room, i, rooms) {
      let dev = room.devices.find(d => d.value === device.value);
      let row = _.chunk(widgets, 6).length - 1;
      let count = widgets.length;

      if (dev) {
        let widget = {
          item     : (floors.length > 1 ? floor.name + '_' : '') + room.value + '_' + dev.value,
          name     : room.name,
          sizeX    : 2,
          sizeY    : 2,
          type     : type,
          row      : row > 0 ? row * 2 : 0,
          col      : (count * 2) % 12,
          font_size: '24',
          useserverformat: true
        };

        if (type === 'switch') {
            widget = _.extend({}, widget, {
                iconset  : 'eclipse-smarthome-classic',
                icon     : device.icon,
                icon_size: 64
            });
        } else {
            widget = _.extend({}, widget, {
                backdrop_iconset: 'eclipse-smarthome-classic',
                backdrop_icon   : device.icon,
                backdrop_center : true
            });
        }

        widgets.push(widget);
      }
    });
  });

  return widgets;
};

let translate = function() {
  floors = floors.map(floor => {
    return {
      name : floor.name,
      value: i18n.__(floor.value),
      icon : floor.icon
    };
  });

  rooms = rooms.map(room => {
    return {
      name : i18n.__(room.value),
      value: room.value,
      icon : room.icon
    };
  });

  devices = devices.map(device => {
    let pluralVal = device.noPlural ? device.value : device.value + 's';
    return {
      name       : i18n.__(device.value),
      pluralName : i18n.__(pluralVal),
      value      : device.value,
      pluralValue: pluralVal,
      icon       : device.icon,
      type       : device.type
    };
  });
}

module.exports = class extends Generator { // eslint-disable-line id-match
  constructor(args, opts) {
    super(args, opts);

    i18n.configure({
      locales  : languages.map(lang => lang.value),
      directory: this.sourceRoot() + '/i18n',
      register : global
    });
  }

  /**
   * Ask for initial things like the language
   * and number of floors.
   * Additionally prepare a dynamic list of rooms to be chosen
   * for each floor.
   *
   * @return {Promise}
   */
  prompting() {
    this.log(yosay(
      'Welcome to the ' + chalk.yellow('open') + chalk.red('HAB') + ' generator! \n' +
      'Let\'s design your home automation system.'
    ));

    return this.prompt(initPrompts).then((answers) => {
      i18n.setLocale(answers.language);
      this.props = answers;

      translate();

      let floorsCount = +answers.floorsCount;
      for (var i = 0; i < floorsCount; i++) {
        floors[i].rooms = [];
        structure.push(floors[i]);
        let tpl = Object.assign({
          name   : floors[i].name + '_rooms',
          message: 'Please select the rooms on ' + floors[i].value
        }, roomsTemplate);
        floorsPrompts.push(tpl);
      }
    });
  }

  /**
   * Ask for rooms on each floor
   * Additionally prepare a dynamic list of devices to be chosen
   * for each room.
   *
   * @return {Promise}
   */
  prompting2() {
    return this.prompt(floorsPrompts).then((answers) => {
      structure.forEach(function(floor, index) {
        let roomList = answers[floor.name + '_rooms'].map((room) =>
          rooms.find(r => r.value === room)
        );

        structure[index].rooms = roomList;

        roomList.forEach(function(room, i) {
          structure[index].rooms[i].devices = [];
          let tpl = Object.assign({
            name   : floor.name + '_' + room.name + '_devices',
            message: 'Select smart devices in: ' + room.name + ' on ' + floor.value
          }, devicesTemplate);
          roomsPrompts.push(tpl);
        });
      });
    });
  }

  /**
   * Ask for smart devices in each room
   *
   * @return {Promise}
   */
  prompting3() {
    return this.prompt(roomsPrompts).then((answers) => {
      structure.forEach(function(floor, i) {
        floor.rooms.forEach(function(room, j) {
          let name = floor.name + '_' + room.name + '_devices';
          let deviceList = answers[name] ? answers[name].map((device) =>
            devices.find(d => d.value === device)
          ) : [];

          chosenDevices.push(answers[name]);
          structure[i].rooms[j].devices = deviceList;
        });
      });

      this.props.devices = _.uniq(_.flatten(chosenDevices)).map((device) =>
        devices.find(d => d.value === device)
      );

      this.props.structure = structure;
    });
  }

  writing() {
    let name = s.dasherize(this.props.homeName).substr(1);
    this.props.name = name;

    if (this.props.filesGenerated.includes('items')) {
      this.fs.copyTpl(
        this.templatePath('items.ejs'),
        this.destinationPath('items/' + name + '.items'),
        this.props
      );
    }

    if (this.props.filesGenerated.includes('sitemap')) {
      this.fs.copyTpl(
        this.templatePath('sitemap.ejs'),
        this.destinationPath('sitemaps/' + name + '.sitemap'),
        this.props
      );
    }

    if (this.props.filesGenerated.includes('habpanel')) {
      let habpanel = devices.map(function(device) {
        return {
          id  : device.pluralValue,
          name: device.pluralName || device.pluralValue,
          row : 0,
          col : 0,
          tile: {
            backdrop_iconset: 'eclipse-smarthome-classic',
            backdrop_icon: device.icon,
            icon_size: 32
          },
          widgets: makeWidgets(device)
        }
      });

      this.fs.copyTpl(
        this.templatePath('habpanel.ejs'),
        this.destinationPath('html/' + name + '.json'), { habpanel: JSON.stringify(habpanel, null, '  ') }
      );
    }
  }
};
