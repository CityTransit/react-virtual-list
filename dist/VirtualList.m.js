import react, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var topFromWindow = function topFromWindow(element) {
  if (typeof element === "undefined" || !element) return 0;
  return (element.offsetTop || 0) + topFromWindow(element.offsetParent);
};

var getElementTop = function getElementTop(element) {
  if (element.pageYOffset) return element.pageYOffset;

  if (element.document) {
    if (element.document.documentElement && element.document.documentElement.scrollTop) return element.document.documentElement.scrollTop;
    if (element.document.body && element.document.body.scrollTop) return element.document.body.scrollTop;
    return 0;
  }

  return element.scrollY || element.scrollTop || 0;
};

var getVisibleItemBounds = function getVisibleItemBounds(list, container, items, itemHeight, itemBuffer) {
  // early return if we can't calculate
  if (!container) return undefined;
  if (!itemHeight) return undefined;
  if (!items) return undefined;
  if (items.length === 0) return undefined; // what the user can see

  var innerHeight = container.innerHeight,
      clientHeight = container.clientHeight;
  var viewHeight = innerHeight || clientHeight; // how many pixels are visible

  if (!viewHeight) return undefined;
  var viewTop = getElementTop(container); // top y-coordinate of viewport inside container

  var viewBottom = viewTop + viewHeight;
  var listTop = topFromWindow(list) - topFromWindow(container); // top y-coordinate of container inside window

  var listHeight = itemHeight * items.length; // visible list inside view

  var listViewTop = Math.max(0, viewTop - listTop); // top y-coordinate of list that is visible inside view

  var listViewBottom = Math.max(0, Math.min(listHeight, viewBottom - listTop)); // bottom y-coordinate of list that is visible inside view
  // visible item indexes

  var firstItemIndex = Math.max(0, Math.floor(listViewTop / itemHeight) - itemBuffer);
  var lastItemIndex = Math.min(items.length, Math.ceil(listViewBottom / itemHeight) + itemBuffer) - 1;
  return {
    firstItemIndex: firstItemIndex,
    lastItemIndex: lastItemIndex
  };
};

var _this = undefined;
var _arguments = arguments;

var throttleWithRAF = (function (fn) {
  var running = false;
  return function () {
    if (running) return;
    running = true;
    window.requestAnimationFrame(function () {
      fn.apply(_this, _arguments);
      running = false;
    });
  };
});

var defaultMapToVirtualProps = function defaultMapToVirtualProps(_ref, _ref2) {
  var items = _ref.items,
      itemHeight = _ref.itemHeight;
  var firstItemIndex = _ref2.firstItemIndex,
      lastItemIndex = _ref2.lastItemIndex;
  var visibleItems = lastItemIndex > -1 ? items.slice(firstItemIndex, lastItemIndex + 1) : []; // style

  var height = items.length * itemHeight;
  var paddingTop = firstItemIndex * itemHeight;
  return {
    items: visibleItems,
    style: {
      height: height,
      paddingTop: paddingTop,
      boxSizing: "border-box"
    }
  };
};

var VirtualList =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(VirtualList, _PureComponent);

  function VirtualList(props) {
    var _this;

    _classCallCheck(this, VirtualList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VirtualList).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isMounted", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setStateIfNeeded", function (list, container, items, itemHeight, itemBuffer) {
      // get first and lastItemIndex
      var state = getVisibleItemBounds(list, container, items, itemHeight, itemBuffer);

      if (state === undefined) {
        return;
      }

      if (state.firstItemIndex > state.lastItemIndex) {
        return;
      }

      if (state.firstItemIndex !== _this.state.firstItemIndex || state.lastItemIndex !== _this.state.lastItemIndex) {
        _this.setState(state);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "refreshState", function () {
      if (!_this._isMounted) {
        return;
      }

      var _this$props = _this.props,
          itemHeight = _this$props.itemHeight,
          items = _this$props.items,
          itemBuffer = _this$props.itemBuffer,
          container = _this$props.container;

      _this.setStateIfNeeded(_this.domNode, container, items, itemHeight, itemBuffer);
    });

    _this.state = _objectSpread({
      firstItemIndex: 0,
      lastItemIndex: -1
    }, props.initialState); // if requestAnimationFrame is available, use it to throttle refreshState

    if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
      _this.refreshState = throttleWithRAF(_this.refreshState);
    }

    return _this;
  }

  _createClass(VirtualList, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this._isMounted = true;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // cache the DOM node
      this.domNode = ReactDOM.findDOMNode(this); // we need to refreshState because we didn't have access to the DOM node before

      this.refreshState(); // add events

      this.props.container.addEventListener("scroll", this.refreshState);
      this.props.container.addEventListener("resize", this.refreshState);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false; // remove events

      this.props.container.removeEventListener("scroll", this.refreshState);
      this.props.container.removeEventListener("resize", this.refreshState);
    } // if props change, just assume we have to recalculate

  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      console.log("componentWillReceiveProps", this.props, nextProps);
      var itemHeight = nextProps.itemHeight,
          items = nextProps.items,
          itemBuffer = nextProps.itemBuffer,
          container = nextProps.container;
      this.props.container.removeEventListener("scroll", this.refreshState);
      this.props.container.removeEventListener("resize", this.refreshState);
      container.addEventListener("scroll", this.refreshState);
      container.addEventListener("resize", this.refreshState);
      this.setStateIfNeeded(this.domNode, container, items, itemHeight, itemBuffer);
    }
  }, {
    key: "render",
    value: function render() {
      var virtual = this.props.mapVirtualToProps(this.props, this.state);
      return this.props.children(virtual);
    }
  }]);

  return VirtualList;
}(PureComponent);

_defineProperty(VirtualList, "propTypes", {
  items: PropTypes.array.isRequired,
  itemHeight: PropTypes.number.isRequired,
  itemBuffer: PropTypes.number,
  container: PropTypes.object,
  initialState: PropTypes.shape({
    firstItemIndex: PropTypes.number,
    lastItemIndex: PropTypes.number
  }),
  children: PropTypes.func.isRequired,
  mapVirtualToProps: PropTypes.func
});

_defineProperty(VirtualList, "defaultProps", {
  itemBuffer: 0,
  container: typeof window !== "undefined" ? window : undefined,
  initialState: {},
  mapVirtualToProps: defaultMapToVirtualProps
});

export default VirtualList;
