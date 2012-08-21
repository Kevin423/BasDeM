/** It's all Svens fault!!1!11 **********************************************************
 * Copyright (c) 2012 Justus Wingert <justus_wingert@web.de>                            *
 *                                                                                      *
 * This file is part of BasDeM.                                                         *
 *                                                                                      *
 * BasDeM is free software; you can redistribute it and/or modify it under              *
 * the terms of the GNU General Public License as published by the Free Software        *
 * Foundation; either version 3 of the License, or (at your option) any later           *
 * version.                                                                             *
 *                                                                                      *
 * BasDeM is distributed in the hope that it will be useful, but WITHOUT ANY            *
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A      *
 * PARTICULAR PURPOSE. See the GNU General Public License for more details.             *
 *                                                                                      *
 * You should have received a copy of the GNU General Public License along with         *
 * BasDeM. If not, see <http://www.gnu.org/licenses/>.                                  *
 ****************************************************************************************/
/**
 * @file
 * BasDeM code on the client side.
 */

/** Language setting, used to pick the correct translation.
 */
var language = "de_DE";

/** @class ClassHelper
 * ClassHelper combines various helper methods into one class.
 * During runtime the helper can be accessed using the static Helper object.
 */
function ClassHelper() {};

/** @var Helper
 */
var Helper = new ClassHelper();

/** Get the second complete set of digits in a string.
 *   @tparam string string String to search for the digits.
 *   @treturn int ID.
 */
ClassHelper.prototype.getSecondIdFromString = function(string) {
    var search = /(\d+)[^0-9]+(\d+)/;
    var result = search.exec(string);
    if ( result == null ) {
        return null;
    }
    return parseInt(result[2]);
}

/** Get the reverse childcount of this memplex.
 *   @tparam memplex memplex Memplex containing the topnode to be counted.
 *   @treturn int count.
 */
ClassHelper.prototype.getRecursiveChildCount = function(memplex) {
    if ( memplex.children == null ) {
        return 0;
    }
    var tmp = 0;
    for ( c in memplex.children ) {
        tmp += 1 + Helper.getRecursiveChildCount(MemplexRegister.get(memplex.children[c]));
    }
    return tmp;
}

/** Get the third complete set of digits in a string.
 *   @tparam string string String to search for the digits.
 *   @treturn int ID.
 */
ClassHelper.prototype.getThirdIdFromString = function(string) {
    var search = /(\d+)[^0-9]+(\d+)[^0-9]+(\d+)/;
    var result = search.exec(string);
    if ( result == null ) {
        return null;
    }
    return parseInt(result[3]);
}
    
/** Get the first complete set of digits in a string.
 *   @tparam string string String to search in.
 *   @treturn int Found ID.
 */
ClassHelper.prototype.getIdFromString = function(string) {
    if ( string == null ) 
        string = "";
    return parseInt(string.match(/\d+/));
}
    
/** Count the direct children of an object.
 *   @tparam Object object The target object.
 *   @treturn int Number of children.
 */
ClassHelper.prototype.objectCount = function(object) {
    var i = 0;
    for ( o in object ) {
        i++;
    }
    return i;
}
    
/** Toggle the hidden class on an object (remove if present, else add).
 *   @tparam Object object The target object.
 */
ClassHelper.prototype.toggleHidden = function(object) {
    object.toggleClass("hidden");
}
    
/** Add the hidden class to an object.
 *   @tparam Object object The target object.
 */
ClassHelper.prototype.hide = function(object) {
    object.attr("class",object.attr("class") + ' hidden');
}
    
/** Remove the hidden class from object.
 *   @tparam Object object The target object.
 */
ClassHelper.prototype.show = function(object) {
    object.attr("class",object.attr("class").replace(/hidden/,''));
}
    
/** Adds standardwindowclasses.
 * @tparam Object object Object to work on.
 * @tparam string rounded Determines which corners should be rounded. Possible values: top, all.
 */
ClassHelper.prototype.window = function(object,rounded) {
    if ( rounded == 'top' ) {
        object.addClass("ui-corner-top");
    }
    if ( rounded == 'all' ) {
        object.addClass("ui-corner-all");
    }
    object.addClass("ui-widget ui-widget-content");
}

/** Gets translation for texts.
 * @tparam string text Text to translate.
 * @treturn string Translated text or 'undefined'.
 */
ClassHelper.prototype.getLang = function(text) {
         return Language.get(language,text);
}
    
/** Create a button.
 *   @tparam string text Button text.
 *   @tparam string icon jquery-ui icon name.
 *   @tparam object append jQuery Object to append the button to.
 *   @tparam string floatdirection Direction of the float.
 *   @tparam function callback Function callback
 *   @tparam string id HTML id attribute.
 */
ClassHelper.prototype.createButton = function(text,icon,append,floatdirection,callback,id) {
    var showtext = true;
    if ( text == null ) {
        text = "&nbsp;";
        showtext = false;
    }
    var button = $('<button>' + text + '</button>')
        .button({
            text: showtext,
            icons: {
                primary: icon
            }
        })
        .click(callback)
        .addClass(floatdirection + ' mybutton')
        .attr('id',id);
        
    if ( append != null ) {
        button.appendTo(append);
    }
    return button;
}
    
/** Classic Unix Timestamp.
 * @tparam Date date Current date.
 * @treturn int Current Unix timestamp.
 */
ClassHelper.prototype.time = function(date) {
    if ( date == null ) {
        date = new Date();
    }
    return Math.round(date.getTime() / 1000);
}

/** Create a div-box
 * @tparam string title Title of the box.
 * @tparam string id HTML ID.
 * @tparam Object target Target object to append the box to.
 * @tparam string url URL to link to.
 * @tparam string adder Appended to the (possibly shortened) title.
 * @treturn string HTML code of the box.
 */
ClassHelper.prototype.box = function(title,id,target,url,adder) {
    // if ( title.length > 45 ) {
        // title = title.substr(0,42) + '...';
    // }
    if ( adder != null ) {
        title = title + ' (' + adder + ')';
    }
    if ( url != null ) {
        title = '<a href="' + url + '">' + title + '</a>';
    }
    var div = $('<div id="' + id + '" class="solutionargument padded">' + title + '</div>')
        .appendTo(target);

    Helper.window(div,'all');
    div.width(300);

    return div;
}

/** @class ClassController
 * ClassController is responsible for the main control flow.
 * During runtime the controller can be accessed using the static Controller object.
 */
function ClassController() {
    this.commentTarget = null;
    this.lastload = {};
    this.lastAdded = {};
}

/** Static Controller object.
 */
var Controller = new ClassController();

/** Async load specified location into Storage then trigger View for loading of it.
 */
