var language = "de_DE";

var Helper = new function() {
    /** Get the second complete set of digits in a string.
    *   @param string   Searchstring.
    *   @return int     ID.
    */
    this.getSecondIdFromString = function(string) {
        var search = /(\d+)[^0-9]+(\d+)/;
        var result = search.exec(string);
        if ( result == null ) {
            return null;
        }
        return parseInt(result[2]);
    }
    
    /** Get the first complete set of digits in a string.
    *   @param string   Searchstring.
    *   @return int     ID.
    */
    this.getIdFromString = function(string) {
        return parseInt(string.match(/\d+/));
    }
    
    /** Count the direct children of an object.
    *   @param object   The target object.
    *   @return int     number of children.
    */
    this.objectCount = function(object) {
        var i = 0;
        for ( o in object ) {
            i++;
        }
        return i;
    }
    
    /** Toggle the hidden class on an object (remove if present, else add).
    *   @param object   The target object.
    */
    this.toggleHidden = function(object) {
        object.toggleClass("hidden");
    }
    
    /** Add the hidden class to an object.
    *   @param object   The target object.
    */
    this.hide = function(object) {
        object.attr("class",object.attr("class") + ' hidden');
    }
    
    /** Remove the hidden class from object.
    *   @param object   The target object.
    */
    this.show = function(object) {
        object.attr("class",object.attr("class").replace(/hidden/,''));
    }
    
    /** Adds standardwindowclasses.
    */
    this.window = function(object) {
        object.addClass("ui-corner-all ui-widget ui-widget-content");
    }
    
    /** Create a button.
    *   @param object   The target object.
    */
    this.createButton = function(text,icon,append,floatdirection,callback) {
        var showtext = true;
        if ( text == null ) {
            text = "&nbsp;";
            showtext = false;
        }
        $('<button>' + text + '</button>')
            .button({
                text: showtext,
                icons: {
                    primary: icon
                }
            })
            .click(callback)
            .addClass(floatdirection + ' mybutton')
            .appendTo(append);
    }
}

