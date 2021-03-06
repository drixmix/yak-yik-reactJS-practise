"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var APIManager = require("../../utils").APIManager;
var _presentations = require("../presentations");

var Zone = _presentations.Zone;
var CreateZone = _presentations.CreateZone;
var connect = require("react-redux").connect;
var actions = _interopRequire(require("../../actions/actions"));

var Zones = (function (Component) {
  function Zones() {
    _classCallCheck(this, Zones);

    _get(Object.getPrototypeOf(Zones.prototype), "constructor", this).call(this);
    this.state = {};
  }

  _inherits(Zones, Component);

  _prototypeProperties(Zones, null, {
    componentDidMount: {
      value: function componentDidMount() {},
      writable: true,
      configurable: true
    },
    addZone: {
      value: function addZone(zone) {
        var _this = this;
        var updatedZone = Object.assign({}, zone);
        APIManager.post("/api/zone", updatedZone, function (err, response) {
          if (err) {
            alert("ERROR: " + err.message);
            return;
          }
          var zone = response.result;
          _this.props.zonesCreated(zone);
        });
      },
      writable: true,
      configurable: true
    },
    selectZone: {
      value: function selectZone(index) {
        console.log("selectZone" + index);
        /*this.setState({
          selected : index
        })*/
        this.props.selectZone(index);
      },
      writable: true,
      configurable: true
    },
    render: {
      value: function render() {
        var _this = this;
        var listItems = this.props.list.map(function (zone, i) {
          var selected = i == _this.props.selected;
          return React.createElement(
            "li",
            { key: i },
            React.createElement(Zone, { index: i, select: _this.selectZone.bind(_this), isSelected: selected, currentZone: zone })
          );
        });
        return React.createElement(
          "div",
          null,
          React.createElement(
            "ol",
            null,
            listItems
          ),
          React.createElement(CreateZone, { onCreateZone: this.addZone.bind(this) })
        );
      },
      writable: true,
      configurable: true
    }
  });

  return Zones;
})(Component);

var stateToProps = function (state) {
  return {
    list: state.zone.list,
    selected: state.zone.selectedZone
  };
};

var dispatchToProps = function (dispatch) {
  return {
    fetchZones: function (params) {
      return dispatch(actions.fetchZones(params));
    },
    zonesRecieved: function (zones) {
      return dispatch(actions.zonesRecieved(zones));
    },
    zonesCreated: function (zone) {
      return dispatch(actions.zonesCreated(zone));
    },
    selectZone: function (index) {
      return dispatch(actions.selectZone(index));
    }
  };
};


module.exports = connect(stateToProps, dispatchToProps)(Zones);
//selected: 0,