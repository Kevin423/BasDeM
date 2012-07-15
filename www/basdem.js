var Controller = new function() {
    this.start = function() {
        this.authenticate();
    }

    this.authenticate = function() {
        // Todo: Do authentication and then proceed
        this.load(1234);
    }

    this.load = function(id) {
        // Todo: Load a specific id
            View.create();
    }
};

var View = new function() {
    this.container = null;
    this.headline = null;
    this.content = null;
    this.footer = null;

    this.create = function() {
        this.container = $("<div class=\"container\">");
        this.headline = $("<div class=\"headline\">").appendTo(this.container);
        this.content = $("<div class=\"content\">").appendTo(this.container);
        this.contentLeft = $("<div class=\"contentLeft\">").appendTo(this.container);
        this.contentRight = $("<div class=\"contentRight\">").appendTo(this.container);
        this.footer = $("<div class=\"footer\">").appendTo(this.container);
        this.container.appendTo("body");
        
        
    };
    
//    if(Layer = "1" || Layer = "2"){}
//    else if(Layer = "3"){}
//    else if(Layer = "4" || Layer = "5" || Layer = "6"){}
//    else if(Layer = "7"){}

    this.clear = function() {
        document.body.removeChild(this.container);
    };

//	private this.block() {
//		Window.block();
//	};
    
    this.destroy = function() {
    };
};

//var ViewList = new function() {
//    TopicList.load();
//    TopicList.populate();
//};

var ViewSolution = new function() {
};

var ViewComment =new function() {
};

var TopicList = new function() {
    this.load = function() {
        this.content = [{"id":1,"title":"Testtitel","text":"Blafasel blubb.","author":"Niemand","children":[2,3,4]}];
    };
    
    this.populate = function() {
        for ( i in this.content ) {
            Topic.create(this.content[i]).appendTo(Window.content);
        };
        $("<br class=\"clear\">").appendTo(Window.content);
    };
};

var Topic = new function() {
    this.create = function(content) {
        tmp = $("<div class=\"topic\">" + "id:"+content.id+"-title:"+content.title+"-author:"+content.author + "</div>");
        return tmp;
    };
};