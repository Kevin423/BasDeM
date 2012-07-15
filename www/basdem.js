var Helper = new function() {
    this.getLayerPosition = function(position) {
        if ( position > 4 && position < 8 ) {
            position = 5;
        }
        if ( position == 8 ) {
            position = 6;
        }
        return position - 1;
    }
}

var Controller = new function() {
    this.activeTopNode = -1;
    this.blockingCallback = null;
    this.loadCallback = null;
    this.navigation = new Array(6);
    
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
        this.activeTopnode = Memplex.id;
        
        var position = Helper.getLayerPosition(Memplex.layer);
        this.navigation[position] = Memplex;
        View.create(Memplex);
        
        if ( this.loadCallback != null ) {
            this.loadCallback();
            this.loadCallback = null;
        }
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
        
        for ( i = 0 ; i <= Helper.getLayerPosition(Memplex.layer) ; i++ ) {
            $("<span class=\"title\"><a onclick=\"Controller.load(" 
            + Controller.navigation[i].id 
            + ")\"> &gt; " 
            + Controller.navigation[i].title 
            + "</a></span>").appendTo(View.headline);
        }
        if ( Helper.getLayerPosition(Memplex.layer) - 1 >= 0 ) {
            $("<span class=\"title back\"><a onclick=\"Controller.load(" 
            + Controller.navigation[Helper.getLayerPosition(Memplex.layer) - 1].id 
            + ")\">&lt;&lt; Back</a></span>").appendTo(View.headline);
        }
        
        switch ( Memplex.layer ) {
            case 1: break;
            case 2: 
                this.createButton("Create Issue", function() {
                    CreateIssue.create();
                });/*Create Issue*/ break;
            case 3: 
                this.createButton("Create Solution", function() {
                    CreateSolution.create();
                });/*Create Solution*/ break;
            case 4: 
                this.createButton("Create Argument", function() {
                    CreateArgument.create();
                });/*Create Argument*/ break;
            case 5: case 6: case 7: case 8: 
                this.createButton("Create Comment", function() {
                    CreateComment.create();
                });/*Create Comment*/ break;
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
        
        $("<div class=\"solutionContent\">" + Memplex.text + "</div>").appendTo(this.contentLeft);
        
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

var CreateSolution = new function() {
    this.overlay = null;
    this.form = null;
    this.defaultLayer = 4;

    this.destroy = function() {
        CreateSolution.form.remove();
        CreateSolution.overlay.remove();
    }
    
    this.create = function() {
        this.overlay = $("<div class=\"overlay\">")
            .appendTo("body")
            .click(function(e) {
                if ( e.target.className == "overlay" ) {
                    CreateSolution.destroy();
                }
        });
        
        
        this.form = $("<div id=\"CreateSolution\" class=\"form\">").appendTo("body");

        $("<h3>Create Solution</h3>").appendTo(this.form);
        $("<input name=\"layer\" type=\"hidden\" value=\"" + CreateSolution.defaultLayer + "\">").appendTo(this.form);
        
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
        $("<button>Create Solution</button>").click(this.submit).appendTo(tr);
    }
    
    this.submit = function() {
        Controller.submit(new function() {
            this.layer = $("#CreateSolution").find("input")[0].value;
            this.author = $("#CreateSolution").find("input")[1].value;
            this.title = $("#CreateSolution").find("input")[2].value;
            this.text = $("#CreateSolution").find("textarea")[0].value;
        },CreateSolution.destroy);
        return false;
    }
}

var CreateArgument = new function() {
    this.overlay = null;
    this.form = null;

    this.destroy = function() {
        CreateArgument.form.remove();
        CreateArgument.overlay.remove();
    }
    
    this.create = function() {
        this.overlay = $("<div class=\"overlay\">")
            .appendTo("body")
            .click(function(e) {
                if ( e.target.className == "overlay" ) {
                    CreateArgument.destroy();
                }
        });
        
        
        this.form = $("<div id=\"CreateArgument\" class=\"form\">").appendTo("body");

        $("<h3>Create Argument</h3>").appendTo(this.form);
        
        var table = $("<table>").appendTo(this.form);
        var tr = $("<tr>").appendTo(table);
        $("<td>&nbsp;</td>"
            + "<td width=\"100\">Pro</td>"
            + "<td width=\"100\">Neutral</td>"
            + "<td width=\"100\">Contra</td>").appendTo(tr);
        tr = $("<tr>").appendTo(table);
        $("<td>&nbsp;</td><td><input name=\"layer\" type=\"radio\" value=\"5\"></td>"
            + "<td><input name=\"layer\" type=\"radio\" value=\"7\"></td>"
            + "<td><input name=\"layer\" type=\"radio\" value=\"6\"></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>Author</td>").appendTo(tr);
        $("<td colspan=\"3\"><input name=\"author\" type=\"text\"></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>Title</td>").appendTo(tr);
        $("<td colspan=\"3\"><input name=\"title\" type=\"text\"></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>Description</td>").appendTo(tr);
        $("<td colspan=\"3\"><textarea name=\"description\" rows=\"20\" cols=\"48\"></textarea></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>&nbsp;</td>").appendTo(tr);
        $("<td colspan=\"3\"><button>Create Argument</button></td>").click(this.submit).appendTo(tr);
    }
    
    this.submit = function() {
        Controller.submit(new function() {
            if ( $("#CreateArgument").find("input")[0].checked ) {
                this.layer = $("#CreateArgument").find("input")[0].value;
            } else if ( $("#CreateArgument").find("input")[1].checked ) {
                this.layer = $("#CreateArgument").find("input")[1].value;
            } else if ( $("#CreateArgument").find("input")[2].checked ) {
                this.layer = $("#CreateArgument").find("input")[2].value;
            }
            this.author = $("#CreateArgument").find("input")[3].value;
            this.title = $("#CreateArgument").find("input")[4].value;
            this.text = $("#CreateArgument").find("textarea")[0].value;
        },CreateArgument.destroy);
        return false;
    }
}

var CreateComment = new function() {
    this.oldMemplex = null;
    this.overlay = null;
    this.form = null;
    this.defaultLayer = 8;

    this.destroy = function() {
        CreateComment.form.remove();
        CreateComment.overlay.remove();
    }
    
    this.create = function() {
        this.overlay = $("<div class=\"overlay\">")
            .appendTo("body")
            .click(function(e) {
                if ( e.target.className == "overlay" ) {
                    CreateComment.destroy();
                }
        });
        
        
        this.form = $("<div id=\"CreateComment\" class=\"form\">").appendTo("body");

        $("<h3>Create Comment</h3>").appendTo(this.form);
        $("<input name=\"layer\" type=\"hidden\" value=\"" + CreateComment.defaultLayer + "\">").appendTo(this.form);
        
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
        $("<button>Create Comment</button>").click(this.submit).appendTo(tr);
    }
    
    this.callback = function() {
        CreateComment.destroy();
        var oldid = CreateComment.oldMemplex.id;
        //CreateComment.oldMemplex = Controller.navigation[5];
        //Controller.loadCallback = CreateComment.loadCallback;
        Controller.load(oldid);
    }
    
    this.loadCallback = function() {
        Controller.loadMemplex(CreateComment.oldMemplex);
    }
    
    this.submit = function() {
        CreateComment.oldMemplex = Controller.navigation[5];
        Controller.submit(new function() {
            this.layer = $("#CreateComment").find("input")[0].value;
            this.author = $("#CreateComment").find("input")[1].value;
            this.title = $("#CreateComment").find("input")[2].value;
            this.text = $("#CreateComment").find("textarea")[0].value;
        },CreateComment.callback);
        return false;
    }
}