ClassController.prototype.loadLocation = function(location) {
    this.location = location;
    $.post("memplex.php",
        {id: 1,time:  Controller.lastLoad(1)},
        function(data) { // data returned by server
            var json = $.parseJSON(data);
            if ( json === null || json.data === null ) {
                return;
            }
            Controller.parseUser(json.user);
            Controller.parseMemplex(json.data,null);
            Controller.setLastLoad(json.data.id,json.time);
            Controller.loadList();
            var dID = Helper.getIdFromString(Controller.location);
            var sID = Helper.getSecondIdFromString(Controller.location);
            var cID = Helper.getThirdIdFromString(Controller.location);
            if ( typeof dID == 'number' && !isNaN(dID) ) {
                View.activeDebate = dID;
            }
            View.loadDebates();
            if ( typeof sID == 'number' && !isNaN(sID) ) {
                if ( typeof cID == 'number' && !isNaN(cID) ) {
                    Controller.commentTarget = cID;
                }
                Controller.loadSolution(sID);
            }
        });
}

/** Async load Debates into Storage then trigger View for loading of debates.
 * This one is being called upon initialization. Loads the top node (ID 1).
 */
ClassController.prototype.loadDebates = function() {
    $.post("memplex.php",
        {id: 1,time:  Controller.lastLoad(1)},
        function(data) { // data returned by server
            var json = $.parseJSON(data);
            if ( json === null || json.data === null ) {
                return;
            }
            Controller.parseUser(json.user);
            Controller.parseMemplex(json.data,null);
            Controller.setLastLoad(json.data.id,json.time);
            Controller.loadList();
            View.loadDebates();
        });
}

/** Trigger loading of Lists.
 */
ClassController.prototype.loadList = function() {
    View.loadList(List.getNew(),'#listNew');
    View.loadList(List.getUnsolved(),'#listUnsolved');
    View.loadList(List.getLatest(),'#listLatest');
    View.loadList(List.getOwn(),'#listOwn');
}
   
/** Load solution into storage then trigger View for loading of commentTarget.
 * @see popCommentTarget() for further information.
 * @tparam ClassSolution solution Solution to load.
 * @tparam int target ID of the comment.
 */
ClassController.prototype.loadComment = function(solution,target) {
    this.commentTarget = target;
    this.loadSolution(solution);
}
    
/** Return the comment targetted by the last load and reset it.
 * @treturn string Comment targetted by the last load.
 */
ClassController.prototype.popCommentTarget = function() {
    var target = this.commentTarget;
    this.commentTarget = null;
    return target;
}
    
/** Load target Solution into Storage then trigger View for loading of solution.
 * @tparam ClassSolution target Solution to load.
 */
ClassController.prototype.loadSolution = function(target) {
    $.post("memplex.php",
        {id: target,time: Controller.lastLoad(target)},
        function(data) {
            var json = $.parseJSON(data);
            if ( json === null || json.data === null ) {
                return;
            }
            Controller.parseUser(json.user);
            Controller.parseMemplex(json.data,null);
            Controller.setLastLoad(json.data.id,json.time);
            Controller.loadList();
            View.loadSolution(json.data.id);
            Controller.commentTarget = null;
        });
}
    
/** Parse loaded User into ClassUser.
 * @tparam User data User to load.
 */
ClassController.prototype.parseUser = function(data) {
    if ( data.id == null
        || data.moderator == null ) {
        console.log('Faulty data',data);
        return;
    }
    User.set(data.id,data.moderator);
}

/** Parse loaded Memplexes into MemplexRegister.
 * @tparam Memplex data Memplex to load.
 * @tparam Memplex parent The parent Memplex.
 * @tparam boolean trace Determines if the last added memplex should be logged.
 */
ClassController.prototype.parseMemplex = function(data,parent,trace) {
    if ( data.id === 0
        || data.title === 0 
        || data.text === 0 
        || data.author === 0 ) {
        console.log('Faulty data',data,parent);
        return;
    }
    if ( trace === true ) {
        if ( parent === null ) {
            this.lastAdded = {};
        }
        this.lastAdded[Helper.objectCount(this.lastAdded)] = data.id;
    }
    if ( data.id == 1 ) {
        MemplexRegister = new ClassMemplexRegister();
        List = new ClassList();
    }
    MemplexRegister.add(data,parent);
    for ( c in data.children ) {
        Controller.parseMemplex(data.children[c],data,trace);
    }
}
    
/** Set the last loadtime for target.
 * @tparam int target Target ID.
 * @tparam int time Unix timestamp.
 */
ClassController.prototype.setLastLoad = function(target,time) {
    this.lastload[target] = time;
}
    
/** Get the last loadtime for target.
 * @tparam int target Target Memplex ID.
 * @treturn int The last loading timestamp.
 */
ClassController.prototype.lastLoad = function(target) {
    return this.lastload[target];
}
    
/** Store to a Memplex in the DB.
 * @tparam Memplex data The Memplex to store.
 */
ClassController.prototype.storeToMemplex = function(data) {
    if ( data == null ) {
        return;
    }
    $.post("memplex.php",
        data,
        function(data) {
            var json = $.parseJSON(data);
            Controller.parseUser(json.user);
            Controller.parseMemplex(json.data,null);
            Controller.setLastLoad(json.data.id,json.time);
            if ( json.createdid != null ) {
                Controller.commentTarget = json.createdid;
                View.activeDebate = json.createdid;
            }
            Controller.loadList();
            switch ( json.data.layer ) {
                case 1: View.loadDebates(); break; 
                case 4: View.loadSolution(json.data.id); break;
            }
            Controller.commentTarget = null;
        });
}
    
/** Create a specific form to add Memplexes.
 * @tparam string name CSS class name of the form.
 * @tparam string title User visible title.
 * @tparam string description User visible description of the form.
 * @tparam string[] strings I suppose those are the fucking labels in the form. But Justus hates writing documentation.
 * @tparam int parent ID of the parent Memplex.
 * @tparam int layer Layer of the new Memplex.
 * @tparam function callback
 */
ClassController.prototype.addForm = function(name,title,description,strings,parent,layer,callback) {
    var content = $('<div class="' + name + '">');

    $('<p>' + description + '</p>').appendTo(content);
    $('<p id="' + name + 'error" class="formerror"></p>').appendTo(content);
 
    var span;
 
    span = $('<span>').appendTo(content);
    $('<span>' + strings[0] + '</span>').appendTo(span);
    if ( parent != null ) {
        $('<input id="' + name + 'parent" type="hidden" value="' + parent + '">').appendTo(span);
    }
    if ( layer != null ) {
        $('<input id="' + name + 'layer" type="hidden" value="' + layer + '">').appendTo(span);
    }
    $('<input id="' + name + 'title" type="text"><br>').appendTo(span);

    span = $('<span>').appendTo(content);
    $('<span>' + strings[1] + '</span>').appendTo(span);
    $('<textarea id="' + name + 'text" rows="20" cols="50"></textarea><br>').appendTo(span);

    if ( strings[2] != null ) {
        Filter.refreshFilters();
        span = $('<span>').appendTo(content);
        $('<span>' + strings[2] + '</span>').appendTo(span);
        Filter.getFilterSelector('' + name + 'filter',null).appendTo(span);
    }
    
    var buttons = {};
    buttons[Helper.getLang('lang_confirm')] = callback;
    buttons[Helper.getLang('lang_cancel')] = function() {
        $( this ).dialog( 'close' );
    };
    
    View.popup(
        'auto',
        800, // Workaround for 3 year old jqueryUi bug... http://bugs.jqueryui.com/ticket/4820
        title,
        content,
        buttons,
        name + 'parent');
}
    