var Controller = new function() {
    this.commentTarget = null;
    
    /** Async load Debates into Storage then trigger View for loading of debates.
    */
    this.loadDebates = function() {
        $.post("memplex.php",
            {id: 1},
            function(data) {
                var json = $.parseJSON(data);
                Controller.parseMemplex(json.data,null);
                View.loadDebates();
            });
    }
   
    /** Load Solution into Storage then trigger View for loading of commentTarget.
    *   See this.popCommentTarget() for further information.
    */
    this.loadComment = function(solution, target) {
        this.commentTarget = target;
        this.loadSolution(solution);
    }
    
    /** Return the comment targetted by the last load and reset it.
    */
    this.popCommentTarget = function() {
        var target = this.commentTarget;
        this.commentTarget = null;
        return target;
    }
    
    /** Load target Solution into Storage then trigger View for loading of solution.
    */
    this.loadSolution = function(target) {
        $.post("memplex.php",
            {id: target},
            function(data) {
                var json = $.parseJSON(data);
                Controller.parseMemplex(json.data,null);
                View.loadSolution(json.data.id);
            });
    }
    
    /** Parse loaded memplexes into MemplexRegister.
    */
    this.parseMemplex = function(data,parent) {
        MemplexRegister.add(data,parent);
        for ( c in data.children ) {
            Controller.parseMemplex(data.children[c],data);
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
    this.memplexes = {};
    this.parentlist = {};
    this.layerlist = {};
    this.layerlistreverse = {};
    
    /** Add a new Memplex to the Register.
    *   @param memplex Memplex to be added.
    * */
    this.add = function(memplex,parent) {
        if ( this.parentlist[memplex.id] == null ) {
            this.parentlist[memplex.id] = {};
        }
        if ( parent != null ) {
            this.parentlist[memplex.id][parent.id] = parent.id;
        }
        
        if ( this.layerlist[memplex.layer] == null ) {
            this.layerlist[memplex.layer] = {};
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
            this.children = {};
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
    
    /** Get all ParentIDs for the specified MemplexID.
    *   @param id The id of the Child to be loaded.
    *   @return Array MemplexIDs with targeted child.
    */
    this.getParents = function(id) {
        return this.parentlist[id];
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
        // .addClass('ui-corner-all ui-widget ui-widget-content')
        
        $('#content')
            .empty();
        var mycontent = $('<div id="mycontent">').appendTo('#content');
        
        var memplexes = MemplexRegister.getLayer(3);
        for ( m in memplexes ) {
            var debate = new Debate(MemplexRegister.get(memplexes[m]));
            if ( !debate.matchFilter() ) {
                continue;
            }
            debate.appendTo(mycontent);
        }
        
        mycontent.accordion();
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
            })
            .button()
            .attr('style','font-size: 0.7em;');;
        
        
        var tmp = new Solution(solution);
        tmp.getObject().appendTo(content);
        
        var target = Controller.popCommentTarget();
        if ( target != null ) {
            tmp.showComment(target);
        }
    };

    /** Paint the primary menubuttons.
    */
    this.paintButtons = function() {
        Helper.createButton(null,'ui-icon-minus','#menuleft','floatright',function(data) {
            Helper.menuleft = !Helper.menuleft;
            console.log(data);
            if ( Helper.menuleft ) {
                $('#leftbox')
                    .addClass('slideout');
                $('#list')
                    .addClass('hidden');
            } else {
                $('#leftbox')
                    .removeClass('slideout');
                $('#list')
                    .removeClass('hidden');
            }
        });
        Helper.createButton(null,null,'#menuright','floatleft',function(data) {
            Controller.loadDebates();
        });
    }
}

/** SolutionRegister for all Debates.
*/
var SolutionRegister = new function() {
    this.solutions = {};
    
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
    this.hidden = {};
    
    /** Constructor.
    */
    this.construct = function() {
        this.object = $('<div id="solution' + this.memplex.id + '" class="solution">');
        this.text = $('<div id="solution' + this.memplex.id + 'text" class="solutiontext">' + this.memplex.text + '</div>').appendTo(this.object);
        this.list = $('<div id="solution' + this.memplex.id + 'list" class="solutionlist">').appendTo(this.object);
        this.pro = $('<ul id="solution' + this.memplex.id + 'pro" class="solutionpro">').appendTo(this.list);
        this.neutral = $('<ul id="solution' + this.memplex.id + 'neutral" class="solutionneutral">').appendTo(this.list);
        this.contra = $('<ul id="solution' + this.memplex.id + 'contra" class="solutioncontra">').appendTo(this.list);
        
        Helper.window(this.pro);
        Helper.window(this.neutral);
        Helper.window(this.contra);
        
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
            Helper.show(JQueryElement);
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
                    if ( solution.activecomment == argument.id
                        || target.attr('class').search(/hidden/) != -1 )
                    Helper.toggleHidden(target);
                    
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
    this.debates = {};
    
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
        // this.object = $('<div id="debate' + this.memplex.id + '" class="debate">');
        this.title = $('<h3 id="debate' + this.memplex.id + 'title" class=""><a href="#">' + this.memplex.title + '</a></h3>');
            // .appendTo(this.object)
            // .click(function(data) {
                // var id = Helper.getIdFromString(data.currentTarget.id);
                // Helper.toggleHidden(DebateRegister.get(id).hide);
        // });
        
        this.hide = $('<div id="debate' + this.memplex.id + 'hide" class="hidden">'); //.appendTo(this.object)
        
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
    
    /** Append the JQuery HTML Object representation of the debate to the given JQuery object.
    */
    this.appendTo = function(object) {
        this.title.appendTo(object);
        this.hide.appendTo(object);
    }
    
    /** Checks if debate matches the given filter.
    */
    this.matchFilter = function() {
        var parents = MemplexRegister.getParents(this.memplex.id);
        return Filter.match(parents);
    }
    
    this.construct();
}

var Filter = new function() {
    this.allof = {};
    this.oneof = {};
    this.mine = {};
    
    this.match = function(nodes) {
        var allof = this.allof;
        var oneof = this.oneof;
        var mine = this.mine;
    
        for ( a in allof ) {
            if ( nodes[allof[a]] == undefined ) {
                return false;
            }
        }
        if ( Helper.objectCount(oneof) == 0 ) {
            return true;
        }
        console.log(oneof);
        var match = false;
        
        for ( o in oneof ) {
            if ( nodes[oneof[o]] == undefined ) {
                continue;
            }
            match = true;
        }
        if ( Helper.objectCount(mine) == 0 ) {
            return match;
        }
        // check if node is contained in mine.
    }
    
    /** Get the Object representation of the new filter form.
    */
    this.createNewObject = function() {
        console.log("test");
    }
}