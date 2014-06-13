// Remember that in sets, order is not relevant,
	// hence, Set.toArray method may return objects in an
	// order different than how they were placed.
	// The disregard for order however is how we're able to
	// achieve O(1) times for add and remove

	Set = function () {
		this.set = {};
		this.setArray = [];
	}

	Set.prototype = {

		// O(1)
		add: function (object) {
			var hash = this._uniqueHash(object);
			
			this.set[hash] = {
				object: object,
				count: 1,
				index: this.setArray.length,
			}

			this.setArray.push(hash);
		},

		// O(1)
		// Removes the last instance of an object
		remove: function (object) {
			var hash = this._baseHash(object);
			var wrapperObject = this.set[hash];

			if(wrapperObject){
				if(wrapperObject.count > 1){
					hash = hash + '&count=' +wrapperObject.count;
					wrapperObject.count--;
					wrapperObject = this.set[hash];
				}

				var movedObjectWrapper = this.set[this.setArray[this.setArray.length - 1]];
				
				movedObjectWrapper.index = wrapperObject.index;

				if(wrapperObject.index == this.setArray.length - 1){
					this.setArray.pop(); // Last object
				} else {
					this.setArray.splice(wrapperObject.index, 1, this.setArray.pop());	
				}

				delete this.set[hash];
				return true;
			} else {
				return false;
			}
		},

		// O(n) -- n is the number of instances
		// Removes all instances of an object
		removeAll: function (object) {
			while(this.remove(object) == true) {}
		},

		// O(n)
		iterate: function (fn) {
			var that = this;
			this.setArray.forEach(function(hash){
				fn(that.set[hash].object);
			});
		},

		// O(1)
		toArray: function () {
			var array = [];
			this.iterate(function (obj) {
				array.push(obj);
			});
			return array;
		},

		union: function (setB) {

		},

		intersection: function (setB) {

		},

		difference: function (setB) {

		},

		// O(n)
		isSubsetOf: function (setB) {
			var isSubset = true;
			var that = this;
			this.iterate(function (obj) {
				var hash = that._baseHash(obj);
				if(!setB.set[hash]){
					isSubset = false;
				}
			});
			return isSubset;
		},

		// O(n)
		isSupersetOf: function (setB) {
			return setB.isSubsetOf(this);
		},

		// Utility Methods

		_baseHash: function (object) {
			var hash;
			switch(typeof object){
				case 'string':
					hash = object.toString();
					break;
				case 'number':
					hash = object.toString();
					break;
				case 'undefined':
					hash = 'undefined';
					break;
				case 'function':
					hash = object.name + object.toString(); //Combine signature and source
					break;
				case 'boolean':
					hash = object.toString();
					break;
				case 'object':
					hash = 'object';
					try {
						hash = JSON.stringify(object);
					} catch (e) {
						// Still trying to figure out how to handle circular references...
						return this._circularHash(object);
					}
					
					return hash;

			}

			return hash;

		},

		_circularHash: function (object) {
			var circularObjects = [];
			var hash = '';

			for(prop in object){
				if(typeof object[prop] == 'object'){
					try {
						hash += JSON.stringify(object);
					} catch (e) {
						hash += '"' + prop + '":"circularObject"';	
					}
				} else {
					hash += '"' + prop + '":"' + this._baseHash(object[prop]) + '"';
				}	
			}

			return hash;

		},

		_uniqueHash: function (object) {
			var hash = this._baseHash(object);
			var objectWrapper = this.set[hash];
			
			if(objectWrapper){
				objectWrapper.count++;
				hash += '&count=' + objectWrapper.count;
			}
			return hash;
		}
	}
