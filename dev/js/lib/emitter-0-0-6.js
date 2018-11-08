'use strict'

// ::: Emitter ::: //
function Emitter(target){

	Emitter.MOUSE_OVER   = "mouseOver";
	Emitter.MOUSE_OUT    = "mouseOut";
	Emitter.MOUSE_UP     = "mouseUp";
	Emitter.MOUSE_DOWN   = "mouseDown";
	Emitter.MOUSE_LEAVE  = "mouseLeave";
	Emitter.CLICK        = "click";
	Emitter.DROP         = "drop";
	Emitter.DRAG         = "drag";
	Emitter.DRAGING      = "draging";	
	Emitter.FUNCTION     = "function";
	Emitter.OBJECT       = "object";
	Emitter.ADD		     = "add";
	Emitter.REMOVE		 = "remove";
	Emitter.RENDER		 = "render";

	var _typeCounter   = 0;
	var _hasMouse      = false;
					   
	var CONTEXT        = 0;
	var LISTENER       = 1;
	var _target        = target;
	
	var _listenerTypes = {};
	var _listenerList;
	
	var listener;
	
	this.addEventListener = function(type, listener, context){
		if(null == type || type == "" || typeof listener !== Emitter.FUNCTION ){
			return;
		}
		_listenerList = _listenerTypes[type];
		if(null == _listenerList){
			_listenerList = _listenerTypes[type] = [];
		}
		
		var length = _listenerList.length;
		for(var index=0; index < length; index++){
			if(listener[LISTENER] == listener && 
			   listener[CONTEXT]  == context){
				return;
			}
		}
		_listenerTypes[type].push([context, listener]);
		switch(type){
			case Emitter.CLICK :
			case Emitter.MOUSE_OVER :
			case Emitter.MOUSE_OUT :
			case Emitter.MOUSE_DOWN :
			case Emitter.MOUSE_UP :
			case Emitter.MOUSE_LEAVE :
			case Emitter.DRAG :
			case Emitter.DROP :
			_typeCounter++;
			break;
		}
		
		_hasMouse = _typeCounter > 0;
		return _hasMouse;
	}
	
	this.removeEventListener = function(type, listenerToRemove, context){
		if(null == type || type == "" || typeof listenerToRemove !== Emitter.FUNCTION ){
			return;
		}
		
		_listenerList = _listenerTypes[type];
		if(null == _listenerList){
			return
		}
		
		var length = _listenerList.length;
		for(var index=0; index < length; index++){
			listener = _listenerList[index];
			
			if(listener[LISTENER] == listenerToRemove && 
			   listener[CONTEXT]  == context){
				_listenerTypes[type].splice(index, 1);
				switch(type){
					case Emitter.CLICK :
                    case Emitter.MOUSE_OVER :
                    case Emitter.MOUSE_OUT :
                    case Emitter.MOUSE_DOWN :
                    case Emitter.MOUSE_UP :
                    case Emitter.MOUSE_LEAVE :
                    case Emitter.DRAG :
                    case Emitter.DROP :
					_typeCounter--;
					break;
				}
				_typeCounter = Math.min(_typeCounter, 0);
				_hasMouse = _typeCounter > 0;
				return true;
			}
		}
	}
	
	this.emit = function(type, data){
		if(null == type || type == ""){
			return;
		}
		var _listenerList = _listenerTypes[type];
		if(undefined === _listenerList){
			return
		}
		data        = null == data || typeof data != Emitter.OBJECT ? {} : data;
		data.type   = type;
		data.target = _target;
		var length  = _listenerList.length;
		for(var index=0; index < length; index++){
			listener = _listenerList[index];
		listener[LISTENER].apply(listener[CONTEXT], [data]);
		}
	}
	
	this.hasMouse = function(){
		return _hasMouse;
	}

	Emitter.getKeyHandler = function(target){
		var KeyHandler = function(target){
			'use strict'
		
			var _self	     = this;
			var DOWN		 = "Down";
			var UP  		 = "Up";
			var ENIE         = "enie";
		
			var _userKeyList = {
								 up		: "ArrowUp"
								,down	: "ArrowDown"
								,left	: "ArrowLeft"
								,right	: "ArrowRight"
								,space	: "Space"
								,tab	: "Tab"
								,shift	:"ShiftLeft" // ShiftRight
								,alt	:"AltLeft" // AltRight
								,enter	:"Enter"
							}
			
			var _mapKeyList	= {};
			var _downKeyList = [];
			
			var _emitter;
			
			this.onDown = function(key, listener, context){
				key      = key.toLowerCase();
				var type = _userKeyList[key];
				if(null != type){
					_emitter.addEventListener(key+DOWN, listener, context);
				}
			}
		
			this.onUp = function(key, listener, context){
				key      = key.toLowerCase();
				var type = _userKeyList[key];
		
				if(null != type){
					_emitter.addEventListener(key+UP, listener, context);
				}
			}
		
			this.removeDown = function(key, listener, context){
				var type = _userKeyList[key];
		
				if(null != type){
					_emitter.removeEventListener(type+DOWN, listener, context);
				}
			}
		
			this.removeUp = function(key, listener, context){
				var type = _mapKeyList[key];
		
				if(null != type){
					_emitter.renoveEventListener(type+UP, listener, context);
				}
			}
		
			this.isDown = function(key){
				return _downKeyList.indexOf(key) > -1;
			}
		
			var onkeydown = function(event){
				emit(event.code, DOWN);
			}
		
			var onkeyup = function(event){
				emit(event.code, UP);
			}
		
			var emit = function(code, sufix){
				var key = _mapKeyList[code];
				if(null != key){
					key = key.toLowerCase() == "semicolon" ? "ñ" : key;
					var index = _downKeyList.indexOf(key);
		
					if(DOWN == sufix){
						if(index == -1){
							_downKeyList.push(key);
						}
					}else{
						if(index > -1){
							_downKeyList.splice(key, 1);
						}
					}
					_emitter.emit(key+sufix, key);
				}
			}
		
			var init = function(){
				var letterList = "Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Z,X,C,V,B,N,M".split(",");
				var length = letterList.length;
				var letter;
				for(var index=0; index < length; index++){
					letter = letterList[index];
					_userKeyList[letter.toLowerCase()] = "Key"+letter;
		
					if(index < 10){
						_userKeyList[index] = "Digit"+index;
					}
				}
		
				_userKeyList["semicolon"] = "Semicolon";
				var value;
				for(var userKey in _userKeyList){
					value = _userKeyList[userKey];
					_mapKeyList[value] = userKey;
				}
		
				_userKeyList.ShiftRight	= "shift";
				_userKeyList.AltRight	= "alt";
				
				_emitter = new Emitter(this);
		
				target.addEventListener("keydown", onkeydown);
				target.addEventListener("keyup", onkeyup);
			}
		
			init();
		}
	
		return new KeyHandler(target);
	}
}