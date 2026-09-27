import { i as __toESM } from "../_runtime.mjs";
import { i as require_react } from "./react+tanstack__react-query.mjs";
import { t as require_prop_types } from "./prop-types.mjs";
import { t as fromEvent } from "./file-selector.mjs";
import { t as require_es } from "./attr-accept.mjs";
//#region node_modules/react-dropzone/dist/es/utils/index.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types());
var import_es = /* @__PURE__ */ __toESM(require_es());
function _toConsumableArray$1(arr) {
	return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1();
}
function _nonIterableSpread$1() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$1(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles$1(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}
function ownKeys$1(object, enumerableOnly) {
	var keys = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		enumerableOnly && (symbols = symbols.filter(function(sym) {
			return Object.getOwnPropertyDescriptor(object, sym).enumerable;
		})), keys.push.apply(keys, symbols);
	}
	return keys;
}
function _objectSpread$1(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = null != arguments[i] ? arguments[i] : {};
		i % 2 ? ownKeys$1(Object(source), !0).forEach(function(key) {
			_defineProperty$1(target, key, source[key]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key) {
			Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
		});
	}
	return target;
}
function _defineProperty$1(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _slicedToArray$1(arr, i) {
	return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1();
}
function _nonIterableRest$1() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}
function _arrayLikeToArray$1(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit$1(arr, i) {
	var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
	if (_i == null) return;
	var _arr = [];
	var _n = true;
	var _d = false;
	var _s, _e;
	try {
		for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
			_arr.push(_s.value);
			if (i && _arr.length === i) break;
		}
	} catch (err) {
		_d = true;
		_e = err;
	} finally {
		try {
			if (!_n && _i["return"] != null) _i["return"]();
		} finally {
			if (_d) throw _e;
		}
	}
	return _arr;
}
function _arrayWithHoles$1(arr) {
	if (Array.isArray(arr)) return arr;
}
var accepts = typeof import_es.default === "function" ? import_es.default : import_es.default.default;
var FILE_INVALID_TYPE = "file-invalid-type";
var FILE_TOO_LARGE = "file-too-large";
var FILE_TOO_SMALL = "file-too-small";
var TOO_MANY_FILES = "too-many-files";
/**
*
* @param {string} accept
*/
var getInvalidTypeRejectionErr = function getInvalidTypeRejectionErr() {
	var acceptArr = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "").split(",");
	var msg = acceptArr.length > 1 ? "one of ".concat(acceptArr.join(", ")) : acceptArr[0];
	return {
		code: FILE_INVALID_TYPE,
		message: "File type must be ".concat(msg)
	};
};
var getTooLargeRejectionErr = function getTooLargeRejectionErr(maxSize) {
	return {
		code: FILE_TOO_LARGE,
		message: "File is larger than ".concat(maxSize, " ").concat(maxSize === 1 ? "byte" : "bytes")
	};
};
var getTooSmallRejectionErr = function getTooSmallRejectionErr(minSize) {
	return {
		code: FILE_TOO_SMALL,
		message: "File is smaller than ".concat(minSize, " ").concat(minSize === 1 ? "byte" : "bytes")
	};
};
var TOO_MANY_FILES_REJECTION = {
	code: TOO_MANY_FILES,
	message: "Too many files"
};
/**
* Check if the given file is a DataTransferItem with an empty type.
*
* During drag events, browsers may return DataTransferItem objects instead of File objects.
* Some browsers (e.g., Chrome) return an empty MIME type for certain file types (like .md files)
* on DataTransferItem during drag events, even though the type is correctly set during drop.
*
* This function detects such cases by checking for:
* 1. Empty type string
* 2. Presence of getAsFile method (indicates it's a DataTransferItem, not a File)
*
* We accept these during drag to provide proper UI feedback, while maintaining
* strict validation during drop when real File objects are available.
*
* @param {File | DataTransferItem} file
* @returns {boolean}
*/
function isDataTransferItemWithEmptyType(file) {
	return file.type === "" && typeof file.getAsFile === "function";
}
/**
* Check if file is accepted.
*
* Firefox versions prior to 53 return a bogus MIME type for every file drag,
* so dragovers with that MIME type will always be accepted.
*
* Chrome/other browsers may return an empty MIME type for files during drag events,
* so we accept those as well (we'll validate properly on drop).
*
* @param {File} file
* @param {string} accept
* @returns
*/
function fileAccepted(file, accept) {
	var isAcceptable = file.type === "application/x-moz-file" || accepts(file, accept) || isDataTransferItemWithEmptyType(file);
	return [isAcceptable, isAcceptable ? null : getInvalidTypeRejectionErr(accept)];
}
function fileMatchSize(file, minSize, maxSize) {
	if (isDefined(file.size)) {
		if (isDefined(minSize) && isDefined(maxSize)) {
			if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
			if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
		} else if (isDefined(minSize) && file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
		else if (isDefined(maxSize) && file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
	}
	return [true, null];
}
function isDefined(value) {
	return value !== void 0 && value !== null;
}
/**
*
* @param {object} options
* @param {File[]} options.files
* @param {string} [options.accept]
* @param {number} [options.minSize]
* @param {number} [options.maxSize]
* @param {boolean} [options.multiple]
* @param {number} [options.maxFiles]
* @param {(f: File) => FileError|FileError[]|null} [options.validator]
* @returns
*/
function allFilesAccepted(_ref) {
	var files = _ref.files, accept = _ref.accept, minSize = _ref.minSize, maxSize = _ref.maxSize, multiple = _ref.multiple, maxFiles = _ref.maxFiles, validator = _ref.validator;
	if (!multiple && files.length > 1 || multiple && maxFiles >= 1 && files.length > maxFiles) return false;
	return files.every(function(file) {
		var accepted = _slicedToArray$1(fileAccepted(file, accept), 1)[0];
		var sizeMatch = _slicedToArray$1(fileMatchSize(file, minSize, maxSize), 1)[0];
		var customErrors = validator ? validator(file) : null;
		return accepted && sizeMatch && !customErrors;
	});
}
function isPropagationStopped(event) {
	if (typeof event.isPropagationStopped === "function") return event.isPropagationStopped();
	else if (typeof event.cancelBubble !== "undefined") return event.cancelBubble;
	return false;
}
function isEvtWithFiles(event) {
	if (!event.dataTransfer) return !!event.target && !!event.target.files;
	return Array.prototype.some.call(event.dataTransfer.types, function(type) {
		return type === "Files" || type === "application/x-moz-file";
	});
}
function onDocumentDragOver(event) {
	event.preventDefault();
}
function isIe(userAgent) {
	return userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1;
}
function isEdge(userAgent) {
	return userAgent.indexOf("Edge/") !== -1;
}
function isIeOrEdge() {
	var userAgent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : window.navigator.userAgent;
	return isIe(userAgent) || isEdge(userAgent);
}
/**
* This is intended to be used to compose event handlers
* They are executed in order until one of them calls `event.isPropagationStopped()`.
* Note that the check is done on the first invoke too,
* meaning that if propagation was stopped before invoking the fns,
* no handlers will be executed.
*
* @param {Function} fns the event hanlder functions
* @return {Function} the event handler to add to an element
*/
function composeEventHandlers() {
	for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) fns[_key] = arguments[_key];
	return function(event) {
		for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
		return fns.some(function(fn) {
			if (!isPropagationStopped(event) && fn) fn.apply(void 0, [event].concat(args));
			return isPropagationStopped(event);
		});
	};
}
/**
* canUseFileSystemAccessAPI checks if the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
* is supported by the browser.
* @returns {boolean}
*/
function canUseFileSystemAccessAPI() {
	return "showOpenFilePicker" in window;
}
/**
* Convert the `{accept}` dropzone prop to the
* `{types}` option for https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker
*
* @param {AcceptProp} accept
* @returns {{accept: string[]}[]}
*/
function pickerOptionsFromAccept(accept) {
	if (isDefined(accept)) return [{
		description: "Files",
		accept: Object.entries(accept).filter(function(_ref2) {
			var _ref3 = _slicedToArray$1(_ref2, 2), mimeType = _ref3[0], ext = _ref3[1];
			var ok = true;
			if (!isMIMEType(mimeType)) {
				console.warn("Skipped \"".concat(mimeType, "\" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types."));
				ok = false;
			}
			if (!Array.isArray(ext) || !ext.every(isExt)) {
				console.warn("Skipped \"".concat(mimeType, "\" because an invalid file extension was provided."));
				ok = false;
			}
			return ok;
		}).reduce(function(agg, _ref4) {
			var _ref5 = _slicedToArray$1(_ref4, 2), mimeType = _ref5[0], ext = _ref5[1];
			return _objectSpread$1(_objectSpread$1({}, agg), {}, _defineProperty$1({}, mimeType, ext));
		}, {})
	}];
	return accept;
}
/**
* Convert the `{accept}` dropzone prop to an array of MIME types/extensions.
* @param {AcceptProp} accept
* @returns {string}
*/
function acceptPropAsAcceptAttr(accept) {
	if (isDefined(accept)) return Object.entries(accept).reduce(function(a, _ref6) {
		var _ref7 = _slicedToArray$1(_ref6, 2), mimeType = _ref7[0], ext = _ref7[1];
		return [].concat(_toConsumableArray$1(a), [mimeType], _toConsumableArray$1(ext));
	}, []).filter(function(v) {
		return isMIMEType(v) || isExt(v);
	}).join(",");
}
/**
* Check if v is an exception caused by aborting a request (e.g window.showOpenFilePicker()).
*
* See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
* @param {any} v
* @returns {boolean} True if v is an abort exception.
*/
function isAbort(v) {
	return v instanceof DOMException && (v.name === "AbortError" || v.code === v.ABORT_ERR);
}
/**
* Check if v is a security error.
*
* See https://developer.mozilla.org/en-US/docs/Web/API/DOMException.
* @param {any} v
* @returns {boolean} True if v is a security error.
*/
function isSecurityError(v) {
	return v instanceof DOMException && (v.name === "SecurityError" || v.code === v.SECURITY_ERR);
}
/**
* Check if v is a MIME type string.
*
* See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
*
* @param {string} v
*/
function isMIMEType(v) {
	return v === "audio/*" || v === "video/*" || v === "image/*" || v === "text/*" || v === "application/*" || /\w+\/[-+.\w]+/g.test(v);
}
/**
* Check if v is a file extension.
* @param {string} v
*/
function isExt(v) {
	return /^.*\.[\w]+$/.test(v);
}
/**
* @typedef {Object.<string, string[]>} AcceptProp
*/
/**
* @typedef {object} FileError
* @property {string} message
* @property {ErrorCode|string} code
*/
/**
* @typedef {"file-invalid-type"|"file-too-large"|"file-too-small"|"too-many-files"} ErrorCode
*/
//#endregion
//#region node_modules/react-dropzone/dist/es/index.js
var _excluded = ["children"];
var _excluded2 = ["open"];
var _excluded3 = [
	"refKey",
	"role",
	"onKeyDown",
	"onFocus",
	"onBlur",
	"onClick",
	"onDragEnter",
	"onDragOver",
	"onDragLeave",
	"onDrop"
];
var _excluded4 = [
	"refKey",
	"onChange",
	"onClick"
];
function _toConsumableArray(arr) {
	return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit(arr, i) {
	var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
	if (_i == null) return;
	var _arr = [];
	var _n = true;
	var _d = false;
	var _s, _e;
	try {
		for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
			_arr.push(_s.value);
			if (i && _arr.length === i) break;
		}
	} catch (err) {
		_d = true;
		_e = err;
	} finally {
		try {
			if (!_n && _i["return"] != null) _i["return"]();
		} finally {
			if (_d) throw _e;
		}
	}
	return _arr;
}
function _arrayWithHoles(arr) {
	if (Array.isArray(arr)) return arr;
}
function ownKeys(object, enumerableOnly) {
	var keys = Object.keys(object);
	if (Object.getOwnPropertySymbols) {
		var symbols = Object.getOwnPropertySymbols(object);
		enumerableOnly && (symbols = symbols.filter(function(sym) {
			return Object.getOwnPropertyDescriptor(object, sym).enumerable;
		})), keys.push.apply(keys, symbols);
	}
	return keys;
}
function _objectSpread(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = null != arguments[i] ? arguments[i] : {};
		i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
			_defineProperty(target, key, source[key]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
			Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
		});
	}
	return target;
}
function _defineProperty(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _objectWithoutProperties(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i = 0;
	for (; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
/**
* Convenience wrapper component for the `useDropzone` hook
*
* ```jsx
* <Dropzone>
*   {({getRootProps, getInputProps}) => (
*     <div {...getRootProps()}>
*       <input {...getInputProps()} />
*       <p>Drag 'n' drop some files here, or click to select files</p>
*     </div>
*   )}
* </Dropzone>
* ```
*/
var Dropzone = /*#__PURE__*/ (0, import_react.forwardRef)(function(_ref, ref) {
	var children = _ref.children;
	var _useDropzone = useDropzone(_objectWithoutProperties(_ref, _excluded)), open = _useDropzone.open, props = _objectWithoutProperties(_useDropzone, _excluded2);
	(0, import_react.useImperativeHandle)(ref, function() {
		return { open };
	}, [open]);
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, children(_objectSpread(_objectSpread({}, props), {}, { open })));
});
Dropzone.displayName = "Dropzone";
var defaultProps = {
	disabled: false,
	getFilesFromEvent: fromEvent,
	maxSize: Infinity,
	minSize: 0,
	multiple: true,
	maxFiles: 0,
	preventDropOnDocument: true,
	noClick: false,
	noKeyboard: false,
	noDrag: false,
	noDragEventsBubbling: false,
	validator: null,
	useFsAccessApi: false,
	autoFocus: false
};
Dropzone.defaultProps = defaultProps;
Dropzone.propTypes = {
	/**
	* Render function that exposes the dropzone state and prop getter fns
	*
	* @param {object} params
	* @param {Function} params.getRootProps Returns the props you should apply to the root drop container you render
	* @param {Function} params.getInputProps Returns the props you should apply to hidden file input you render
	* @param {Function} params.open Open the native file selection dialog
	* @param {boolean} params.isFocused Dropzone area is in focus
	* @param {boolean} params.isFileDialogActive File dialog is opened
	* @param {boolean} params.isDragActive Active drag is in progress
	* @param {boolean} params.isDragAccept Dragged files are accepted
	* @param {boolean} params.isDragReject True only during an active drag when some dragged files would be rejected. After drop, this resets to false. Use fileRejections for post-drop errors.
	* @param {boolean} params.isDragGlobal Files are being dragged anywhere on the document
	* @param {File[]} params.acceptedFiles Accepted files
	* @param {FileRejection[]} params.fileRejections Rejected files and why they were rejected. This persists after drop and is the source of truth for post-drop rejections.
	*/
	children: import_prop_types.default.func,
	/**
	* Set accepted file types.
	* Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
	* Keep in mind that mime type determination is not reliable across platforms. CSV files,
	* for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
	* Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
	*/
	accept: import_prop_types.default.objectOf(import_prop_types.default.arrayOf(import_prop_types.default.string)),
	/**
	* Allow drag 'n' drop (or selection from the file dialog) of multiple files
	*/
	multiple: import_prop_types.default.bool,
	/**
	* If false, allow dropped items to take over the current browser window
	*/
	preventDropOnDocument: import_prop_types.default.bool,
	/**
	* If true, disables click to open the native file selection dialog
	*/
	noClick: import_prop_types.default.bool,
	/**
	* If true, disables SPACE/ENTER to open the native file selection dialog.
	* Note that it also stops tracking the focus state.
	*/
	noKeyboard: import_prop_types.default.bool,
	/**
	* If true, disables drag 'n' drop
	*/
	noDrag: import_prop_types.default.bool,
	/**
	* If true, stops drag event propagation to parents
	*/
	noDragEventsBubbling: import_prop_types.default.bool,
	/**
	* Minimum file size (in bytes)
	*/
	minSize: import_prop_types.default.number,
	/**
	* Maximum file size (in bytes)
	*/
	maxSize: import_prop_types.default.number,
	/**
	* Maximum accepted number of files
	* The default value is 0 which means there is no limitation to how many files are accepted.
	*/
	maxFiles: import_prop_types.default.number,
	/**
	* Enable/disable the dropzone
	*/
	disabled: import_prop_types.default.bool,
	/**
	* Use this to provide a custom file aggregator
	*
	* @param {(DragEvent|Event|Array<FileSystemFileHandle>)} event A drag event or input change event (if files were selected via the file dialog)
	*/
	getFilesFromEvent: import_prop_types.default.func,
	/**
	* Cb for when closing the file dialog with no selection
	*/
	onFileDialogCancel: import_prop_types.default.func,
	/**
	* Cb for when opening the file dialog
	*/
	onFileDialogOpen: import_prop_types.default.func,
	/**
	* Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
	* to open the file picker instead of using an `<input type="file">` click event.
	*/
	useFsAccessApi: import_prop_types.default.bool,
	/**
	* Set to true to focus the root element on render
	*/
	autoFocus: import_prop_types.default.bool,
	/**
	* Cb for when the `dragenter` event occurs.
	*
	* @param {DragEvent} event
	*/
	onDragEnter: import_prop_types.default.func,
	/**
	* Cb for when the `dragleave` event occurs
	*
	* @param {DragEvent} event
	*/
	onDragLeave: import_prop_types.default.func,
	/**
	* Cb for when the `dragover` event occurs
	*
	* @param {DragEvent} event
	*/
	onDragOver: import_prop_types.default.func,
	/**
	* Cb for when the `drop` event occurs.
	* Note that this callback is invoked after the `getFilesFromEvent` callback is done.
	*
	* Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
	* `accept` must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension.
	* If `multiple` is set to false and additional files are dropped,
	* all files besides the first will be rejected.
	* Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
	*
	* Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
	* If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
	*
	* `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
	* For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
	*
	* ```js
	* function onDrop(acceptedFiles) {
	*   const req = request.post('/upload')
	*   acceptedFiles.forEach(file => {
	*     req.attach(file.name, file)
	*   })
	*   req.end(callback)
	* }
	* ```
	*
	* @param {File[]} acceptedFiles
	* @param {FileRejection[]} fileRejections
	* @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
	*/
	onDrop: import_prop_types.default.func,
	/**
	* Cb for when the `drop` event occurs.
	* Note that if no files are accepted, this callback is not invoked.
	*
	* @param {File[]} files
	* @param {(DragEvent|Event)} event
	*/
	onDropAccepted: import_prop_types.default.func,
	/**
	* Cb for when the `drop` event occurs.
	* Note that if no files are rejected, this callback is not invoked.
	*
	* @param {FileRejection[]} fileRejections
	* @param {(DragEvent|Event)} event
	*/
	onDropRejected: import_prop_types.default.func,
	/**
	* Cb for when there's some error from any of the promises.
	*
	* @param {Error} error
	*/
	onError: import_prop_types.default.func,
	/**
	* Custom validation function. It must return null if there's no errors.
	* @param {File} file
	* @returns {FileError|FileError[]|null}
	*/
	validator: import_prop_types.default.func
};
/**
* A function that is invoked for the `dragenter`,
* `dragover` and `dragleave` events.
* It is not invoked if the items are not files (such as link, text, etc.).
*
* @callback dragCb
* @param {DragEvent} event
*/
/**
* A function that is invoked for the `drop` or input change event.
* It is not invoked if the items are not files (such as link, text, etc.).
*
* @callback dropCb
* @param {File[]} acceptedFiles List of accepted files
* @param {FileRejection[]} fileRejections List of rejected files and why they were rejected. This is the authoritative source for post-drop file rejections.
* @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
*/
/**
* A function that is invoked for the `drop` or input change event.
* It is not invoked if the items are files (such as link, text, etc.).
*
* @callback dropAcceptedCb
* @param {File[]} files List of accepted files that meet the given criteria
* (`accept`, `multiple`, `minSize`, `maxSize`)
* @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
*/
/**
* A function that is invoked for the `drop` or input change event.
*
* @callback dropRejectedCb
* @param {File[]} files List of rejected files that do not meet the given criteria
* (`accept`, `multiple`, `minSize`, `maxSize`)
* @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
*/
/**
* A function that is used aggregate files,
* in a asynchronous fashion, from drag or input change events.
*
* @callback getFilesFromEvent
* @param {(DragEvent|Event|Array<FileSystemFileHandle>)} event A drag event or input change event (if files were selected via the file dialog)
* @returns {(File[]|Promise<File[]>)}
*/
/**
* An object with the current dropzone state.
*
* @typedef {object} DropzoneState
* @property {boolean} isFocused Dropzone area is in focus
* @property {boolean} isFileDialogActive File dialog is opened
* @property {boolean} isDragActive Active drag is in progress
* @property {boolean} isDragAccept Dragged files are accepted
* @property {boolean} isDragReject True only during an active drag when some dragged files would be rejected. After drop, this resets to false. Use fileRejections for post-drop errors.
* @property {boolean} isDragGlobal Files are being dragged anywhere on the document
* @property {File[]} acceptedFiles Accepted files
* @property {FileRejection[]} fileRejections Rejected files and why they were rejected. This persists after drop and is the source of truth for post-drop rejections.
*/
/**
* An object with the dropzone methods.
*
* @typedef {object} DropzoneMethods
* @property {Function} getRootProps Returns the props you should apply to the root drop container you render
* @property {Function} getInputProps Returns the props you should apply to hidden file input you render
* @property {Function} open Open the native file selection dialog
*/
var initialState = {
	isFocused: false,
	isFileDialogActive: false,
	isDragActive: false,
	isDragAccept: false,
	isDragReject: false,
	isDragGlobal: false,
	acceptedFiles: [],
	fileRejections: []
};
/**
* A React hook that creates a drag 'n' drop area.
*
* ```jsx
* function MyDropzone(props) {
*   const {getRootProps, getInputProps} = useDropzone({
*     onDrop: acceptedFiles => {
*       // do something with the File objects, e.g. upload to some server
*     }
*   });
*   return (
*     <div {...getRootProps()}>
*       <input {...getInputProps()} />
*       <p>Drag and drop some files here, or click to select files</p>
*     </div>
*   )
* }
* ```
*
* @function useDropzone
*
* @param {object} props
* @param {import("./utils").AcceptProp} [props.accept] Set accepted file types.
* Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
* Keep in mind that mime type determination is not reliable across platforms. CSV files,
* for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
* Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
* @param {boolean} [props.multiple=true] Allow drag 'n' drop (or selection from the file dialog) of multiple files
* @param {boolean} [props.preventDropOnDocument=true] If false, allow dropped items to take over the current browser window
* @param {boolean} [props.noClick=false] If true, disables click to open the native file selection dialog
* @param {boolean} [props.noKeyboard=false] If true, disables SPACE/ENTER to open the native file selection dialog.
* Note that it also stops tracking the focus state.
* @param {boolean} [props.noDrag=false] If true, disables drag 'n' drop
* @param {boolean} [props.noDragEventsBubbling=false] If true, stops drag event propagation to parents
* @param {number} [props.minSize=0] Minimum file size (in bytes)
* @param {number} [props.maxSize=Infinity] Maximum file size (in bytes)
* @param {boolean} [props.disabled=false] Enable/disable the dropzone
* @param {getFilesFromEvent} [props.getFilesFromEvent] Use this to provide a custom file aggregator
* @param {Function} [props.onFileDialogCancel] Cb for when closing the file dialog with no selection
* @param {boolean} [props.useFsAccessApi] Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
* to open the file picker instead of using an `<input type="file">` click event.
* @param {boolean} autoFocus Set to true to auto focus the root element.
* @param {Function} [props.onFileDialogOpen] Cb for when opening the file dialog
* @param {dragCb} [props.onDragEnter] Cb for when the `dragenter` event occurs.
* @param {dragCb} [props.onDragLeave] Cb for when the `dragleave` event occurs
* @param {dragCb} [props.onDragOver] Cb for when the `dragover` event occurs
* @param {dropCb} [props.onDrop] Cb for when the `drop` event occurs.
* Note that this callback is invoked after the `getFilesFromEvent` callback is done.
*
* Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
* `accept` must be an object with keys as a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) and the value an array of file extensions (optional).
* If `multiple` is set to false and additional files are dropped,
* all files besides the first will be rejected.
* Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
*
* Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
* If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
*
* The second parameter (fileRejections) is the authoritative list of rejected files after a drop.
* Use this parameter or the fileRejections state property to handle post-drop file rejections,
* as isDragReject only indicates rejection state during active drag operations.
*
* `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
* For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
*
* ```js
* function onDrop(acceptedFiles) {
*   const req = request.post('/upload')
*   acceptedFiles.forEach(file => {
*     req.attach(file.name, file)
*   })
*   req.end(callback)
* }
* ```
* @param {dropAcceptedCb} [props.onDropAccepted]
* @param {dropRejectedCb} [props.onDropRejected]
* @param {(error: Error) => void} [props.onError]
*
* @returns {DropzoneState & DropzoneMethods}
*/
function useDropzone() {
	var props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	var _defaultProps$props = _objectSpread(_objectSpread({}, defaultProps), props), accept = _defaultProps$props.accept, disabled = _defaultProps$props.disabled, getFilesFromEvent = _defaultProps$props.getFilesFromEvent, maxSize = _defaultProps$props.maxSize, minSize = _defaultProps$props.minSize, multiple = _defaultProps$props.multiple, maxFiles = _defaultProps$props.maxFiles, onDragEnter = _defaultProps$props.onDragEnter, onDragLeave = _defaultProps$props.onDragLeave, onDragOver = _defaultProps$props.onDragOver, onDrop = _defaultProps$props.onDrop, onDropAccepted = _defaultProps$props.onDropAccepted, onDropRejected = _defaultProps$props.onDropRejected, onFileDialogCancel = _defaultProps$props.onFileDialogCancel, onFileDialogOpen = _defaultProps$props.onFileDialogOpen, useFsAccessApi = _defaultProps$props.useFsAccessApi, autoFocus = _defaultProps$props.autoFocus, preventDropOnDocument = _defaultProps$props.preventDropOnDocument, noClick = _defaultProps$props.noClick, noKeyboard = _defaultProps$props.noKeyboard, noDrag = _defaultProps$props.noDrag, noDragEventsBubbling = _defaultProps$props.noDragEventsBubbling, onError = _defaultProps$props.onError, validator = _defaultProps$props.validator;
	var acceptAttr = (0, import_react.useMemo)(function() {
		return acceptPropAsAcceptAttr(accept);
	}, [accept]);
	var pickerTypes = (0, import_react.useMemo)(function() {
		return pickerOptionsFromAccept(accept);
	}, [accept]);
	var onFileDialogOpenCb = (0, import_react.useMemo)(function() {
		return typeof onFileDialogOpen === "function" ? onFileDialogOpen : noop;
	}, [onFileDialogOpen]);
	var onFileDialogCancelCb = (0, import_react.useMemo)(function() {
		return typeof onFileDialogCancel === "function" ? onFileDialogCancel : noop;
	}, [onFileDialogCancel]);
	/**
	* @constant
	* @type {React.MutableRefObject<HTMLElement>}
	*/
	var rootRef = (0, import_react.useRef)(null);
	var inputRef = (0, import_react.useRef)(null);
	var _useReducer2 = _slicedToArray((0, import_react.useReducer)(reducer, initialState), 2), state = _useReducer2[0], dispatch = _useReducer2[1];
	var isFocused = state.isFocused, isFileDialogActive = state.isFileDialogActive;
	var fsAccessApiWorksRef = (0, import_react.useRef)(typeof window !== "undefined" && window.isSecureContext && useFsAccessApi && canUseFileSystemAccessAPI());
	var onWindowFocus = function onWindowFocus() {
		if (!fsAccessApiWorksRef.current && isFileDialogActive) setTimeout(function() {
			if (inputRef.current) {
				if (!inputRef.current.files.length) {
					dispatch({ type: "closeDialog" });
					onFileDialogCancelCb();
				}
			}
		}, 300);
	};
	(0, import_react.useEffect)(function() {
		window.addEventListener("focus", onWindowFocus, false);
		return function() {
			window.removeEventListener("focus", onWindowFocus, false);
		};
	}, [
		inputRef,
		isFileDialogActive,
		onFileDialogCancelCb,
		fsAccessApiWorksRef
	]);
	var dragTargetsRef = (0, import_react.useRef)([]);
	var globalDragTargetsRef = (0, import_react.useRef)([]);
	var onDocumentDrop = function onDocumentDrop(event) {
		if (rootRef.current && rootRef.current.contains(event.target)) return;
		event.preventDefault();
		dragTargetsRef.current = [];
	};
	(0, import_react.useEffect)(function() {
		if (preventDropOnDocument) {
			document.addEventListener("dragover", onDocumentDragOver, false);
			document.addEventListener("drop", onDocumentDrop, false);
		}
		return function() {
			if (preventDropOnDocument) {
				document.removeEventListener("dragover", onDocumentDragOver);
				document.removeEventListener("drop", onDocumentDrop);
			}
		};
	}, [rootRef, preventDropOnDocument]);
	(0, import_react.useEffect)(function() {
		var onDocumentDragEnter = function onDocumentDragEnter(event) {
			globalDragTargetsRef.current = [].concat(_toConsumableArray(globalDragTargetsRef.current), [event.target]);
			if (isEvtWithFiles(event)) dispatch({
				isDragGlobal: true,
				type: "setDragGlobal"
			});
		};
		var onDocumentDragLeave = function onDocumentDragLeave(event) {
			globalDragTargetsRef.current = globalDragTargetsRef.current.filter(function(el) {
				return el !== event.target && el !== null;
			});
			if (globalDragTargetsRef.current.length > 0) return;
			dispatch({
				isDragGlobal: false,
				type: "setDragGlobal"
			});
		};
		var onDocumentDragEnd = function onDocumentDragEnd() {
			globalDragTargetsRef.current = [];
			dispatch({
				isDragGlobal: false,
				type: "setDragGlobal"
			});
		};
		var onDocumentDropGlobal = function onDocumentDropGlobal() {
			globalDragTargetsRef.current = [];
			dispatch({
				isDragGlobal: false,
				type: "setDragGlobal"
			});
		};
		document.addEventListener("dragenter", onDocumentDragEnter, false);
		document.addEventListener("dragleave", onDocumentDragLeave, false);
		document.addEventListener("dragend", onDocumentDragEnd, false);
		document.addEventListener("drop", onDocumentDropGlobal, false);
		return function() {
			document.removeEventListener("dragenter", onDocumentDragEnter);
			document.removeEventListener("dragleave", onDocumentDragLeave);
			document.removeEventListener("dragend", onDocumentDragEnd);
			document.removeEventListener("drop", onDocumentDropGlobal);
		};
	}, [rootRef]);
	(0, import_react.useEffect)(function() {
		if (!disabled && autoFocus && rootRef.current) rootRef.current.focus();
		return function() {};
	}, [
		rootRef,
		autoFocus,
		disabled
	]);
	var onErrCb = (0, import_react.useCallback)(function(e) {
		if (onError) onError(e);
		else console.error(e);
	}, [onError]);
	var onDragEnterCb = (0, import_react.useCallback)(function(event) {
		event.preventDefault();
		event.persist();
		stopPropagation(event);
		dragTargetsRef.current = [].concat(_toConsumableArray(dragTargetsRef.current), [event.target]);
		if (isEvtWithFiles(event)) Promise.resolve(getFilesFromEvent(event)).then(function(files) {
			if (isPropagationStopped(event) && !noDragEventsBubbling) return;
			var fileCount = files.length;
			var isDragAccept = fileCount > 0 && allFilesAccepted({
				files,
				accept: acceptAttr,
				minSize,
				maxSize,
				multiple,
				maxFiles,
				validator
			});
			dispatch({
				isDragAccept,
				isDragReject: fileCount > 0 && !isDragAccept,
				isDragActive: true,
				type: "setDraggedFiles"
			});
			if (onDragEnter) onDragEnter(event);
		}).catch(function(e) {
			return onErrCb(e);
		});
	}, [
		getFilesFromEvent,
		onDragEnter,
		onErrCb,
		noDragEventsBubbling,
		acceptAttr,
		minSize,
		maxSize,
		multiple,
		maxFiles,
		validator
	]);
	var onDragOverCb = (0, import_react.useCallback)(function(event) {
		event.preventDefault();
		event.persist();
		stopPropagation(event);
		var hasFiles = isEvtWithFiles(event);
		if (hasFiles && event.dataTransfer) try {
			event.dataTransfer.dropEffect = "copy";
		} catch (_unused) {}
		if (hasFiles && onDragOver) onDragOver(event);
		return false;
	}, [onDragOver, noDragEventsBubbling]);
	var onDragLeaveCb = (0, import_react.useCallback)(function(event) {
		event.preventDefault();
		event.persist();
		stopPropagation(event);
		var targets = dragTargetsRef.current.filter(function(target) {
			return rootRef.current && rootRef.current.contains(target);
		});
		var targetIdx = targets.indexOf(event.target);
		if (targetIdx !== -1) targets.splice(targetIdx, 1);
		dragTargetsRef.current = targets;
		if (targets.length > 0) return;
		dispatch({
			type: "setDraggedFiles",
			isDragActive: false,
			isDragAccept: false,
			isDragReject: false
		});
		if (isEvtWithFiles(event) && onDragLeave) onDragLeave(event);
	}, [
		rootRef,
		onDragLeave,
		noDragEventsBubbling
	]);
	var setFiles = (0, import_react.useCallback)(function(files, event) {
		var acceptedFiles = [];
		var fileRejections = [];
		files.forEach(function(file) {
			var _fileAccepted2 = _slicedToArray(fileAccepted(file, acceptAttr), 2), accepted = _fileAccepted2[0], acceptError = _fileAccepted2[1];
			var _fileMatchSize2 = _slicedToArray(fileMatchSize(file, minSize, maxSize), 2), sizeMatch = _fileMatchSize2[0], sizeError = _fileMatchSize2[1];
			var customErrors = validator ? validator(file) : null;
			if (accepted && sizeMatch && !customErrors) acceptedFiles.push(file);
			else {
				var errors = [acceptError, sizeError];
				if (customErrors) errors = errors.concat(customErrors);
				fileRejections.push({
					file,
					errors: errors.filter(function(e) {
						return e;
					})
				});
			}
		});
		if (!multiple && acceptedFiles.length > 1 || multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles) {
			acceptedFiles.forEach(function(file) {
				fileRejections.push({
					file,
					errors: [TOO_MANY_FILES_REJECTION]
				});
			});
			acceptedFiles.splice(0);
		}
		dispatch({
			acceptedFiles,
			fileRejections,
			type: "setFiles"
		});
		if (onDrop) onDrop(acceptedFiles, fileRejections, event);
		if (fileRejections.length > 0 && onDropRejected) onDropRejected(fileRejections, event);
		if (acceptedFiles.length > 0 && onDropAccepted) onDropAccepted(acceptedFiles, event);
	}, [
		dispatch,
		multiple,
		acceptAttr,
		minSize,
		maxSize,
		maxFiles,
		onDrop,
		onDropAccepted,
		onDropRejected,
		validator
	]);
	var onDropCb = (0, import_react.useCallback)(function(event) {
		event.preventDefault();
		event.persist();
		stopPropagation(event);
		dragTargetsRef.current = [];
		if (isEvtWithFiles(event)) Promise.resolve(getFilesFromEvent(event)).then(function(files) {
			if (isPropagationStopped(event) && !noDragEventsBubbling) return;
			setFiles(files, event);
		}).catch(function(e) {
			return onErrCb(e);
		});
		dispatch({ type: "reset" });
	}, [
		getFilesFromEvent,
		setFiles,
		onErrCb,
		noDragEventsBubbling
	]);
	var openFileDialog = (0, import_react.useCallback)(function() {
		if (fsAccessApiWorksRef.current) {
			dispatch({ type: "openDialog" });
			onFileDialogOpenCb();
			var opts = {
				multiple,
				types: pickerTypes
			};
			window.showOpenFilePicker(opts).then(function(handles) {
				return getFilesFromEvent(handles);
			}).then(function(files) {
				setFiles(files, null);
				dispatch({ type: "closeDialog" });
			}).catch(function(e) {
				if (isAbort(e)) {
					onFileDialogCancelCb(e);
					dispatch({ type: "closeDialog" });
				} else if (isSecurityError(e)) {
					fsAccessApiWorksRef.current = false;
					if (inputRef.current) {
						inputRef.current.value = null;
						inputRef.current.click();
					} else onErrCb(/* @__PURE__ */ new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."));
				} else onErrCb(e);
			});
			return;
		}
		if (inputRef.current) {
			dispatch({ type: "openDialog" });
			onFileDialogOpenCb();
			inputRef.current.value = null;
			inputRef.current.click();
		}
	}, [
		dispatch,
		onFileDialogOpenCb,
		onFileDialogCancelCb,
		useFsAccessApi,
		setFiles,
		onErrCb,
		pickerTypes,
		multiple
	]);
	var onKeyDownCb = (0, import_react.useCallback)(function(event) {
		if (!rootRef.current || !rootRef.current.isEqualNode(event.target)) return;
		if (event.key === " " || event.key === "Enter" || event.keyCode === 32 || event.keyCode === 13) {
			event.preventDefault();
			openFileDialog();
		}
	}, [rootRef, openFileDialog]);
	var onFocusCb = (0, import_react.useCallback)(function() {
		dispatch({ type: "focus" });
	}, []);
	var onBlurCb = (0, import_react.useCallback)(function() {
		dispatch({ type: "blur" });
	}, []);
	var onClickCb = (0, import_react.useCallback)(function() {
		if (noClick) return;
		if (isIeOrEdge()) setTimeout(openFileDialog, 0);
		else openFileDialog();
	}, [noClick, openFileDialog]);
	var composeHandler = function composeHandler(fn) {
		return disabled ? null : fn;
	};
	var composeKeyboardHandler = function composeKeyboardHandler(fn) {
		return noKeyboard ? null : composeHandler(fn);
	};
	var composeDragHandler = function composeDragHandler(fn) {
		return noDrag ? null : composeHandler(fn);
	};
	var stopPropagation = function stopPropagation(event) {
		if (noDragEventsBubbling) event.stopPropagation();
	};
	var getRootProps = (0, import_react.useMemo)(function() {
		return function() {
			var _ref2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref2$refKey = _ref2.refKey, refKey = _ref2$refKey === void 0 ? "ref" : _ref2$refKey, role = _ref2.role, onKeyDown = _ref2.onKeyDown, onFocus = _ref2.onFocus, onBlur = _ref2.onBlur, onClick = _ref2.onClick, onDragEnter = _ref2.onDragEnter, onDragOver = _ref2.onDragOver, onDragLeave = _ref2.onDragLeave, onDrop = _ref2.onDrop, rest = _objectWithoutProperties(_ref2, _excluded3);
			return _objectSpread(_objectSpread(_defineProperty({
				onKeyDown: composeKeyboardHandler(composeEventHandlers(onKeyDown, onKeyDownCb)),
				onFocus: composeKeyboardHandler(composeEventHandlers(onFocus, onFocusCb)),
				onBlur: composeKeyboardHandler(composeEventHandlers(onBlur, onBlurCb)),
				onClick: composeHandler(composeEventHandlers(onClick, onClickCb)),
				onDragEnter: composeDragHandler(composeEventHandlers(onDragEnter, onDragEnterCb)),
				onDragOver: composeDragHandler(composeEventHandlers(onDragOver, onDragOverCb)),
				onDragLeave: composeDragHandler(composeEventHandlers(onDragLeave, onDragLeaveCb)),
				onDrop: composeDragHandler(composeEventHandlers(onDrop, onDropCb)),
				role: typeof role === "string" && role !== "" ? role : "presentation"
			}, refKey, rootRef), !disabled && !noKeyboard ? { tabIndex: 0 } : {}), rest);
		};
	}, [
		rootRef,
		onKeyDownCb,
		onFocusCb,
		onBlurCb,
		onClickCb,
		onDragEnterCb,
		onDragOverCb,
		onDragLeaveCb,
		onDropCb,
		noKeyboard,
		noDrag,
		disabled
	]);
	var onInputElementClick = (0, import_react.useCallback)(function(event) {
		event.stopPropagation();
	}, []);
	var getInputProps = (0, import_react.useMemo)(function() {
		return function() {
			var _ref3 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref3$refKey = _ref3.refKey, refKey = _ref3$refKey === void 0 ? "ref" : _ref3$refKey, onChange = _ref3.onChange, onClick = _ref3.onClick, rest = _objectWithoutProperties(_ref3, _excluded4);
			return _objectSpread(_objectSpread({}, _defineProperty({
				accept: acceptAttr,
				multiple,
				type: "file",
				style: {
					border: 0,
					clip: "rect(0, 0, 0, 0)",
					clipPath: "inset(50%)",
					height: "1px",
					margin: "0 -1px -1px 0",
					overflow: "hidden",
					padding: 0,
					position: "absolute",
					width: "1px",
					whiteSpace: "nowrap"
				},
				onChange: composeHandler(composeEventHandlers(onChange, onDropCb)),
				onClick: composeHandler(composeEventHandlers(onClick, onInputElementClick)),
				tabIndex: -1
			}, refKey, inputRef)), rest);
		};
	}, [
		inputRef,
		accept,
		multiple,
		onDropCb,
		disabled
	]);
	return _objectSpread(_objectSpread({}, state), {}, {
		isFocused: isFocused && !disabled,
		getRootProps,
		getInputProps,
		rootRef,
		inputRef,
		open: composeHandler(openFileDialog)
	});
}
/**
* @param {DropzoneState} state
* @param {{type: string} & DropzoneState} action
* @returns {DropzoneState}
*/
function reducer(state, action) {
	/* istanbul ignore next */
	switch (action.type) {
		case "focus": return _objectSpread(_objectSpread({}, state), {}, { isFocused: true });
		case "blur": return _objectSpread(_objectSpread({}, state), {}, { isFocused: false });
		case "openDialog": return _objectSpread(_objectSpread({}, initialState), {}, { isFileDialogActive: true });
		case "closeDialog": return _objectSpread(_objectSpread({}, state), {}, { isFileDialogActive: false });
		case "setDraggedFiles": return _objectSpread(_objectSpread({}, state), {}, {
			isDragActive: action.isDragActive,
			isDragAccept: action.isDragAccept,
			isDragReject: action.isDragReject
		});
		case "setFiles": return _objectSpread(_objectSpread({}, state), {}, {
			acceptedFiles: action.acceptedFiles,
			fileRejections: action.fileRejections,
			isDragReject: false
		});
		case "setDragGlobal": return _objectSpread(_objectSpread({}, state), {}, { isDragGlobal: action.isDragGlobal });
		case "reset": return _objectSpread({}, initialState);
		default: return state;
	}
}
function noop() {}
//#endregion
export { useDropzone as t };
