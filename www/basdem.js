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
        if ( string == null ) 
            string = "";
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
    this.window = function(object,rounded) {
        if ( rounded == true ) {
            object.addClass("ui-corner-top");
        }
        if ( rounded == 'all' ) {
            object.addClass("ui-corner-all");
        }
        object.addClass("ui-widget ui-widget-content");
    }
    
    /** Create a button.
    *   @param text     String Button text.
    *   @param icon     String jquery-ui icon name.
    *   @param append   jQuery Object to append the button to.
    *   @param floatdirection   String direction of the float.
    *   @param callback function callback
    *   @param id       String html id attribute.
    */
    this.createButton = function(text,icon,append,floatdirection,callback,id) {
        var showtext = true;
        if ( text == null ) {
            text = "&nbsp;";
            showtext = false;
        }
        return $('<button>' + text + '</button>')
            .button({
                text: showtext,
                icons: {
                    primary: icon
                }
            })
            .click(callback)
            .addClass(floatdirection + ' mybutton')
            .appendTo(append)
            .attr('id',id);
    }
    
    /** Classic Unix Timestamp.
    */
    this.time = function(date) {
        if ( date == null ) {
            date = new Date();
        }
        return Math.round(date.getTime() / 1000);
    }
}

var Controller = new function() {
    this.commentTarget = null;
    this.lastload = {};
    
    /** Async load Debates into Storage then trigger View for loading of debates.
    */
    this.loadDebates = function() {
        $.post("memplex.php",
            {id: 1,time:  Controller.lastLoad(1)},
            function(data) {
                var json = $.parseJSON(data);
                Controller.parseMemplex(json.data,null);
                Controller.setLastLoad(json.data.id,json.time);
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
            {id: target,time: Controller.lastLoad(target)},
            function(data) {
                var json = $.parseJSON(data);
                Controller.parseMemplex(json.data,null);
                Controller.setLastLoad(json.data.id,json.time);
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
    
    /** Set the last loadtime for target.
    *   @param target Target ID.
    */
    this.setLastLoad = function(target,time) {
        this.lastload[target] = time;
    }
    
    /** Get the last loadtime for target.
    *   @param target Target ID.
    *   @return int the last loading timestamp.
    */
    this.lastLoad = function(target) {
        return this.lastload[target];
    }
    
    /** Store to a memplex in the DB.
    */
    this.storeToMemplex = function(data) {
        if ( data == null ) {
            return;
        }
        $.post("memplex.php",
            data,
            function(data) {
                var json = $.parseJSON(data);
                Controller.parseMemplex(json.data,null);
                Controller.setLastLoad(json.data.id,json.time);
                if ( json.createdid != null ) {
                    Controller.commentTarget = json.createdid;
                    View.activeDebate = json.createdid;
                }
                switch ( json.data.layer ) {
                    case 1: View.loadDebates(); break; 
                    case 4: View.loadSolution(json.data.id); break;
                }
                Controller.commentTarget = null;
            });
    }
    
    /** Create a specific add form.
    */
    this.addForm = function(name,title,strings,parent,layer,callback) {
        var content = $('<div class="' + name + '">');
        
        $('<p>Hier könnte ihr Hilfetext stehen!</p>').appendTo(content);
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
        
        View.popup(
            'auto',
            800, // Workaround for 3 year old jqueryUi bug...
            title,
            content,
            {
                "Ok": callback,
                "Cancel": function() {
                    $( this ).dialog( "close" );
                }
            },name + 'parent');
    }
    
    /** Create a new Debate.
    */
    this.addDebate = function() {
        this.addForm('adddebate','Neue Debatte erstellen:',['Debatetitle','Debatetext','Filter'],null,null,function() {
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
                $('<p>Bitte gib einen Titel für deine Debatte an!</p>').appendTo(error);
            }
            if ( text.val() == '' ) {
                bad = true;
                text.parent().addClass('formerror');
                $('<p>Bitte beschreibe deine Debatte in einigen Sätzen!</p>').appendTo(error);
            }
            if ( Helper.objectCount(parents) == 0 ) {
                bad = true;
                filter.parent().parent().addClass('formerror');
                $('<p>Bitte wähle mindestens eine Filterkategorie aus!</p>').appendTo(error);
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
            $( this ).dialog( "close" );
        });
    }

    /** Create a new Solution.
    */
    this.addSolution = function(debateid) {
        this.addForm('addsolution','Neue Lösung erstellen:',['Solutiontitle','Solutiontext'],debateid,null,function() {
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
                $('<p>Es ist ein schwerer Fehler aufgetreten. Bitte Klicke auf Abbrechen!</p>').appendTo(error);
            }
            
            if ( title.val() == '' ) {
                bad = true;
                title.parent().addClass('formerror');
                $('<p>Bitte gib einen Titel für deine Lösung an!</p>').appendTo(error);
            }
            if ( text.val() == '' ) {
                bad = true;
                text.parent().addClass('formerror');
                $('<p>Bitte beschreibe deine Lösung in einigen Sätzen!</p>').appendTo(error);
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
            $( this ).dialog( "close" );
        });
    }

    /** Create a new Comment or Argument.
    */
    this.addComment = function(solutionid,layer) {
        var title = '';
        switch ( layer ) {
            case 5: title = 'Neues Pro Argument erstellen:'; break;
            case 6: title = 'Neues Contra Argument erstellen:'; break;
            case 7: title = 'Neues Neutrales Argument erstellen:'; break;
            case 8: title = 'Neuen Kommentar erstellen:'; break;
        }
        this.addForm('addcomment',title,['Title','Text'],solutionid,layer,function() {
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
                $('<p>Es ist ein schwerer Fehler aufgetreten. Bitte Klicke auf Abbrechen!</p>').appendTo(error);
            }
            
            if ( layer.val() == '' ) {
                bad = true;
                title.parent().addClass('formerror');
                $('<p>Es ist ein schwerer Fehler aufgetreten. Bitte Klicke auf Abbrechen!</p>').appendTo(error);
            }
            
            var type = '';
            switch ( layer.val() ) {
                case '5': type = 'dein Argument'; break;
                case '6': type = 'dein Argument'; break;
                case '7': type = 'dein Argument'; break;
                case '8': type = 'deinen Kommentar'; break;
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
            $( this ).dialog( "close" );
        });
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
            this.layerlist[memplex.layer][Helper.objectCount(this.layerlist[memplex.layer])] = memplex.id;
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
    this.activesolution = null;
    
    /** Load all debates into content.
    */
    this.loadDebates = function() {
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
            var debate = new Debate(MemplexRegister.get(memplexes[m]));
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
    
    /** Load a solution into content.
    *   @param target The ID of the target solution.
    */
    this.loadSolution = function(target) {
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
            .appendTo('#menuright')
            .click(function(data) {
                var id = Helper.getIdFromString(data.currentTarget.id);
                Controller.loadSolution(id);
            })
            .button()
            .addClass('mybutton');
        
        
        var tmp = new Solution(solution);
        tmp.getObject().appendTo(content);
        
        var target = Controller.popCommentTarget();
        if ( target != null ) {
            tmp.showComment(target);
        }
    };

    this.paintCommentButton = function(solution,comment) {
        if ( this.commentbutton != null ) {
            this.commentbutton.remove();
        }
        // this.commentbutton = $('<button id="solution' + solution.id + 'comment' + comment.id + 'button">Argument: ' + comment.title + '</button>')
            // .appendTo('#menuright')
            // .click(function(data) {
                // var solution = Helper.getIdFromString(data.currentTarget.id);
                // var comment = Helper.getSecondIdFromString(data.currentTarget.id);
                // Controller.loadComment(solution,comment);
            // })
            // .button()
            // .addClass('mybutton');
    }
    
    /** Paint the primary menubuttons.
    */
    this.paintButtons = function() {
        Helper.createButton(null,'ui-icon-minus','#menuleft','floatright',function(data) {
            Helper.menuleft = !Helper.menuleft;
            var tmp = $('#togglebutton').find('.ui-icon');
            if ( Helper.menuleft ) {
                $('#rightbox')
                    .addClass('widebox');
                $('#leftbox')
                    .addClass('slideout');
                $('#list')
                    .addClass('hidden');
                tmp.toggleClass('ui-icon-minus');
                tmp.toggleClass('ui-icon-plus');
            } else {
                $('#rightbox')
                    .removeClass('widebox');
                $('#leftbox')
                    .removeClass('slideout');
                $('#list')
                    .removeClass('hidden');
                tmp.toggleClass('ui-icon-minus');
                tmp.toggleClass('ui-icon-plus');
            }
        },'togglebutton');
        Helper.createButton(null,'ui-icon-refresh','#menuright','floatleft',function(data) {
            Controller.loadDebates();
        });
        Helper.createButton("Debatten",null,'#menuright','floatleft',function(data) {
            View.loadDebates();
        });
        Helper.createButton("Filter einstellen",null,'#menuright','floatright',function(data) {
            Filter.createNewObject();
        });
        Helper.createButton("Neue Debatte",'ui-icon-plus','#menuleft','floatleft',function(data) {
            Controller.addDebate();
        });
    }
    
    /** Create a popup.
    */
    this.popup = function(height,width,title,content,button,focus) {
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
            console.log(focus);
            $('#' + focus).focus();
        }
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
            $('<span>Noch keine Argumente daf&uuml;r</p>').appendTo(this.pro);
        }
        if ( this.neutral.children().length == 0 ) {
            $('<span>Noch keine neutralen Argumente</p>').appendTo(this.neutral);
        }
        if ( this.contra.children().length == 0 ) {
            $('<span>Noch keine Argumente dagegen</p>').appendTo(this.contra);
        }
        
        var buttonpro = $('<div id="solution' + this.memplex.id + 'buttonspro"></div><br>').appendTo(this.pro);
        var buttonneutral = $('<div id="solution' + this.memplex.id + 'buttonsneutral"></div><br>').appendTo(this.neutral);
        var buttoncontra = $('<div id="solution' + this.memplex.id + 'buttonscontra"></div><br>').appendTo(this.contra);
        
        // Pro Button
        Helper.createButton("Pro Argument hinzufügen",null,buttonpro,'floatleft',this.buttonCallback,'debate' + this.memplex.id + 'buttonadd' + 5);
        // Neutral Button
        Helper.createButton("Neutrales Argument hinzufügen",null,buttonneutral,'floatleft',this.buttonCallback,'debate' + this.memplex.id + 'buttonadd' + 7);
        // Contra Button
        Helper.createButton("Contra Argument hinzufügen",null,buttoncontra,'floatleft',this.buttonCallback,'debate' + this.memplex.id + 'buttonadd' + 6);
        
        SolutionRegister.add(this.memplex.id,this);
    }
    
    this.buttonCallback = function(data) {
        var id = Helper.getIdFromString($( this ).attr('id'));
        var layer = Helper.getSecondIdFromString($( this ).attr('id'));
        Controller.addComment(id,layer);
    };
    
    /** Bring the target comment up front.
    */
    this.showComment = function(id) {
        if ( this.activecomment != null ) {
            $('#solution' + this.memplex.id + 'comment' + this.activecomment)
                .removeClass('ui-selected');
        }
        if ( View.activecommentbutton != null ) {
            View.activecommentbutton.remove();
        }
        View.activecommentbutton = Helper.createButton(
                "Kommentar abgeben",
                null,
                '#menuright',
                'floatright',
                this.buttonCallback,
                'comment' + id + 'buttonadd' + 8
        );
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
                
            Helper.window(span,'all');
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
        
        
        var a = $('<a id="solution' + this.memplex.id + 'comment' + memplex.id + '" class="solutioncommentlink">' + memplex.title + '</a>')
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
        Helper.window(a,'all');
        
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
        
        var buttoncontainer = $('<div id="debate' + this.memplex.id + 'buttons">').appendTo(this.hide);
        // text,icon,append,floatdirection,callback,id
        Helper.createButton("Lösung hinzufügen",null,buttoncontainer,'floatleft',function(data) {
            var id = Helper.getIdFromString($( this ).attr('id'));
            Controller.addSolution(id);
        },'debate' + this.memplex.id + 'buttonadd');
        
        $('<br>').appendTo(buttoncontainer);
        $('<br>').appendTo(this.hide);
        
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
    this.filters = {};
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
    
    this.printFilters = function(remove) {
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
    
    this.refreshFilters = function() {
        this.filters = {};
        var filters = MemplexRegister.getLayer(2);
        
        for ( f in filters ) {
            var tmp = MemplexRegister.get(filters[f]);
            this.filters[Helper.objectCount(this.filters)] = tmp;
        }
    }
    
    this.getFilterSelector = function(id,callback,check) {
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
    
    this.allofCallback = function() {
        Filter.allof = Filter.getSelected($( this ));
        Filter.printFilters();
    }
    
    this.oneofCallback = function() {
        Filter.oneof = Filter.getSelected($( this ));
        Filter.printFilters();
    }
    
    /** Get the Object representation of the new filter form.
    */
    this.createNewObject = function() {
        this.refreshFilters();
        
        var content = $('<div>');
        
        $('<p>Dr&uuml;cke Strg um mehr als einen Filter auszuw&auml;hlen.<br>Achtung: &Auml;nderungen sind sofort wirksam!</p>').appendTo(content);
        
        $('<h4>Beitrag erfüllt alle hier ausgewählten Filter:</h4>').appendTo(content);
        this.getFilterSelector('filterAllOf',this.allofCallback,this.allof).appendTo(content);
        $('<br><br><h4>Beitrag erfüllt mindestens einen hier ausgewählten Filter:</h4>').appendTo(content);
        this.getFilterSelector('filterOneOf',this.oneofCallback,this.oneof).appendTo(content);
        
        View.popup(
            'auto',
            800, // Workaround for 3 year old jqueryUi bug...
            'W&auml;hle die gew&uuml;nschten Filter aus:',
            content,
            {
                Ok: function() {
                    View.loadDebates();
                    $( this ).dialog( "close" );
                }
            });
    }
    
    this.getSelected = function(id) {
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
}