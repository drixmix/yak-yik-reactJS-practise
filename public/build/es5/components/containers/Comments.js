"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var _presentations = require("../presentations");

var Comment = _presentations.Comment;
var CreateComment = _presentations.CreateComment;
var APIManager = require("../../utils").APIManager;
var connect = require("react-redux").connect;
var actions = _interopRequire(require("../../actions/actions"));

var Comments = (function (Component) {
  function Comments() {
    _classCallCheck(this, Comments);

    _get(Object.getPrototypeOf(Comments.prototype), "constructor", this).call(this);
    this.checkForComments = this.checkForComments.bind(this);
    this.state = {
      commentsLoaded: false,
      index: 0
    };
  }

  _inherits(Comments, Component);

  _prototypeProperties(Comments, null, {
    submitComment: {
      value: function submitComment(comment) {
        var _this = this;
        if (this.props.user == null) {
          alert("Please log in to comment");
          return;
        }
        var updateComment = Object.assign({}, comment);

        var zone = this.props.zones[this.props.index];
        updateComment.zone = zone._id;
        updateComment.username = this.props.user.username;

        APIManager.post("/api/comment", updateComment, function (err, response) {
          if (err) {
            alert(err);
            return;
          }
          var comment = response.result;
          _this.props.commentsRecieved([comment], zone);
        });
      },
      writable: true,
      configurable: true
    },
    checkForComments: {
      value: function checkForComments() {
        var _this = this;
        var zone = this.props.zones[this.props.index];
        if (zone == null) {
          console.log("NO SELECTED ZONE");
          return;
        }

        var commentsArray = this.props.commentsMap[zone._id];
        if (commentsArray != null) {
          // Comments have already been loaded
          return;
        }APIManager.get("/api/comment", { zone: zone._id }, function (err, response) {
          if (err) {
            alert("ERROR" + err.message);
            return;
          }
          var comments = response.results;
          _this.props.commentsRecieved(comments, zone);
        });
      },
      writable: true,
      configurable: true
    },
    componentDidMount: {
      value: function componentDidMount() {
        this.checkForComments();
      },
      writable: true,
      configurable: true
    },
    componentDidUpdate: {
      value: function componentDidUpdate() {
        this.checkForComments();
      },
      writable: true,
      configurable: true
    },
    updateComment: {
      value: function updateComment(comment, updatedBody) {
        console.log("updateComment: " + comment._id + ", " + updatedBody);
        this.props.updateComment(comment, { body: updatedBody });
      },
      writable: true,
      configurable: true
    },
    render: {
      value: function render() {
        var _this = this;
        var selectedZone = this.props.zones[this.props.index];
        var currentUser = this.props.user; // null if not logged in

        var zoneName = null;
        var commentList = null;

        if (selectedZone != null) {
          zoneName = selectedZone.name;

          var zoneComments = this.props.commentsMap[selectedZone._id];
          if (zoneComments != null) {
            commentList = zoneComments.map(function (comment, i) {
              var editable = false;
              if (currentUser != null) {
                if (currentUser.username == comment.username) editable = true;
              }

              return React.createElement(
                "li",
                { key: i },
                React.createElement(Comment, { onUpdate: _this.updateComment.bind(_this), isEditable: editable, currentComment: comment })
              );
            });
          }
        }




        return React.createElement(
          "div",
          null,
          React.createElement(
            "h1",
            null,
            zoneName
          ),
          React.createElement(
            "div",
            { style: { padding: 12, background: "#f9f9f9", border: "1px solid #ddd" } },
            React.createElement(
              "ul",
              null,
              commentList
            ),
            React.createElement(CreateComment, { onCreateComment: this.submitComment.bind(this) })
          )
        );
      },
      writable: true,
      configurable: true
    }
  });

  return Comments;
})(Component);

// Get the state/data from the reducer and use it in the container
var stateToProps = function (state) {
  return {
    //comments: state.comment.list,
    commentsMap: state.comment.map,
    commentsLoaded: state.comment.commentsLoaded,
    index: state.zone.selectedZone,
    zones: state.zone.list,
    user: state.account.user
  };
};
// Trigger the event to go to the actions
var dispatchToProps = function (dispatch) {
  return {
    commentsRecieved: function (comments, zone) {
      return dispatch(actions.commentsRecieved(comments, zone));
    },
    commentsCreated: function (comment) {
      return dispatch(actions.commentsCreated(comment));
    },
    updateComment: function (comment, params) {
      return dispatch(actions.updateComment(comment, params));
    }

  };
};

module.exports = connect(stateToProps, dispatchToProps)(Comments);