/** Creates a new Debate.
 */
ClassController.prototype.addDebate = function() {
    this.addForm('adddebate',Helper.getLang('lang_newDebateCreate'),Helper.getLang('lang_helpNewDebate'),[Helper.getLang('lang_titleDebate'),Helper.getLang('lang_textDebate'),Helper.getLang('lang_topics')],null,null,function() {
        var bad = false;

        var error = $('#adddebateerror').empty();

        var filter = $('#adddebatefilter');
        var title = $('#adddebatetitle');
        var text = $('#adddebatetext');

        filter.parent().parent().removeClass('formerror');
        title.parent().removeClass('formerror');
        text.parent().removeClass('formerror');

        var parents = Filter.getSelected('adddebatefilter');

        if ( title.val() == '' ) {
            bad = true;
            title.parent().addClass('formerror');
            $('<p>'+Helper.getLang('lang_errorDebateTitle')+'</p>').appendTo(error);
       }
        if ( text.val() == '' ) {
            bad = true;
            text.parent().addClass('formerror');
            $('<p>'+Helper.getLang('lang_debateDescription')+'</p>').appendTo(error);
        }
        if ( Helper.objectCount(parents) == 0 ) {
            bad = true;
            filter.parent().parent().addClass('formerror');
            $('<p>'+Helper.getLang('lang_debateFilter')+'</p>').appendTo(error);
        }

        if ( bad == true ) {
            return;
        }
        var out = {
            'parent[]': parents,
            'title': title.val(),
            'text': text.val(),
            'layer': 3,
            'loadid': 1
        };
        Controller.storeToMemplex(out);
        $( this ).dialog( 'close' );
    });
}

/** Create a new Solution.
 * @tparam int debateid ID of the Memplex we want to add a solution to.
 */
ClassController.prototype.addSolution = function(debateid) {
    this.addForm('addsolution',Helper.getLang('lang_newSolution'),Helper.getLang('lang_helpNewSolution'),[Helper.getLang('lang_titleSolution'),Helper.getLang('lang_textSolution')],debateid,null,function() {
        var bad = false;

        var error = $('#addsolutionerror').empty();

        var parent = $('#addsolutionparent');
        var title = $('#addsolutiontitle');
        var text = $('#addsolutiontext');

        title.parent().removeClass('formerror');
        text.parent().removeClass('formerror');

        if ( parent.val() == '' ) {
            bad = true;
            title.parent().addClass('formerror');
            $('<p>'+Helper.getLang('lang_errorParent')+'</p>').appendTo(error);
        }

        if ( title.val() == '' ) {
            bad = true;
            title.parent().addClass('formerror');
            $('<p>'+Helper.getLang('lang_errorDebateTitle')+'</p>').appendTo(error);
        }
        if ( text.val() == '' ) {
            bad = true;
            text.parent().addClass('formerror');
            $('<p>'+Helper.getLang('lang_solutionDescription')+'</p>').appendTo(error);
        }

        if ( bad == true ) {
            return;
        }
        var out = {
            'parent[]': [parent.val()],
            'title': title.val(),
            'text': text.val(),
            'layer': 4,
            'loadid': 1
        };
        Controller.storeToMemplex(out);
        $( this ).dialog( 'close' );
    });
}

/** Creates a new comment or argument.
 */
ClassController.prototype.addComment = function(solutionid,layer) {
    var title = '';
    switch ( layer ) {
        case 5: title = Helper.getLang('lang_argPro'); break;
        case 6: title = Helper.getLang('lang_argCon'); break;
        case 7: 
        case 8: title = Helper.getLang('lang_argNeut'); break;
    }
    this.addForm('addcomment',title,Helper.getLang('lang_helpNewComment'),[Helper.getLang('lang_titleComment'),Helper.getLang('lang_textComment')],solutionid,layer,function() {
        var bad = false;

        var error = $('#addcommenterror').empty();

        var parent = $('#addcommentparent');
        var layer = $('#addcommentlayer');
        var title = $('#addcommenttitle');
        var text = $('#addcommenttext');

        title.parent().removeClass('formerror');
        text.parent().removeClass('formerror');

        if ( parent.val() == '' ) {
            bad = true;
            title.parent().addClass('formerror');
            $('<p>'+Helper.getLang('lang_errorParent')+'</p>').appendTo(error);
        }

        if ( layer.val() == '' ) {
            bad = true;
            title.parent().addClass('formerror');
            $('<p>'+Helper.getLang('lang_errorLayer')+'</p>').appendTo(error);
        }

        var type = '';
        switch ( layer.val() ) {
            case '5': 
            case '6': 
            case '7': type = Helper.getLang('lang_yArg'); break;
            case '8': type = Helper.getLang('lang_yAnsw'); break;
        }

        if ( title.val() == '' ) {
            bad = true;
            title.parent().addClass('formerror');
            $('<p>Bitte gib einen Titel für ' + type + ' an!</p>').appendTo(error);
        }
        if ( text.val() == '' ) {
            bad = true;
            text.parent().addClass('formerror');
            $('<p>Bitte beschreibe ' + type + ' in einigen Sätzen!</p>').appendTo(error);
        }

        if ( bad == true ) {
            return;
        }
        var out = {
            'parent[]': [parent.val()],
            'title': title.val(),
            'text': text.val(),
            'layer': layer.val(),
            'loadid': View.activesolution
        };
        Controller.storeToMemplex(out);
        $( this ).dialog( 'close' );
    });
}

/** @class ClassUser
 * ClassUser contains all Userdata loaded from the server.
 * During runtime it can be accessed using the static User object.
 */
function ClassUser() {
    this.moderator = false;
    this.id = 0;
}

var User = new ClassUser();

/** Set Userdata.
 * @tparam int userid ID of the user.
 * @tparam boolean moderator Moderator flag.
 */
ClassUser.prototype.set = function(id,moderator) {
    this.id = id;
    this.moderator = moderator;
}

/** Get User ID.
 * @treturn int id Userid.
 */
ClassUser.prototype.getId = function() {
    return this.id;
}

/** Get Moderatorstatus.
 * @treturn boolean moderator Moderator flag.
 */
ClassUser.prototype.getModerator = function() {
    return this.moderator;
}

/** @class ClassMemplexRegister
 * ClassMemplexRegister contains all Memplexes loaded from the server.
 * During runtime the register can be accessed using the static MemplexRegister object.
 */
function ClassMemplexRegister() {
    /** Object stores loaded Memplexes.*/
    this.memplexes = {};
    /** Object storing parents for each Memplex.  */
    this.parentlist = {};
    /** Object storing Memplex IDs for each layer. */
    this.layerlist = {};
    /** TODO: Justus says we don't need it. / Now I'm not sure anymore. *sigh* */
    this.layerlistreverse = {};
}

