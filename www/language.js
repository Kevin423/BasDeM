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
 
 /* Important: de_DE is the default language, add there under all circumstances! */

var Language = new function() {
this.get = function(target,lang) {
switch ( target ) {
    case 'de_DE':
        switch ( lang ) {
            case 'lang_allFilter': return 'Beitrag erf&uuml;llt alle hier ausgew&auml;hlten Filter:';
            case 'lang_answer': return 'Erg&auml;nzen';
            case 'lang_argPro': return 'Best&auml;rken';
            case 'lang_argNeut': return 'Erg&auml;nzen';
            case 'lang_argCon': return 'Entgegnen';
            case 'lang_author': return 'Autor';
            case 'lang_back': return 'zur&uuml;ck';
            case 'lang_cancel': return 'Abbrechen';
            case 'lang_createArgumentPro': return 'Best&auml;rken';
            case 'lang_createArgumentNeut': return 'Erg&auml;nzen';
            case 'lang_createArgumentCon': return 'Entgegnen';
            case 'lang_createcomment': return 'Erg&auml;nzen';
            case 'lang_createsolution': return 'L&ouml;sung anlegen';
            case 'lang_debate': return 'Debatten';
            case 'lang_description': return 'Beschreibung';
            case 'lang_errorPartent':
            case 'lang_errorLayer': return 'Es ist ein schwerer Fehler aufgetreten. Bitte Klicke auf Abbrechen!';
            case 'lang_errorDebateTitle': return 'Bitte gib einen Titel f&uuml;r deine Debatte an!';
            case 'lang_filter': return 'W&auml;hle die gew&uuml;nschten Filter aus';
            case 'lang_filterSelect': return 'Filter einstellen';
            case 'lang_helpNewComment': return '<p>Bitte beschreibe dein neues Argument sachlich und verst&auml;ndlich und wiederhole keine Punkte, die bereits genannt wurden.</p><p>Der <b>Titel</b> ist die Kurzfassung deines Argumentes in wenigen Worten. Details und Quellen kannst du in der <b>Beschreibung</b> erl&auml;utern. Du kannst auch Argumente hinzuf&uuml;gen, die nicht deine pers&ouml;nliche Meinung st&uuml;tzen.</p>';
            case 'lang_helpNewDebate': return '<p>Bitte beschreibe deine neue Debatte sachlich, neutral und verst&auml;ndlich und stelle sicher, dass diese Debatte nicht bereits gef&uuml;hrt wird.</p><p>Der <b>Titel</b> ist die Kurzfassung der Debatte in wenigen Worten. Details und Quellen kannst du in der <b>Beschreibung</b> erl&auml;utern. Bitte f&uuml;ge die Debatte auch einem oder mehreren <b>Themenbereichen</b> hinzu, sodass sie leicht gefunden werden kann.</p>';
            case 'lang_helpNewSolution': return '<p>Bitte beschreibe deine neue L&ouml;sung sachlich, neutral und verst&auml;ndlich und wiederhole keine L&ouml;sungen, die bereits genannt wurden.</p><p>Der <b>Titel</b> ist die Kurzbeschreibung deiner L&ouml;sung in wenigen Worten. Details und Quellen kannst du in der <b>Beschreibung</b> erl&auml;utern. Du kannst auch L&ouml;sungen hinzuf&uuml;gen, die du pers&ouml;nlich nicht unterst&uuml;tzt.</p>';
            case 'lang_listNew': return 'Neu';
            case 'lang_listUnsolved': return 'Ungel&ouml;st';
            case 'lang_listLatest': return 'Aktuell';
            case 'lang_logout': return 'Logout';
            case 'lang_minFilter': return 'Beitrag erf&uuml;llt mindestens einen hier ausgew&auml;hlten Filter:';
            case 'lang_multiFilter': return 'Dr&uuml;cke Strg um mehr als einen Filter auszuw&auml;hlen.<br>Achtung: &Auml;nderungen sind sofort wirksam!';
            case 'lang_newDebate': return 'Neue Debatte';
            case 'lang_newDebateCreate': return 'Neue Debatte erstellen';
            case 'lang_newSolution': return 'Neue L&ouml;sung erstellen';
            case 'lang_noArgPro': return 'Noch keine Argumente daf&uuml;r';
            case 'lang_noArgNeut': return 'Noch keine Antworten';
            case 'lang_noArgCon': return 'Noch keine Argumente dagegen';
            case 'lang_ok': return 'OK';
            case 'lang_solutionAdd': return 'L&ouml;sung hinzuf&uuml;gen';
            case 'lang_solutionDescription': return 'Bitte beschreibe deine L&ouml;sung in einigen S&auml;tzen!';
            case 'lang_textComment': return 'Beschreibung des Kommentars: ';
            case 'lang_textDebate': return 'Beschreibung der Debatte: ';
            case 'lang_textSolution': return 'Beschreibung der L&ouml;sung: ';
            case 'lang_titleComment': return 'Titel des Kommentars: ';
            case 'lang_titleDebate': return 'Titel der Debatte: ';
            case 'lang_titleSolution': return 'Titel der L&ouml;sung: ';
            case 'lang_topics': return 'Themenbereiche: ';
            case 'lang_yArg': return 'dein Argument';
            case 'lang_yAnsw': return 'deine Antwort';
            default: return 'undefined';
        };
        break;
    case 'en_GB':
        switch ( lang ) {
            case 'lang_allFilter': return 'Contribution satisfies all selected filters:';
            case 'lang_answer': return 'Answer';
            case 'lang_argPro': return 'Add pro argument';
            case 'lang_argNeut': return 'Add new answer';
            case 'lang_argCon': return 'Add contra argument';
            case 'lang_author': return 'Author';
            case 'lang_back': return 'back';
            case 'lang_cancel': return 'cancel';
            case 'lang_createArgumentPro': return 'Create new pro argument:';
            case 'lang_createArgumentNeut': return 'Create new answer:';
            case 'lang_createArgumentCon': return 'Create new contra argument:';
            case 'lang_createcomment': return 'Create comment';
            case 'lang_createsolution': return 'Create Solution';
            case 'lang_debate': return 'Debate';
            case 'lang_description': return 'Description';
            case 'lang_errorPartent':
            case 'lang_errorLayer': return 'An fatal error occured. Please press cancelEs ist ein schwerer Fehler aufgetreten. Bitte Klicke auf Abbrechen!';
            case 'lang_errorDebateTitle': return 'Please enter a title for your debate!';
            case 'lang_filter': return 'Select the desired filter:';
            case 'lang_filterSelect': return 'select filters';
            case 'lang_helpText': return 'Supporttext!';
            case 'lang_logout': return 'Logout';
            case 'lang_minFilter': return 'Cntribution satisfies at least on of the selected filters:';
            case 'lang_multiFilter': return 'Press ctrl to select multiple filters.<br>Caution: Changes are in effect immediately';
            case 'lang_newDebate': return 'new Debate';
            case 'lang_newDebateCreate': return 'Create new debate';
            case 'lang_newSolution': return 'new Solution';
            case 'lang_noArgPro': return 'No pro arguments';
            case 'lang_noArgNeut': return 'No answers';
            case 'lang_noArgCon': return 'No contra arguments';
            case 'lang_ok': return 'OK';
            case 'lang_solutionAdd': return 'Add solution';
            case 'lang_solutionDescription': return 'Please describe your solution';
            case 'lang_text': return 'Text';
            case 'lang_title': return 'Title';
            case 'lang_topics': return 'Topics';
            case 'lang_yArg': return 'your argument';
            case 'lang_yAnsw': return 'your answer';
            default: return 'undefined';
        };
        break;
    }
};
}
