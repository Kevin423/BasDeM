var Controller = new function() {
    this.activeTopNode = -1;
    this.blockingCallback = null;
    this.navigation = new Array(8);
    
    this.start = function() {
        this.authenticate();
    }

    this.authenticate = function() {
        // Todo: Do authentication and then proceed
        this.load(1);
    }

    this.load = function(id) {
        $.post("memplex.php",
            {id: id},
            function(data) {
                var json = $.parseJSON(data);
                var Memplex = json.data;
                Controller.loadMemplex(Memplex);
            });
    }
    
    this.loadMemplex = function(Memplex) {
        Controller.activeTopnode = Memplex.id;
        
        this.navigation[Memplex.layer - 1] = Memplex;
        View.create(Memplex);
    }
    
    this.submit = function(data,callback) {
        View.block();
        this.blockingCallback = callback;
        
        $.post("memplex.php", {
                "parent": Controller.activeTopnode,
                "layer": data.layer,
                "author": data.author,
                "title": data.title,
                "text": data.text
            },
            function (data) {
                var json = $.parseJSON(data);
                var Memplex = json.data;
                Controller.blockingCallback();
                Controller.loadMemplex(Memplex);
        });
    }
};

var View = new function() {
    this.container = null;
    this.headline = null;
    this.content = null;
    this.footer = null;
    this.overlay = null;

    this.create = function(Memplex) {
        this.clear();
        
        this.container = $("<div class=\"container\">");
        this.headline = $("<div class=\"headline\">").appendTo(this.container);
        this.content = $("<div class=\"content\">").appendTo(this.container);
        this.footer = $("<div class=\"footer\">").appendTo(this.container);
        this.container.appendTo("body");
        
        for ( i = 0 ; i < Memplex.layer ; i++ ) {
            $("<span class=\"title\"><a onclick=\"Controller.load(" + Controller.navigation[i].id + ")\"> &gt; " + Controller.navigation[i].title + "</a></span>").appendTo(View.headline);
        }
        if ( Memplex.layer - 2 >= 0 ) {
            $("<span class=\"title back\"><a onclick=\"Controller.load(" + Controller.navigation[Memplex.layer - 2].id + ")\">&lt;&lt; Back</a></span>").appendTo(View.headline);
        }
        
        switch ( Memplex.layer ) {
            case 1: break;
            case 2: 
                this.createButton("Create Issue", function() {
                    CreateIssue.create();
                });/*Create Issue*/ break;
            case 3: /*Create Solution*/ break;
            case 4: /*Create Argument*/ break;
            case 5: case 6: case 7: case 8: /*Create Comment*/ break;
        }
        
        switch ( Memplex.layer ) {
            case 1: case 2: case 3: ViewList.create(Memplex); break;
            case 4: ViewSolution.create(Memplex); break;
            case 5: case 6: case 7: case 8: ViewComment.create(Memplex); break;
        }
    };
    
    this.createButton = function(name, handler) {
        $("<button>" + name + "</button>").click(handler).appendTo(this.footer);
    }

    this.clear = function() {
        if ( this.container != null ) {
            this.container.remove();
        }
        if ( this.overlay != null ) {
            this.overlay.remove();
        }
    };

	this.block = function() {
        this.overlay = $("<div class=\"overlay\">")
            .appendTo("body");
	};
};

var ViewSolution = new function() {
    this.contentLeft = null;
    this.contentRight = null;
    this.argumentPro = null;
    this.argumentNeut = null;
    this.argumentCon = null;
    

    this.create = function(Memplex) {
        this.contentLeft = $("<div class=\"contentLeft\">").appendTo(View.content);
        this.contentRight = $("<div class=\"contentRight\">").appendTo(View.content);
        
        this.argumentPro = $("<ul class=\"argumentPro\">").appendTo(this.contentRight);
        this.argumentCon = $("<ul class=\"argumentCon\">").appendTo(this.contentRight);
        this.argumentNeut = $("<ul class=\"argumentNeut\">").appendTo(this.contentRight);
        
        $("<div class=\"solutionContent\">" + Memplex.text + "</div>").appendTo(this.contentLeft);
        
        for ( c in Memplex.children ) {
            var li = $("<li>");
            $("<a class=\"argumentlink\" onclick=\"Controller.load(" + Memplex.children[c].id + ")\">" + Memplex.children[c].title + "</a>").appendTo(li);
            switch ( Memplex.children[c].layer ) {
                case 5: li.appendTo(this.argumentPro); break;
                case 6: li.appendTo(this.argumentCon); break;
                case 7: li.appendTo(this.argumentNeut); break;
            }
        };
    };
};