var MemplexRegister = new ClassMemplexRegister();

/** Add a new Memplex to the Register.
 * @tparam Memplex memplex Memplex to be added.
 * @tparam Memplex parent Parent of the new Memplex.
 */
ClassMemplexRegister.prototype.add = function(memplex,parent) {
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
        this.layerlist[memplex.layer][Helper.objectCount(this.layerlist[memplex.layer])] = memplex.id;
    }
    
    this.memplexes[memplex.id] = new function() {
        this.id = memplex.id;
        this.author = memplex.author;
        this.title = memplex.title;
        this.text = memplex.text;
        this.layer = memplex.layer;
        this.favored = memplex.favored;
        this.selffavored = memplex.selffavored;
        this.moderationstate = memplex.moderationstate;
        this.children = {};
        for ( c in memplex.children ) {
            this.children[c] = memplex.children[c].id;
        }
    }
    List.add(memplex);
}

/** Get all MemplexIDs with the param layer.
 * @tparam int layer The layer to be loaded.
 * @treturn Array MemplexIDs with targeted layer.
 */
ClassMemplexRegister.prototype.getLayer = function(layer) {
    return this.layerlist[layer];
}

/** Reset MemplexRegister.
 */
ClassMemplexRegister.prototype.reset = function() {
    this.memplexes = {};
    this.parentlist = {};
    this.layerlist = {};
    this.layerlistreverse = {};
}

/** Get all ParentIDs for the specified MemplexID.
 * @tparam int id The id of the Child to be loaded.
 * @treturn Array MemplexIDs with targeted child.
 */
ClassMemplexRegister.prototype.getParents = function(id) {
    return this.parentlist[id];
}

/** Get the Memplex with the specified id.
 * @tparam int id The ID of the Memplex to be loaded.
 * @treturn Memplex Memplex with targeted id.
 */
ClassMemplexRegister.prototype.get = function(id) {
    return this.memplexes[id];
}


/** @class ClassView
 * ClassViewS controls all visual activities.
 * During runtime the view can be accessed using the static View object.
 */
function ClassView() {
    /** Button to load the current solution. */
    this.solutionbutton = null;
    this.activesolution = null;
}

/** Static View object.
 */
var View = new ClassView();

/** Sets up the main view.
 * This one is being called upon initialization.
 */
ClassView.prototype.layout = function() {
    View.layoutobject = $('#container').layout({
        applyDefaultStyles: true,
        west__minSize: 380,
        north__minSize: 36,
        west__size: 'auto',
        enableCursorHotkey: false,
        defaults: {
            togglerLength_open: -1,
            togglerLength_closed: -1,
            spacing_closed: 10,
            spacing_open: 10
        }
    });
    View.layoutobject.allowOverflow('west');
    
    $('<ul id="listul">').appendTo('#list');
    
    $('<li><a href="#listNew">' + Helper.getLang('lang_listNew') + '</a></li>')
        .appendTo('#listul');
    $('<li><a href="#listLatest">' + Helper.getLang('lang_listLatest') + '</a></li>')
        .appendTo('#listul');
    $('<li><a href="#listUnsolved">' + Helper.getLang('lang_listUnsolved') + '</a></li>')
        .appendTo('#listul');
    $('<li><a href="#listOwn">' + Helper.getLang('lang_listOwn') + '</a></li>')
        .appendTo('#listul');
    $('<div id="listNew">').appendTo('#list');
    $('<div id="listLatest">').appendTo('#list');
    $('<div id="listUnsolved">').appendTo('#list');
    $('<div id="listOwn">').appendTo('#list');
    
    $('#list').tabs().removeClass('ui-corner-all');
}

/** Loads all memplexes in the list into their respective div.
 */
ClassView.prototype.loadList = function(memplexes,list) {
    $(list)
        .empty();

    var mycontent = $('<div>').appendTo(list);

    var i = -1;
    var act = i;
    for ( m in memplexes ) {
        i++;
        var debate = new ClassDebate(MemplexRegister.get(memplexes[m]),false);
        // TODO: Decide if filters apply to quicklists.
        // if ( !debate.matchFilter() ) {
            // continue;
        // }
        if ( this.activeDebate == debate.memplex.id ) {
            act = i;
        }
        debate.appendTo(mycontent);
    }
    if ( act == -1 ) {
        act = false;
    }
    mycontent.accordion({
        collapsible: true,
        active: act,
        autoHeight: false,
        change: function(event,ui) {
            View.activeDebate = Helper.getIdFromString(ui.newContent.attr('id'));
            // TODO: Sanitize...
            View.loadDebates();
        }
    });
};

/** Loads all debates into content.
 */
ClassView.prototype.loadDebates = function() {
    if ( View.activecommentbutton != null ) {
        View.activecommentbutton.remove();
    }
    $('#content')
        .empty();

    $('<div>')
        .attr('id','activefilterlist')
        .appendTo('#content');
    Filter.printFilters();

    var mycontent = $('<div id="mycontent">').appendTo('#content');

    var memplexes = MemplexRegister.getLayer(3);
    var i = -1;
    var act = i;
    for ( m in memplexes ) {
        i++;
        var debate = new ClassDebate(MemplexRegister.get(memplexes[m]));
        if ( !debate.matchFilter() ) {
            continue;
        }
        if ( this.activeDebate == debate.memplex.id ) {
            act = i;
        }
        debate.appendTo(mycontent);
    }
    if ( act == -1 ) {
        act = false;
    }
    mycontent.accordion({
        collapsible: true,
        active: act,
        change: function(event,ui) {
            View.activeDebate = Helper.getIdFromString(ui.newContent.attr('id'));
        }
    });
};

/** Loads a solution into content.
 * @tparam int target The ID of the target solution Memplex.
 */
ClassView.prototype.loadSolution = function(target) {
    var content = $('#content').empty();

    var solution = MemplexRegister.get(target);
    this.activesolution = target;

    if ( this.solutionbutton != null ) {
        this.solutionbutton.remove();
    }
    if ( View.activecommentbutton != null ) {
        View.activecommentbutton.remove();
    }

    if ( this.commentbutton != null ) {
        this.commentbutton.remove();
    }
    this.solutionbutton = $('<button id="solution' + solution.id + 'button">' + solution.title + '</button>')
        .appendTo('#menu')
        .click(function(data) {
            var id = Helper.getIdFromString(data.currentTarget.id);
            Controller.loadSolution(id);
        })
        .button()
        .addClass('mybutton');

    var tmp = new ClassSolution(solution);
    tmp.getObject().appendTo(content);

    var target = Controller.popCommentTarget();
    if ( target != null ) {
        tmp.showComment(target);
    }
};

ClassView.prototype.paintCommentButton = function(solution,comment) {
    if ( this.commentbutton != null ) {
        this.commentbutton.remove();
    }
    // this.commentbutton = $('<button id="solution' + solution.id + 'comment' + comment.id + 'button">Argument: ' + comment.title + '</button>')
        // .appendTo('#menu')
        // .click(function(data) {
            // var solution = Helper.getIdFromString(data.currentTarget.id);
            // var comment = Helper.getSecondIdFromString(data.currentTarget.id);
            // Controller.loadComment(solution,comment);
        // })
        // .button()
        // .addClass('mybutton');
}

