var language = "de_DE";

var Controller = new function() {
    
    /** Load Debates into Storage.
    */
    this.loadDebates = function() {
        $.post("memplex.php",
            {id: 1},
            function(data) {
                var json = $.parseJSON(data);
                Controller.parseMemplex(json.data);
                console.log(MemplexRegister.memplexes);
            });
    }
    
    /** Parse loaded memplexes into MemplexRegister.
    */
    this.parseMemplex = function(data) {
        MemplexRegister.add(data);
        for ( c in data.children ) {
            Controller.parseMemplex(data.children[c]);
        }
    }
}

/** MemplexRegister contains all Memplexes loaded from the server.
*/
var MemplexRegister = new function() {
    this.memplexes = new Array();
    
    /** Add a new Memplex to the Register.
    *   @param memplex Memplex to be added.
    * */
    this.add = function(memplex) {
        this.memplexes[memplex.id] = new function() {
            this.id = memplex.id;
            this.author = memplex.author;
            this.title = memplex.title;
            this.text = memplex.text;
            this.children = new Array();
            for ( c in memplex.children ) {
                this.children[c] = memplex.children[c].id;
            }
        }
    }
}

/*var Helper = new function() {
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
    this.memplex = null;
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

    this.load = function(id,callback) {
        //Controller.blockingCallback = callback;
        $.post("memplex.php",
            {id: id},
            function(data) {
                var json = $.parseJSON(data);
                Controller.memplex = json.data;
                Controller.loadMemplex(Controller.memplex);
                
                // if ( this.blockingCallback != null ) {
                    // this.blockingCallback();
                    // this.blockingCallback = null;
                // }
            });
    }
    
    this.loadMemplex = function(Memplex) {
        this.activeTopnode = Memplex.id;
        
        var position = Helper.getLayerPosition(Memplex.layer);
        this.navigation[position] = Memplex;
        View.create(Memplex);
    }
    
    this.submit = function(data,callback) {
        View.block();
        Controller.blockingCallback = callback;
        console.log(callback);
        $.post("memplex.php", {
                "parent": Controller.activeTopnode,
                "layer": data.layer,
                "author": data.author,
                "title": data.title,
                "text": data.text
            },
            function (data) {
                var json = $.parseJSON(data);
                Controller.memplex = json.data;
                Controller.loadMemplex(Controller.memplex);
                
                console.log(callback);
                if ( Controller.blockingCallback != null ) {
                    Controller.blockingCallback();
                    Controller.blockingCallback = null;
                }
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
        
        var currentposition = Helper.getLayerPosition(Memplex.layer);
        
        for ( i = 0 ; i <= currentposition ; i++ ) {
            if ( Controller.navigation[i] == null ) {
                $("<span class=\"title\"> &gt; </span>").appendTo(View.headline);
                continue;
            }
            $("<span class=\"title\"><a onclick=\"Controller.load(" 
            + Controller.navigation[i].id 
            + ")\"> &gt; " 
            + Controller.navigation[i].title 
            + "</a></span>").appendTo(View.headline);
        }
        if ( currentposition - 1 >= 0 ) {
            if ( Controller.navigation[currentposition - 1] != null ) {
                $("<span class=\"title back\"><a onclick=\"Controller.load(" 
                + Controller.navigation[currentposition - 1].id 
                + ")\">&lt;&lt;"+Language.get("lang_back",language)+"</a></span>").appendTo(View.headline);
            }
        }
        
        switch ( Memplex.layer ) {
            case 1: this.createButton( Language.get("lang_createTopic",language) , function() {
                        Create.create(2, Language.get("lang_createTopic",language) );
                    }); break;
            case 2: 
                this.createButton( Language.get("lang_createIssue",language) , function() {
                    Create.create(3, Language.get("lang_createIssue",language) );
                }); break;
            case 3: 
                this.createButton( Language.get("lang_createSolution",language ), function() {
                    Create.create(4, Language.get("lang_createSolution",language) );
                }); break;
            case 4: 
                this.createButton( Language.get("lang_createArgument",language) , function() {
                    CreateArgument.create();
                }); break;
            case 5: case 6: case 7: case 8: 
                this.createButton( Language.get("lang_createComment",language) , function() {
                    Create.create(8, Language.get("lang_createComment",language) );
                }); break;
        }
        
        switch ( Memplex.layer ) {
            case 1: case 2: case 3: ViewList.create(Memplex); break;
            case 4: ViewSolution.create(Memplex); break;
            case 5: case 6: case 7: case 8: ViewComment.create(Memplex); break;
        }
    };
    
    this.createButton = function(name, handler) {
        $("<button class=\"buttonCreate\">" + name + "</button>").click(handler).appendTo(this.footer);
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
        
        this.argumentPro = $("<ul class=\"argumentPro\" style=\"color:green\">").appendTo(this.contentRight);
        this.argumentCon = $("<ul class=\"argumentCon\" style=\"color:red\">").appendTo(this.contentRight);
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
    this.argument = null;

    this.create = function(Memplex) {
        this.contentLeft = $("<div class=\"contentLeft\">").appendTo(View.content);
        this.contentRight = $("<div class=\"contentRight\">").appendTo(View.content);
        if ( Memplex.layer > 4 && Memplex.layer < 8 ) {
            this.argument = Memplex;
            this.commentUl = $("<ul class=\"comment\">");
            this.loadComments(Memplex,this.commentUl);
        }
        this.commentUl.appendTo(this.contentRight);
        
        $("<div class=\"solutionContent\">" + Memplex.text + "</div>").appendTo(this.contentLeft);
        
    };
    
    this.loadComments = function(Memplex,parent) {
        var ul = $("<ul class=\"comment\">");
        var li = $("<li class=\"comment\">");
        
        $("<a class=\"argumentlink\" onclick=\"Controller.load(" + Memplex.id + ")\">" + Memplex.title + " - " + Memplex.author + "</a>").appendTo(li);
        
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
            var div = $("<div class=\"listelement\">").appendTo(View.content);
            $("<a class=\"layer1title\" onclick=\"Controller.load(" + Memplex.children[c].id + ")\">" + Memplex.children[c].title + "</a><br>").appendTo(div);
            console.log(Memplex.children[c]);
            for ( s in Memplex.children[c].children ) {
                $("<a class=\"layer1link\" onclick=\"Controller.load(" + Memplex.children[c].children[s].id + ")\">&gt;" + Memplex.children[c].children[s].title + "</a><br>").appendTo(div);
            }
        };
        $("<br class=\"clear\">").appendTo(View.content);
    };
};

var Create = new function() {
    this.overlay = null;
    this.form = null;

    this.destroy = function() {
        console.log("destroy");
        Create.form.remove();
        Create.overlay.remove();
    }
    
    this.create = function(defaultLayer,text) {
        this.overlay = $("<div class=\"overlay\">")
            .appendTo("body")
            .click(function(e) {
                if ( e.target.className == "overlay" ) {
//                    Create.destroy();
                }
        });
        
        
        this.form = $("<div id=\"Create\" class=\"form\">").appendTo("body");

        $("<h3>" + text + "</h3>").appendTo(this.form);
        $("<input name=\"layer\" type=\"hidden\" value=\"" + defaultLayer + "\">").appendTo(this.form);
        
        var table = $("<table>").appendTo(this.form);
        var tr = $("<tr>").appendTo(table);
        $("<td>" + Language.get("lang_author",language) + "</td>").appendTo(tr);
        $("<td><input name=\"author\" type=\"text\"></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>" + Language.get("lang_title",language) + "</td>").appendTo(tr);
        $("<td><input name=\"title\" type=\"text\"></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>" + Language.get("lang_description",language )+ "</td>").appendTo(tr);
        $("<textarea name=\"description\" rows=\"20\" cols=\"50\">").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>&nbsp;</td>").appendTo(tr);
        var td = $("<td>").appendTo(tr);
        $("<button class=\"button\">" + text + "</button>").click(this.submit).appendTo(td);
        $("<button class=\"button\">" + Language.get("lang_Cancel",language) + "</button>").click(this.destroy).appendTo(td);
    }
    
    this.submit = function() {
        Controller.submit(new function() {
            this.layer = $("#Create").find("input")[0].value;
            this.author = $("#Create").find("input")[1].value;
            this.title = $("#Create").find("input")[2].value;
            this.text = $("#Create").find("textarea")[0].value;
        },Create.destroy);
        return false;
    }
}

var CreateArgument = new function() {
    this.overlay = null;
    this.form = null;
    this.memplex = null;

    this.destroy = function() {
        CreateArgument.form.remove();
        CreateArgument.overlay.remove();
    }
    
    this.create = function() {
        this.overlay = $("<div class=\"overlay\">")
            .appendTo("body")
            .click(function(e) {
                if ( e.target.className == "overlay" ) {
//                    CreateArgument.destroy();
                }
        });
                
        this.form = $("<div id=\"CreateArgument\" class=\"form\">").appendTo("body");

        $("<h3>"+Language.get("lang_CreateArgument",language)+"</h3>").appendTo(this.form);
        
        var table = $("<table>").appendTo(this.form);
        var tr = $("<tr>").appendTo(table);
        $("<td>&nbsp;</td>"
            + "<td width=\"100\">" + Language.get("lang_pro",language) +"</td>"
            + "<td width=\"100\">" + Language.get("lang_neutral",language) +"</td>"
            + "<td width=\"100\">" + Language.get("lang_contra",language) +"</td>").appendTo(tr);
        tr = $("<tr>").appendTo(table);
        $("<td>&nbsp;</td><td><input name=\"layer\" type=\"radio\" value=\"5\"></td>"
            + "<td><input name=\"layer\" type=\"radio\" value=\"7\"></td>"
            + "<td><input name=\"layer\" type=\"radio\" value=\"6\"></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>" + Language.get("lang_author",language) + "</td>").appendTo(tr);
        $("<td colspan=\"3\"><input name=\"author\" type=\"text\"></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>" + Language.get("lang_title",language) + "</td>").appendTo(tr);
        $("<td colspan=\"3\"><input name=\"title\" type=\"text\"></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>"+Language.get("lang_description",language)+"</td>").appendTo(tr);
        $("<td colspan=\"3\"><textarea name=\"description\" rows=\"20\" cols=\"48\"></textarea></td>").appendTo(tr);
        
        tr = $("<tr>").appendTo(table);
        $("<td>&nbsp;</td>").appendTo(tr);
        var td = $("<td colspan=\"3\">").appendTo(tr);
        $("<button class=\"button\">" + Language.get("lang_createArgument",language) + "</button>").click(this.submit).appendTo(td);
        $("<button class=\"button\">" + Language.get("lang_cancel",language) + "</button>").click(this.destroy).appendTo(td);
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
*/