var ViewComment =new function() {
    this.contentLeft = null;
    this.contentRight = null;
    this.commentUl = null;
    this.comment = null;

    this.create = function(Memplex) {
        this.contentLeft = $("<div class=\"contentLeft\">").appendTo(View.content);
        this.contentRight = $("<div class=\"contentRight\">").appendTo(View.content);
        
        if ( Memplex.layer <= 7 && Memplex.layer >= 5 ) {
            this.commentUl = $("<ul class=\"comment\">");
            this.loadComments(Memplex,this.commentUl);
        }
        this.commentUl.appendTo(this.contentRight);
        
        $("<div class=\"content solutionContent\">" + Memplex.text + "</div>").appendTo(this.contentLeft);
        
    };
    
    this.loadComments = function(Memplex,parent) {
        var ul = $("<ul class=\"comment\">");
        var li = $("<li class=\"comment\">");
        
        $("<a class=\"argumentlink\" onclick=\"Controller.load(" + Memplex.id + ")\">" + Memplex.title + "</a>").appendTo(li);
        
        for ( c in Memplex.children ) {
            this.loadComments(Memplex.children[c],li);
        }
        
        li.appendTo(ul);
        ul.appendTo(parent);
    };
};

var ViewList = new function() {
    this.create = function(Memplex) {
        $("<div class=\"description\">" + Memplex.text + "</div>").appendTo(View.content);
        
        for ( c in Memplex.children ) {
            $("<a class=\"layer1link\" onclick=\"Controller.load(" + Memplex.children[c].id + ")\">" + Memplex.children[c].title + "</a>").appendTo(View.content);
        };
        $("<br class=\"clear\">").appendTo(View.content);
    };
};

var CreateIssue = new function() {
    this.overlay = null;
    this.form = null;
    this.defaultLayer = 3;

    this.destroy = function() {
        CreateIssue.form.remove();
        CreateIssue.overlay.remove();
    }
    
    this.create = function() {
        this.overlay = $("<div class=\"overlay\">")
            .appendTo("body")
            .click(function(e) {
                if ( e.target.className == "overlay" ) {
                    CreateIssue.destroy();
                }
        });
        
        
        this.form = $("<div id=\"CreateIssue\" class=\"form\">").appendTo("body");

        $("<h3>Create Issue</h3>").appendTo(this.form);
        $("<input name=\"layer\" type=\"hidden\" value=\"" + CreateIssue.defaultLayer + "\">").appendTo(this.form);
        
        var table = $("<table>").appendTo(this.form);
        var tr = $("<tr>").appendTo(table);
        $("<td>Author</td>").appendTo(tr);
        $("<input name=\"author\" type=\"text\">").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>Title</td>").appendTo(tr);
        $("<input name=\"title\" type=\"text\">").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>Description</td>").appendTo(tr);
        $("<textarea name=\"description\" rows=\"20\" cols=\"50\">").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>&nbsp;</td>").appendTo(tr);
        $("<button>Create Issue</button>").click(this.submit).appendTo(tr);
    }
    
    this.submit = function() {
        Controller.submit(new function() {
            this.layer = $("#CreateIssue").find("input")[0].value;
            this.author = $("#CreateIssue").find("input")[1].value;
            this.title = $("#CreateIssue").find("input")[2].value;
            this.text = $("#CreateIssue").find("textarea")[0].value;
        },CreateIssue.destroy);
        return false;
    }
}