/** Paints the primary menubuttons.
 * This one is being called upon initialization.
 */
ClassView.prototype.paintButtons = function() {
    Helper.createButton(Helper.getLang('lang_logout'),null,'#menu','floatleft',function(data) {
        window.location = '?action=logout';
    });
    Helper.createButton(Helper.getLang('lang_newDebate'),'ui-icon-plus','#menu','floatleft',function(data) {
        Controller.addDebate();
    });
    Helper.createButton(null,'ui-icon-refresh','#menu','floatleft',function(data) {
        Controller.loadDebates();
    });
    Helper.createButton(Helper.getLang('lang_debate'),null,'#menu','floatleft',function(data) {
        View.loadDebates();
    });
    Helper.createButton(Helper.getLang('lang_filterSelect'),null,'#menu','floatright',function(data) {
        Filter.createNewObject();
    });
}

/** Create a popup.
 * @tparam string height HTML height.
 * @tparam string width HTML width.
 * @tparam string title User visible title of the popup. 
 * @tparam string content The actual content of the popup.
 * @tparam array button Array of (button label, callback function) tuples.
 * @tparam string focus Element to focus.
*/
ClassView.prototype.popup = function(height,width,title,content,button,focus) {
    $('#viewpopup').remove();
    
    var popup = $('<div id="viewpopup" title="' + title + '">')
       .dialog({
            resizable: false,
            autoOpen: false,
            position: 'top',
            maxWidth: 800,
            height: height,
            width: width,
            modal: true,
            buttons: button
        });
    if ( content != null ) {
        content.appendTo(popup);
    }
    popup.dialog("open");
    if ( focus != null ) {
        $('#' + focus).focus();
    }
}

/** @class ClassSolutionRegister
 * ClassSolutionRegister contains all loaded solutions.
 * During runtime the register can be accessed using the static SolutionRegister object.
 */
function ClassSolutionRegister() {
    this.solutions = {};
}

/** Static SolutionRegister object.
 */
var SolutionRegister = new ClassSolutionRegister();

/** Add a solution to the register.
 * @tparam int id Id to be added.
 * @tparam ClassSolution solution Solution to be added.
 */
ClassSolutionRegister.prototype.add = function(id,solution) {
    this.solutions[id] = solution;
}

/** Get a solution from the register.
 * @tparam int id Id to be fetched.
 * @treturn Solution Selected Solution.
 */
ClassSolutionRegister.prototype.get = function(id) {
   return this.solutions[id];
}

/** @class ClassSolution
 * ClassSolution represents a solution.
 * @tparam Memplex Memplex Memplex of the solution.
 */
function ClassSolution(Memplex) {
    this.memplex = Memplex;
    this.object = null;
    this.text = null;
    this.list = null;
    this.pro = null;
    this.neutral = null;
    this.contra = null;
    this.activecomment = null;
    this.hidden = {};

    this.object = $('<div id="solution' + this.memplex.id + '" class="solution">');
    this.text = $('<div id="solution' + this.memplex.id + 'text" class="solutiontext">').appendTo(this.object);
    this.list = $('<div id="solution' + this.memplex.id + 'list" class="solutionlist">').appendTo(this.object);
    this.pro = $('<ul id="solution' + this.memplex.id + 'pro" class="solutionpro">').appendTo(this.list);
    this.neutral = $('<ul id="solution' + this.memplex.id + 'neutral" class="solutionneutral">').appendTo(this.list);
    this.contra = $('<ul id="solution' + this.memplex.id + 'contra" class="solutioncontra">').appendTo(this.list);

    Helper.window($('<div class="padded bigfont">' + this.memplex.title + '</div>').appendTo(this.text),'all');
    Helper.window($('<div class="padded">' + this.memplex.text + '</div>').appendTo(this.text),'all');

    Helper.window(this.pro);
    Helper.window(this.neutral);
    Helper.window(this.contra);

    this.loadArguments();

    if ( this.pro.children().length == 0 ) {
        $('<span>'+Helper.getLang('lang_noArgPro')+'</p>').appendTo(this.pro);
    }
    if ( this.neutral.children().length == 0 ) {
        $('<span>'+Helper.getLang('lang_noArgNeut')+'</p>').appendTo(this.neutral);
    }
    if ( this.contra.children().length == 0 ) {
        $('<span>'+Helper.getLang('lang_noArgCon')+'</p>').appendTo(this.contra);
    }

    // var buttonpro = $('<div id="solution' + this.memplex.id + 'buttonspro"></div><br>').appendTo(this.pro);
    // var buttonneutral = $('<div id="solution' + this.memplex.id + 'buttonsneutral"></div><br>').appendTo(this.neutral);
    // var buttoncontra = $('<div id="solution' + this.memplex.id + 'buttonscontra"></div><br>').appendTo(this.contra);

    // Pro Button
    Helper.createButton(Helper.getLang('lang_argPro'),null,this.text,'floatleft',this.buttonCallback,'debate' + this.memplex.id + 'buttonadd' + 5);
    // Neutral Button
    Helper.createButton(Helper.getLang('lang_argNeut'),null,this.text,'floatleft',this.buttonCallback,'debate' + this.memplex.id + 'buttonadd' + 7);
    // Contra Button
    Helper.createButton(Helper.getLang('lang_argCon'),null,this.text,'floatleft',this.buttonCallback,'debate' + this.memplex.id + 'buttonadd' + 6);

    Moderator.getButton(this.memplex.id,this.text);
    
    SolutionRegister.add(this.memplex.id,this);
}

/** Adds comment after OK button has been clicked.
 */
ClassSolution.prototype.buttonCallback = function() {
    var id = Helper.getIdFromString($( this ).attr('id'));
    var layer = Helper.getSecondIdFromString($( this ).attr('id'));
    Controller.addComment(id,layer);
};

/** Bring the target comment up front.
 * @tparam int id ID of the Memplex representing the comment.
 */
ClassSolution.prototype.showComment = function(id) {
    if ( this.activecomment != null ) {
        $('#solution' + this.memplex.id + 'comment' + this.activecomment)
            .removeClass('ui-selected');
    }
    if ( View.activecommentbutton != null ) {
        View.activecommentbutton.remove();
    }
    
    this.activecomment = id;
    var a = $('#solution' + this.memplex.id + 'comment' + id);

    a.addClass('ui-selected')

    this.bubbleShow(a);

    var comment = MemplexRegister.get(id);
    if ( comment.layer >= 5 && comment.layer <= 7 ) {
        View.paintCommentButton(this.memplex,comment);
    }

    this.text.empty();

    Helper.window($('<div class="padded bigfont">' + comment.title + '</div>').appendTo(this.text),'all');
    Helper.window($('<div class="padded">' + comment.text + '</div>').appendTo(this.text),'all');
    
    View.activecommentbutton = Helper.createButton(
            Helper.getLang('lang_answer'),
            null,
            '#solution' + this.memplex.id + 'text',
            'floatright',
            this.buttonCallback,
            'comment' + id + 'buttonadd' + 8
    );
    Moderator.getButton(comment.id,'#solution' + this.memplex.id + 'text');
}

