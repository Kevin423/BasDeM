var Window = new function() {
	this.container = null;
	this.headline = null;
	this.content = null;
	this.footer = null;

	this.create = function() {
		this.container = $("<div class=\"container\">");
		this.headline = $("<div class=\"headline\">").appendTo(this.container);
		this.content = $("<div class=\"content\">").appendTo(this.container);
		this.footer = $("<div class=\"footer\">").appendTo(this.container);
		
		this.container.appendTo("body");
	};
	
	this.destroy = function() {
		document.body.removeChild(this.container);
	};
};

var BasDeM = new function() {
	this.start = function() {
		BasDeM.authenticate();
	}
	
	this.authenticate = function() {
		// Todo: Do authentication and then proceed
		this.proceed();
	}
	
	this.proceed = function() {
		// Todo
		
	}
	
	this.load = function(id) {
		// Todo: Load a specific id
	}
};

var TopicList = new function() {
	this.load = function() {
		this.content = [{"id":1,"title":"Testtitel","text":"Blafasel blubb.","author":"Niemand","children":[2,3,4]}];
	}
	
	this.populate = function() {
		for ( i in this.content ) {
			Topic.create(this.content[i]).appendTo(Window.content);
		}
		$("<br class=\"clear\">").appendTo(Window.content);
	}

};

var Topic = new function() {
	this.create = function(content) {
		tmp = $("<div class=\"topic\">" + "id:"+content.id+"-title:"+content.title+"-author:"+content.author + "</div>");
		return tmp;
	}

};