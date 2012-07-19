var language = "de_DE";

var Helper = new function() {
    this.getSecondIdFromString = function(string) {
        var search = /(\d+)[^0-9]+(\d+)/;
        var result = search.exec(string);
        if ( result == null ) {
            return null;
        }
        return parseInt(result[2]);
    }
    this.getIdFromString = function(string) {
        return parseInt(string.match(/\d+/));
    }
}

var Controller = new function() {
    this.commentTarget = null;
    
    /** Load Debates into Storage.
    */
    this.loadDebates = function() {
        $.post("memplex.php",
            {id: 1},
            function(data) {
                var json = $.parseJSON(data);
                Controller.parseMemplex(json.data);
                View.loadDebates();
            });
    }
   
    /** Load Solution into Storage, trigger loading of comment.
    */
    this.loadComment = function(solution, target) {
        this.commentTarget = target;
        this.loadSolution(solution);
    }
    
    /** Load Solution into Storage, trigger loading of comment.
    */
    this.popCommentTarget = function() {
        var target = this.commentTarget;
        this.commentTarget = null;
        return target;
    }
    
    /** Load target Solution into Storage.
    */
    this.loadSolution = function(target) {
        $.post("memplex.php",
            {id: target},
            function(data) {
                var json = $.parseJSON(data);
                Controller.parseMemplex(json.data);
                View.loadSolution(json.data.id);
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
    
    /** Create a new Debate.
    */
    this.newDebate = function() {
        
    }
}

/** MemplexRegister contains all Memplexes loaded from the server.
*/
var MemplexRegister = new function() {
    this.memplexes = new Array();
    this.layerlist = new Array();
    this.layerlistreverse = new Array();
    
    /** Add a new Memplex to the Register.
    *   @param memplex Memplex to be added.
    * */
    this.add = function(memplex) {
        if ( this.layerlist[memplex.layer] == null ) {
            this.layerlist[memplex.layer] = new Array();
        }
        if ( this.layerlistreverse[memplex.id] == null ) {
            this.layerlistreverse[memplex.id] = memplex.layer;
            this.layerlist[memplex.layer][this.layerlist[memplex.layer].length] = memplex.id;
        }
        
        this.memplexes[memplex.id] = new function() {
            this.id = memplex.id;
            this.author = memplex.author;
            this.title = memplex.title;
            this.text = memplex.text;
            this.layer = memplex.layer;
            this.children = new Array();
            for ( c in memplex.children ) {
                this.children[c] = memplex.children[c].id;
            }
        }
    }
    
    /** Get all MemplexIDs with the param layer.
    *   @param layer The layer to be loaded.
    *   @return Array MemplexIDs with targeted layer.
    */
    this.getLayer = function(layer) {
        return this.layerlist[layer];
    }
    
    /** Get the Memplex with the specified id.
    *   @param id The ID of the Memplex to be loaded.
    *   @return Memplex Memplex with targeted id.
    */
    this.get = function(id) {
        return this.memplexes[id];
    }
}

/** View controls all visual activities.
*/
var View = new function() {
    this.solutionbutton = null;
    
    /** Load all debates into content.
    */
    this.loadDebates = function() {
        var content = $('#content').empty();
        
        var memplexes = MemplexRegister.getLayer(3);
        for ( m in memplexes ) {
            var debate = new Debate(MemplexRegister.get(memplexes[m]));
            debate.getObject().appendTo(content);
        }
    };
    
    /** Load a solution into content.
    *   @param target The ID of the target solution.
    */
    this.loadSolution = function(target) {
        var content = $('#content').empty();
        
        var solution = MemplexRegister.get(target);
        if ( this.solutionbutton != null ) {
            this.solutionbutton.remove();
        }
        this.solutionbutton = $('<button id="solution' + solution.id + 'button">L&ouml;sungsvorschlag: ' + solution.title + '</button>')
            .appendTo('#menuright')
            .click(function(data) {
                var id = Helper.getIdFromString(data.currentTarget.id);
                Controller.loadSolution(id);
        });
        var tmp = new Solution(solution);
        tmp.getObject().appendTo(content);
        
        var target = Controller.popCommentTarget();
        if ( target != null ) {
            tmp.showComment(target);
        }
    };
}

/** SolutionRegister for all Debates.
*/
var SolutionRegister = new function() {
    this.solutions = new Array();
    
    /** Add a solution to the register.
    *   @param id Id to be added.
    *   @param solution Solution to be added.
    */
    this.add = function(id,solution) {
        this.solutions[id] = solution;
    }
    
    /** Get a solution from the register.
    *   @param id Id to be fetched.
    *   @return Solution Selected Solution.
    */
    this.get = function(id) {
        return this.solutions[id];
    }
}

/** Object housing a solution.
*/
var Solution = function(Memplex) {
    this.memplex = Memplex;
    this.object = null;
    this.text = null;
    this.list = null;
    this.pro = null;
    this.neutral = null;
    this.contra = null;
    this.activecomment = null;
    this.hidden = new Array();
    
    /** Constructor.
    */
    this.construct = function() {
        this.object = $('<div id="solution' + this.memplex.id + '" class="solution">');
        this.text = $('<div id="solution' + this.memplex.id + 'text" class="solutiontext">' + this.memplex.text + '</div>').appendTo(this.object);
        this.list = $('<div id="solution' + this.memplex.id + 'list" class="solutionlist">').appendTo(this.object);
        this.pro = $('<ul id="solution' + this.memplex.id + 'pro" class="solutionpro">').appendTo(this.list);
        this.neutral = $('<ul id="solution' + this.memplex.id + 'neutral" class="solutionneutral">').appendTo(this.list);
        this.contra = $('<ul id="solution' + this.memplex.id + 'contra" class="solutioncontra">').appendTo(this.list);
        
        this.loadArguments();
        
        SolutionRegister.add(this.memplex.id,this);
    }
    
    /** Bring the target comment up front.
    */
    this.showComment = function(id) {
        if ( this.activecomment != null ) {
            var lastcomment = $('#solution' + this.memplex.id + 'comment' + this.activecomment);
            lastcomment.attr('class',lastcomment.attr('class').replace(/active/g,''))
        }
        this.activecomment = id;
        var a = $('#solution' + this.memplex.id + 'comment' + id);
        a.attr('class',a.attr('class') + ' active');
        
        this.bubbleShow(a);
        
        var comment = MemplexRegister.get(id);
        
        this.text.empty();
        
        $('<span>' + comment.text + '</span>').appendTo(this.text);
    }
    
    /** Walks through all parent comment nodes until it finds and shows the hidden topnode.
    */
    this.bubbleShow = function(JQueryElement) {
        if ( JQueryElement.attr('class') != undefined 
            && ( JQueryElement.attr('class').search(/comment/) == -1 
            || ( JQueryElement.attr('id') != undefined && JQueryElement.attr('id').search(/hidden/) != -1 ) ) ) {
            JQueryElement.attr('class',JQueryElement.attr('class').replace(/hidden/,''));
            return;
        }
        this.bubbleShow(JQueryElement.parent());
    }
    
    /** Load Arguments into List.
    */
    this.loadArguments = function() {
        var childs = this.memplex.children;
        for ( c in childs ) {
            var child = MemplexRegister.get(childs[c]);
            var li = $('<li class="solutionargumentli">');
            
            switch ( child.layer ) {
                case 5: li.appendTo(this.pro); break;
                case 6: li.appendTo(this.contra); break;
                case 7: li.appendTo(this.neutral); break;
            }
            
            var span = $('<span id="solution' + this.memplex.id + 'comment' + child.id + '" class="solutionargument">' + child.title + '</span>')
                .appendTo(li)
                .click(function(data) {
                    var id = Helper.getSecondIdFromString(data.currentTarget.id);
                    var sid = Helper.getIdFromString(data.currentTarget.id);
                    
                    var solution = SolutionRegister.get(sid);
                    var argument = MemplexRegister.get(id);
                    
                    var target = $('#solution' + sid + 'comment' + id + 'hidden');
                    if ( target.attr('class').search('hidden') != -1 ) {
                        target.attr('class',target.attr('class').replace(/hidden/g,''));
                    } else if ( solution.activecomment == id ) {
                        target.attr('class',target.attr('class') + ' hidden');
                    }
                    
                    solution.showComment(id);
                });
            this.hidden[child.id] = $('<div id="solution' + this.memplex.id + 'comment' + child.id + 'hidden" class="solutioncomment hidden">').appendTo(li);
            for ( c in child.children ) {
                var comment = MemplexRegister.get(child.children[c]);
                this.loadCommentsRecursive(child,comment,this.hidden[child.id])
            }
        }
    }
    
    /** Load comments.
    */
    this.loadCommentsRecursive = function(topnode,memplex,parent) {
        var ul = $("<ul class=\"comment\">").appendTo(parent);
        var li = $("<li class=\"comment\">").appendTo(ul);
        
        $('<a id="solution' + this.memplex.id + 'comment' + memplex.id + '" class="solutioncommentlink">' + memplex.title + '</a>')
            .appendTo(li)
            .click(function(data) {
                var sid = Helper.getIdFromString(data.currentTarget.id);
                var cid = Helper.getSecondIdFromString(data.currentTarget.id);
                if ( cid == null ) {
                    return false;
                }
                var solution = SolutionRegister.get(sid);
                
                solution.showComment(cid);
            });
        
        for ( c in memplex.children ) {
            var comment = MemplexRegister.get(memplex.children[c]);
            this.loadCommentsRecursive(topnode,comment,li)
        }
    }
    
    /** Get the JQuery HTML Object representation of the debate.
    */
    this.getObject = function() {
        return this.object;
    }
    
    this.construct();
}

/** DebateRegister for all Debates.
*/
var DebateRegister = new function() {
    this.debates = new Array();
    
    /** Add a debate to the register.
    *   @param id Id to be added.
    *   @param debate Debate to be added.
    */
    this.add = function(id,debate) {
        this.debates[id] = debate;
    }
    
    /** Get a debate from the register.
    *   @param id Id to be fetched.
    *   @return Debate Selected Debate.
    */
    this.get = function(id) {
        return this.debates[id];
    }
}

/** Object housing a debate.
*/
var Debate = function(memplex) {
    this.memplex = memplex;
    this.object = null;
    this.title = null;
    this.text = null;
    this.hide = null;
    this.ul = null;
    
    /** Constructor.
    */
    this.construct = function() {
        this.object = $('<div id="debate' + this.memplex.id + '" class="debate">');
        this.title = $('<div id="debate' + this.memplex.id + 'title" class="debatetitle">' + this.memplex.title + '</div>')
            .appendTo(this.object)
            .click(function(data) {
                var id = Helper.getIdFromString(data.currentTarget.id);
                DebateRegister.get(id).toggle();
        });
        
        this.hide = $('<div id="debate' + this.memplex.id + 'hide" class="hidden">').appendTo(this.object)
        
        this.text = $('<div id="debate' + this.memplex.id + 'text" class="debatetext">' + this.memplex.text + '</div>').appendTo(this.hide);
        
        this.ul = $('<ul id="debate' + this.memplex.id + 'list" class="debatelist">').appendTo(this.hide);
        
        var childs = this.memplex.children;
        
        for ( c in childs ) {
            var child = MemplexRegister.get(childs[c]);
            $('<li id="solution' + child.id + '" class="debatesolution">' + child.title + '</li>')
                .appendTo(this.ul)
                .click(function(data) {
                    var id = Helper.getIdFromString(data.currentTarget.id);
                    Controller.loadSolution(id);
                });
        }
        
        DebateRegister.add(memplex.id,this);
    }
    
    /** Get the JQuery HTML Object representation of the debate.
    */
    this.getObject = function() {
        return this.object;
    }
    
    /** Toggle the hiding.
    */
    this.toggle = function () {
        if ( this.hide.attr('class') == 'hidden' ) {
            this.hide.attr('class','');
            return;
        }
        this.hide.attr('class','hidden');
    }
    
    this.construct();
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