/** Walks through all parent comment nodes until it finds and shows the hidden topnode.
 * @tparam JQueryElement JQueryElement jQuery DOM document wrapper, see jQuery documentation.
 */
ClassSolution.prototype.bubbleShow = function(JQueryElement) {
    if ( JQueryElement.attr('class') != undefined 
        && ( JQueryElement.attr('class').search(/comment/) == -1 
        || ( JQueryElement.attr('id') != undefined && JQueryElement.attr('id').search(/hidden/) != -1 ) ) ) {
        Helper.show(JQueryElement);
        return;
    }
    this.bubbleShow(JQueryElement.parent());
}

/** Loads arguments into list.
 */
ClassSolution.prototype.loadArguments = function() {
    var childs = this.memplex.children;
    for ( c in childs ) {
        var child = MemplexRegister.get(childs[c]);
        if ( child == null ) {
            continue;
        }
        var li = $('<li class="solutionargumentli">');

        if ( child.layer == undefined ) {
            return;
        }

        switch ( child.layer ) {
            case 5: li.appendTo(this.pro); break;
            case 6: li.appendTo(this.contra); break;
            case 7: li.appendTo(this.neutral); break;
        }
        
        var parent = null;
        var parents = MemplexRegister.getParents(this.memplex.id);
        for ( p in parents ) {
            parent = parents[p];
        }
        
        var div = Helper.box(
            child.title,
            'solution' + this.memplex.id + 'comment' + child.id,
            li,
            '#debate' + parent + 'solution' + this.memplex.id + 'comment' + child.id,
            Helper.getRecursiveChildCount(child)
        )
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

        // TODO: Implement Support System here.
        var container = $('<div class="floatleft">').appendTo(div);
        
        $('<div class="floatleft">(' + child.favored + ')</div>')
            .appendTo(container);
        
        var star = $('<div id="solution' + this.memplex.id + 'comment' + child.id + 'star" class="star"></div>')
            .click(function(data) {
                var sID = Helper.getIdFromString($(this).attr('id'));
                var cID = Helper.getSecondIdFromString($(this).attr('id'));
                
                var state = 1;
                if( $(this).attr('class').match(/staryellow/) != null ) {
                    state = 0;
                }
                
                var out = {
                    'id': cID,
                    'parent': sID,
                    'favorite': state
                };
                
                Controller.storeToMemplex(out);
                
                return false;
            })
            .appendTo(container);
        
        if ( child.selffavored != 0 ) {
            star.addClass('staryellow');
        }

        this.hidden[child.id] = $('<div id="solution' + this.memplex.id + 'comment' + child.id + 'hidden" class="solutioncomment hidden">').appendTo(li);
        for ( c in child.children ) {
            var comment = MemplexRegister.get(child.children[c]);
            this.loadCommentsRecursive(comment,this.hidden[child.id]);
        }
    }
}

/** Loads comments.
 * @tparam Memplex memplex Current Memplex (comment).
 * @tparam Memplex parent Parent Memplex.
 */
ClassSolution.prototype.loadCommentsRecursive = function(memplex,parent) {
    var ul = $("<ul class=\"comment\">").appendTo(parent);
    var li = $("<li class=\"comment\">").appendTo(ul);

    var div = Helper.box(memplex.title,'solution' + this.memplex.id + 'comment' + memplex.id,li)
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
        this.loadCommentsRecursive(comment,li);
    }
}

/** Gets the JQuery HTML Object representation of the debate.
*/
ClassSolution.prototype.getObject = function() {
    return this.object;
}

/** @class ClassDebateRegister
 * ClassDebateRegister contains all loaded debates.
 * During runtime the register can be accessed using the static DebateRegister object.
 */
function ClassDebateRegister() {
    this.debates = {};
}

/** Static DebateRegister object.
 */
var DebateRegister = new ClassDebateRegister();

/** Adds a debate to the register.
 * @tparam int id Id to be added.
 * @tparam ClassDebate debate Debate to be added.
 */
ClassDebateRegister.prototype.add = function(id,debate) {
    this.debates[id] = debate;
}

/** Gets a debate from the register.
 * @tparam int id Id to be fetched.
 * @treturn ClassDebate Selected Debate.
 */
ClassDebateRegister.prototype.get = function(id) {
    return this.debates[id];
}


/** @class ClassDebate
 * ClassDebate represents a debate.
 * @ctor
 * Constructor.
 * @tparam Memplex memplex The memplex representing the new debate.
 */
function ClassDebate(memplex,full) {
    if ( memplex == null ) {
        return;
    }
    this.memplex = memplex;
    this.title = null;
    this.text = null;
    this.hide = null;
    this.ul = null;
    
    var adder = '';
    var categories = '';
    if ( full == null ) {
        adder = 'list';
        full = true;
        var parents = MemplexRegister.getParents(this.memplex.id);
        categories = '<div class="filtercategories"> (';
        for ( p in parents ) {
            var parent = MemplexRegister.get(parents[p]);
            categories = categories + parent.title + ',';
        }
        categories = categories.substr(0,categories.length-1) + ')</div>';
    }
    
    this.title = $('<h3 id="' + adder + 'debate' + this.memplex.id + 'title" class=""><a href="#debate' + this.memplex.id + '">' + this.memplex.title + categories + '</a></h3>');
    this.hide = $('<div id="' + adder + 'debate' + this.memplex.id + 'hide" class="hidden">');
    this.text = $('<div id="' + adder + 'debate' + this.memplex.id + 'text" class="debatetext">').appendTo(this.hide);
    
    Helper.window($('<div class="padded">' + this.memplex.text + '</div>').appendTo(this.text),'all');
    
    if ( full === false ) {
        return;
    }

    this.ul = $('<ul id="debate' + this.memplex.id + 'list" class="debatelist">').appendTo(this.hide);

    var childs = this.memplex.children;

    for ( c in childs ) {
        var child = MemplexRegister.get(childs[c]);
        var li = $('<li id="solution' 
            + child.id 
            + '" class="padded debatesolution"><a href="#debate' 
            + this.memplex.id 
            + 'solution' 
            + child.id 
            + '">' 
            + child.title 
            /* TODO: Insert once child count is available at this stage?
             (' 
            + Helper.getRecursiveChildCount(child) 
            + ')
            */
            + '</a></li>')
            .appendTo(this.ul)
            .click(function(data) {
                var id = Helper.getIdFromString(data.currentTarget.id);
                Controller.loadSolution(id);
            });
        Helper.window(li,'all');
    }

    var buttoncontainer = $('<div id="debate' + this.memplex.id + 'buttons">').appendTo(this.hide);
    // text,icon,append,floatdirection,callback,id
    Helper.createButton(Helper.getLang("lang_solutionAdd"),null,buttoncontainer,'floatleft',function(data) {
        var id = Helper.getIdFromString($( this ).attr('id'));
        Controller.addSolution(id);
    },'debate' + this.memplex.id + 'buttonadd');
    Moderator.getButton(this.memplex.id,buttoncontainer);

    $('<br>').appendTo(buttoncontainer);
    $('<div class="clear">').appendTo(this.hide);

    DebateRegister.add(memplex.id,this);
}

