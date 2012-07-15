var Controller = new function() {
    var activeTopNode = -1;
    
    this.start = function() {
        this.authenticate();
    }

    this.authenticate = function() {
        // Todo: Do authentication and then proceed
        this.load(1234);
    }

    this.load = function(id) {
        // Todo: Load a specific id
        View.create({"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":4,"children":[
            {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":5,"children":[]},
            {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":5,"children":[
                {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":8,"children":[]},
                {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":8,"children":[]},
                {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":8,"children":[]},
                {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":8,"children":[]},
                {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":8,"children":[]}
            ]},
            {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":6,"children":[]},
            {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":6,"children":[]},
            {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":7,"children":[]},
            {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":7,"children":[]},
            {"id":1,"author":"Ich halt","title":"Ich, ich und ich","text":"Wir sind alle toll!","layer":7,"children":[]}
        ]});
    }
};

var View = new function() {
    this.container = null;
    this.headline = null;
    this.content = null;
    this.footer = null;

    this.create = function(Memplex) {
        this.clear();
        
        this.container = $("<div class=\"container\">");
        this.headline = $("<div class=\"headline\">").appendTo(this.container);
        this.content = $("<div class=\"content\">").appendTo(this.container);
        this.footer = $("<div class=\"footer\">").appendTo(this.container);
        this.container.appendTo("body");
        
        switch ( Memplex.layer ) {
            
            case 2: /*Create Issue*/ break;
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
    
 

    this.clear = function() {
        if ( this.container != null ) {
            this.container.remove();
        }
    };

	this.block = function() {
		//TODO: block any other user input
	};
    
    this.destroy = function() {
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
        
        $("<span class=\"title\">" + Memplex.title + "</span>").appendTo(View.headline);
        $("<div class=\"solutionContent\">" + Memplex.text + "</div>").appendTo(this.contentLeft);
        
        for ( c in Memplex.children ) {
            var li = $("<li>");
            $("<a class=\"argumentlink\" onclick=\"Controller.loadMemplex(" + Memplex.children[c].id + ")\">" + Memplex.children[c].title + "</a>").appendTo(li);
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
        
        $("<span class=\"title\">" + Memplex.title + "</span>").appendTo(View.headline);
        $("<div class=\"content solutionContent\">" + Memplex.text + "</div>").appendTo(this.contentLeft);
        
    };
    
    this.loadComments = function(Memplex,parent) {
        var ul = $("<ul class=\"comment\">");
        var li = $("<li class=\"comment\">");
        
        $("<a class=\"argumentlink\" onclick=\"Controller.loadMemplex(" + Memplex.id + ")\">" + Memplex.title + "</a>").appendTo(li);
        
        for ( c in Memplex.children ) {
            this.loadComments(Memplex.children[c],li);
        }
        
        li.appendTo(ul);
        ul.appendTo(parent);
    };
};

var ViewList = new function() {
    this.create = function(Memplex) {
        $("<span class=\"title\">" + Memplex.title + "</span>").appendTo(View.headline);
        $("<div class=\"description\">" + Memplex.text + "</div>").appendTo(View.content);
        
        for ( c in Memplex.children ) {
            $("<a class=\"layer1link\" onclick=\"Controller.loadMemplex(" + Memplex.children[c].id + ")\">" + Memplex.children[c].title + "</a>").appendTo(View.content);
        };
        $("<br class=\"clear\">").appendTo(View.content);
    };
};

var CreateIssue = new function() {
    this.overlay = null;
    this.form = null;

    this.create = function() {
        this.overlay = $("<div class=\"overlay\">")
            .appendTo("body")
            .click(function(e) {
                if ( e.target.className == "overlay" ) {
                    CreateIssue.overlay.remove();
                }
        });
        this.form = $("<form>")
            .submit(function() {
                $.post("memplex.php", 
                    //{ name: this.form.}
                    function (data) {
                        console.log(data);
                });
            })
            .appendTo(this.overlay);
        
        $("<input name=\"author\" type=\"text\">").appendTo(this.form);
        $("<input name=\"title\" type=\"text\">").appendTo(this.form);
        $("<textarea name=\"description\" rows=\"20\" cols=\"50\">").appendTo(this.form);
        $("<input name=\"layer\" type=\"hidden\" value=\"3\">").appendTo(this.form);
        $("<input type=\"submit\" value=\"Create Issue\">").appendTo(this.form);
        
        
    }
    
    this.submit = function() {
        Controller.activeTopnode;
    }
}