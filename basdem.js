var Window = new function() {
	this.container = null;
	this.headline = null;
	this.content = null;
	this.footer = null;

	this.create = function() {
		this.container = document.createElement("div");
		this.headline = document.createElement("div");
		this.content = document.createElement("div");
		this.footer = document.createElement("div");
		
		this.container.setAttribute("class","container");
		this.headline.setAttribute("class","headline");
		this.content.setAttribute("class","content");
		this.footer.setAttribute("class","footer");
		
		this.container.appendChild(this.headline);
		this.container.appendChild(this.content);
		this.container.appendChild(this.footer);
		
		document.body.appendChild(this.container);
	};
	
	this.destroy = function() {
		document.body.removeChild(this.container);
	};
};

var BasDeM = new function() {
	this.start = function() {
		Window.create();
		TopicList.load();
		TopicList.populate();
	}

};

var TopicList = new function() {
	this.load = function() {
		this.content = [{"id":1,"title":"Testtitel","text":"Blafasel blubb.","author":"Niemand","children":[2,3,4]}];
	}
	
	this.populate = function() {
		for ( i in this.content ) {
			Window.content.appendChild(Topic.create(this.content[i]));
		}
		var linebreak = document.createElement("br");
		linebreak.setAttribute("class","clear");
		Window.content.appendChild(linebreak);
	}

};

var Topic = new function() {
	this.create = function(content) {
		var tmp = document.createElement("div");
		tmp.setAttribute("class","topic");
		tmp.innerHTML = "id:"+content.id+"-title:"+content.title+"-author:"+content.author;
		return tmp;
	}

};