/** Appends the JQuery HTML Object representation of the debate to the given JQuery object.
 * @tparam JQuery_HTML_Object object Object to work on.
 */
ClassDebate.prototype.appendTo = function(object) {
    this.title.appendTo(object);
    this.hide.appendTo(object);
}

/** Checks if debate matches the current filter.
 * @treturn boolean True if it is a match, else false.
 */
ClassDebate.prototype.matchFilter = function() {
    var parents = MemplexRegister.getParents(this.memplex.id);
    return Filter.match(parents);
}

/** @class ClassFilter
 * ClassFilter implements filtering of debates.
 * During runtime the filter can be accessed using the static Filter object.
 */
function ClassFilter() {
    /**  */
    this.filters = {};
    /** AND filters. */
    this.allof = {};
    /** OR filters. */
    this.oneof = {};
    /**  */
    this.mine = {};
}

/** Static Filter object.
 */
var Filter = new ClassFilter();

/** Checks if debate matches the current filter.
 * @tparam int[] nodes List of Memplex IDs.
 * @treturn boolean True if it is a match, else false.
 */
ClassFilter.prototype.match = function(nodes) {
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

    var match = false;

    for ( o in oneof ) {
        if ( nodes[oneof[o]] == undefined ) {
            continue;
        }
        match = true;
        break;
    }
    if ( Helper.objectCount(mine) == 0 ) {
        return match;
    }
    // check if node is contained in mine.
}

/** Prints active filters.
 */
ClassFilter.prototype.printFilters = function() {
    var list = $('#activefilterlist').empty();

    var allof = $('<p>').appendTo(list);
    $('<br>').appendTo(list);
    var oneof = $('<p>').appendTo(list);
    $('<br>').appendTo(list);

    $('<p>All of:</p>').appendTo(allof);
    $('<p>One of:</p>').appendTo(oneof);

    for ( a in this.allof ) {
        var m = MemplexRegister.get(this.allof[a]);
        Helper.window($('<p>' + m.title + '</p>').appendTo(allof),'all');
    }

    for ( o in this.oneof ) {
        var m = MemplexRegister.get(this.oneof[o]);
        Helper.window($('<p>' + m.title + '</p>').appendTo(oneof),'all');
    }
}

/** Reloads available filters.
 */
ClassFilter.prototype.refreshFilters = function() {
    this.filters = {};
    var filters = MemplexRegister.getLayer(2);

    for ( f in filters ) {
        var tmp = MemplexRegister.get(filters[f]);
        this.filters[Helper.objectCount(this.filters)] = tmp;
    }
}

/** Generates HTML code to display available filters, depending on their status.
 * @treturn string HTML code.
 */
ClassFilter.prototype.getFilterSelector = function(id,callback,check) {
    if ( check == null ) {
        check = {};
    }

    var content = $('<div>');
    var list = $('<ul id="' + id + '">')
        .addClass('filterlist')
        .appendTo(content);

    for ( f in this.filters ) {
        var li = $('<li id="filterListElement' + this.filters[f].id + '">' 
            + this.filters[f].title 
            + '</li>')
            .appendTo(list)
            .addClass('ui-widget-content filterlistelement');
        for ( c in check ) {
            if ( check[c] == this.filters[f].id ) {
                li.addClass('ui-selected');
                break;
            }
        }
    }

    list.selectable({
        stop: callback
    });

    return content;
}

/** Callback method for the AND filter.
 */
ClassFilter.prototype.allofCallback = function() {
    Filter.allof = Filter.getSelected($( this ));
    Filter.printFilters();
}

/** Callback method for the OR filter.
 */
ClassFilter.prototype.oneofCallback = function() {
    Filter.oneof = Filter.getSelected($( this ));
    Filter.printFilters();
}

/** Gets the Object representation of the new filter form.
 */
ClassFilter.prototype.createNewObject = function() {
    this.refreshFilters();

    var content = $('<div>');

    $('<p>'+Helper.getLang('lang_multiFilter')+'</p>').appendTo(content);

   $('<h4>'+Helper.getLang('lang_allFilter')+'</h4>').appendTo(content);
   this.getFilterSelector('filterAllOf',this.allofCallback,this.allof).appendTo(content);
    $('<br><br><h4>'+Helper.getLang('lang_minFilter')+'</h4>').appendTo(content);
    this.getFilterSelector('filterOneOf',this.oneofCallback,this.oneof).appendTo(content);
    
    var buttons = {};
    buttons[Helper.getLang('lang_confirm')] = function() {
        View.loadDebates();
        $( this ).dialog( 'close' );
    };
    
    View.popup(
        'auto',
        800, // Workaround for 3 year old jqueryUi bug... http://bugs.jqueryui.com/ticket/4820
        Helper.getLang('lang_filter'),
        content,
        buttons);
}

/** Returns the IDs of the selected filters.
 * @tparam object/int id Objects or IDs to check for selection.
 * @treturn int[] Found IDs.
 */
ClassFilter.prototype.getSelected = function(id) {
    var found = null;
    if ( typeof id == 'object' ) {
        found = id.find('.ui-selected');
    } else {
        found = $('#' + id).find('.ui-selected');
    }
    var i = -1;
    var z = 0;
    var ret = [];
    while ( ++i < found.length ) {
        ret[z++] = Helper.getIdFromString(found[i].id);
    }
    return ret;
}

/** @class ClassList
 * ClassList manages the list data in the west panel.
 * During runtime the Lists can be accessed using the static List object.
 */
function ClassList() {
    this.defaultLength = 10;
    this.listNew = [];
    this.listNewObjects = {};
    this.listLatest = [];
    this.listLatestObjects = {};
    this.listLatestObjectsReverse = {};
    this.listUnsolved = [];
    this.listUnsolvedObjects = {};
    this.listOwn = [];
    this.listOwnObjects = {};
}

/** Static List object.
 */
var List = new ClassList();

/** Adds the Memplex into the new list as necessary.
 * @tparam Memplex memplex to be added as necessary.
 */
ClassList.prototype.addNew = function(memplex) {
    var addall = false;
    // If list is shorter than wanted, just add everything that isn't in it yet
    if ( this.listNew.length < this.defaultLength ) {
        addall = true;
    }
    // If memplex is newer than oldest listentry delete oldest and add newer.
    if ( addall || memplex.id > this.listNew[0] ) {
        this.addSorted(this.listNew,this.listNewObjects,memplex.id);
    }
}

/** Adds the Memplex into the own list as necessary.
 * @tparam Memplex memplex to be added as necessary.
 */
