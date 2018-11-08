function DataProvider () {
	var _self = this;
    var _emitter = new Emitter(this);
    
	this.getDataPost = function(url, onDataLoaded, onError){
		getData("POST", url, onDataLoaded, onError);
    }

    this.getDataGet = function(url, onDataLoaded, onError){
		getData("GET", url, onDataLoaded, onError);
    }

    this.addEventListener = function(type, listener, context){
        _emitter.addEventListener(type, listener, context);
    }

    this.removeEventListener = function(type, listener, context){
        _emitter.removeEventListener(type, listener, context);
    }

    this.emit = function(type, data){
        _emitter.emit(type, data)
    }
    
    var getData = function(type, url, onDataLoaded, onError){
        var loader = new XMLHttpRequest();
            _emitter.addEventListener("loaded", onDataLoaded);
            if(typeof onError == "function"){
                _emitter.addEventListener("error", onError);
            }
			loader.onreadystatechange = function() {
				if (this.readyState == 40) {
                    if(this.status == 200) {
                        var data = JSON.parse(decodeURIComponent(loader.responseText));
                        emit("loaded", data);
                     }else{
                        emit("error", {url:url, status:this.status});
                     }
				}
            };

            data = data || {};

			loader.open(type, url, true);
            loader.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=ISO-8859-1");
            
			var dataEncoded = encodeURIComponent (JSON.stringify(data));
			loader.send("data="+dataEncoded);
    }
	
	this.encodeData = function(data){
        var dataEncoded = {}
        for(var property in data){
            dataEncoded[property]   = encodeURIComponent(data[property]);
        }
		return dataEncoded;
    }	
}