ClassList.prototype.addOwn = function(memplex) {
    if ( memplex.author.id != User.getId() ) {
        return;
    }
    var addall = false;
    // If list is shorter than wanted, just add everything that isn't in it yet
    if ( this.listOwn.length < this.defaultLength ) {
        addall = true;
    }
    // If memplex is newer than oldest listentry delete oldest and add newer.
    if ( addall || memplex.id > this.listOwn[0] ) {
        this.addSorted(this.listOwn,this.listOwnObjects,memplex.id);
    }
}

/** Adds the Memplex into the unsolved list as necessary.
 * @tparam Memplex memplex to be added as necessary.
 */
ClassList.prototype.addUnsolved = function(memplex) {
    var addall = false;
    // If list is shorter than wanted, just add everything that isn't in it yet
    if ( this.listUnsolved.length < this.defaultLength ) {
        addall = true;
    }
    // If memplex is newer than oldest listentry delete oldest and add newer.
    if ( addall || memplex.id > this.listUnsolved[0] ) {
        this.addSorted(this.listUnsolved,this.listUnsolvedObjects,memplex.id);
    }
}

/** Adds the Memplex or its parent into the latest list as necessary.
 * @tparam Memplex memplex to be added as necessary.
 * @tparam int overwrite ID to be overwritten in the lists.
 */
ClassList.prototype.addLatest = function(memplex,overwrite) {
    if ( overwrite == null ) {
        overwrite = memplex.id;
    }
    if ( memplex.layer > 3 ) {
        var parents = MemplexRegister.getParents(memplex.id);
        var parent = null;
        for ( p in parents ) {
            var tmp = MemplexRegister.get(parents[p]);
            if ( tmp.layer == memplex.layer - 1 ) {
                parent = tmp;
                break;
            }
        }
        if ( parent == null ) {
            return;
        }
        return this.addLatest(parent,overwrite);
    }
    
    var addall = false;
    // If list is shorter than wanted, just add everything that isn't in it yet
    if ( this.listLatest.length < this.defaultLength ) {
        addall = true;
    }
    // If memplex is newer than oldest listentry delete oldest and add newer.
    if ( addall || memplex.id > this.listLatest[0] ) {
        this.addSorted(this.listLatest,this.listLatestObjects,memplex.id,overwrite,this.listLatestObjectsReverse);
    }
}

/** Adds the Memplex into all necessary lists.
 * @tparam Memplex memplex to be added as necessary.
 */
ClassList.prototype.add = function(memplex) {
    switch ( memplex.layer ) {
        case 3:
            this.addOwn(memplex);
            this.addNew(memplex);
            if ( Helper.objectCount(memplex.children) == 0 ) {
                this.addUnsolved(memplex);
            }
        break;
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            this.addLatest(memplex);
        break;
        default:
        return;
    }
}

/** Adds the Memplex into the specified lists and sorts them.
 * @tparam array sorted Sorted List.
 * @tparam object unsorted Unsorted List.
 * @tparam int id Memplex ID to be added.
 * @tparam int overwrite ID to be overwritten in the lists.
 * @tparam array reverse XXX: whatever, it is too hot to write documentation.
 */
ClassList.prototype.addSorted = function(sorted,unsorted,id,overwrite,reverse) {
    if ( overwrite == null ) {
        overwrite = id;
    }
    if ( unsorted[overwrite] == id ) {
        return;
    }
    unsorted[overwrite] = id;
    
    if ( reverse != null ) {
        if ( reverse[id] != null ) {
            return;
        }
        reverse[id] = overwrite;
    }
    
    sorted[sorted.length] = overwrite;
    sorted.sort(function (a,b) {
        return a - b;
    });
    if ( sorted.length > this.defaultLength ) {
        delete(unsorted[sorted.shift()]);
    }
}

/** Get the new Memplexes list.
 * @treturn object Sorted List.
 */
ClassList.prototype.getNew = function() {
    var tmp = {};
    for ( l in this.listNew ) {
        tmp[this.listNew[l]] = this.listNew[l];
    }
    return tmp;
}

/** Get the latest Memplexes list.
 * @treturn object Sorted List.
 */
ClassList.prototype.getLatest = function() {
    var tmp = {};
    for ( l in this.listLatest ) {
        tmp[this.listLatestObjects[this.listLatest[l]]] = this.listLatestObjects[this.listLatest[l]];
    }
    return tmp;
}
/** Get the own Memplexes list.
 * @treturn object Sorted List.
 */
ClassList.prototype.getOwn = function() {
    var tmp = {};
    for ( l in this.listOwn ) {
        tmp[this.listOwn[l]] = this.listOwn[l];
    }
    return tmp;
}

/** Get the unsolved Memplexes list.
 * @treturn object Sorted List.
 */
ClassList.prototype.getUnsolved = function() {
    var tmp = {};
    for ( l in this.listUnsolved ) {
        tmp[this.listUnsolved[l]] = this.listUnsolved[l];
    }
    return tmp;
}

/** @class ClassModerator
 * ClassModerator manages the options and functions for moderators.
 * During runtime the Lists can be accessed using the static Moderator object.
 */
function ClassModerator() {
    
}

/** Static Moderator object.
 */
var Moderator = new ClassModerator();

/** Get the moderation button.
 * @tparam int ID MemplexID of the target object.
 * @tparam JQueryObject Object Target object for the button to be appended to.
 * @treturn object Button.
 */
ClassModerator.prototype.getButton = function(id,target) {
    if ( User.getModerator() != true ) {
        return null;
    }
    return Helper.createButton(Helper.getLang('lang_moderate'),null,target,'',function(data) {
        var target = Helper.getIdFromString($( this ).attr('id'));
        Moderator.moderate(target);
    },'#moderate' + id);
}

/** Main moderation dispatcher.
 * @tparam int ID MemplexID of the target object.
 */
ClassModerator.prototype.post = function(id,state,dialog) {
    var parents = MemplexRegister.getParents(id);
    var parent = 0;
    for ( p in parents ) {
        parent = parents[p];
    }
    var out = {
        'id': id,
        'parent': parent,
        'moderationstate': state
    };
    
    Controller.storeToMemplex(out);
    
    $( dialog ).dialog( 'close' );
}

/** Main moderation dispatcher.
 * @tparam int ID MemplexID of the target object.
 */
ClassModerator.prototype.moderate = function(id) {
    var content = $('<div>' + Helper.getLang('lang_moderateExplanation') + '<input type="hidden" id="moderationtarget" value="' + id + '"></div>"');
    var focus = null;
    
    var buttons = {};
    buttons[Helper.getLang('lang_moderateInactive')] = function(data) {
        Moderator.post($('#moderationtarget').attr('value'),1,this);
    };
    buttons[Helper.getLang('lang_moderateInappropriate')] = function(data) {
        Moderator.post($('#moderationtarget').attr('value'),2,this);
    };
    buttons[Helper.getLang('lang_cancel')] = function() {
        $( this ).dialog( 'close' );
    };
    
    View.popup(
        'auto',
        800, // Workaround for 3 year old jqueryUi bug... http://bugs.jqueryui.com/ticket/4820
        Helper.getLang('lang_moderate'),
        content,
        buttons,
        focus);
}