var Language = new function() {
this.get = function(target,lang) {
switch ( target ) {
    case 'de_DE':
        switch ( lang ) {
            case 'lang_author': return 'Autor'; break;
            case 'lang_answer': return 'Antworten'; break;
            case 'lang_argPro': return 'Pro Argument hinzuf&uumlgen'; break;
            case 'lang_argNeut': return 'Neue Antwort hinzuf&uumlgen'; break;
            case 'lang_argCon': return 'Contra Argument hinzuf&uumlgen'; break;
            case 'lang_back': return 'zur&uuml;ck'; break;
            case 'lang_cancel': return 'Abbrechen'; break;
            case 'lang_createArgumentPro': return 'Neues Pro Argument erstellen:'; break;
            case 'lang_createArgumentNeut': return 'Neue Antwort erstellen:'; break;
            case 'lang_createArgumentCon': return 'Neues Contra Argument erstellen:'; break;
            case 'lang_createcomment': return 'Kommentar anlegen'; break;
            case 'lang_createsolution': return 'L&ouml;sung anlegen'; break;
            case 'lang_debate': return 'Debatten'; break;
            case 'lang_description': return 'Beschreibung'; break;
            case 'lang_errorPartent':
            case 'lang_errorLayer': return 'Es ist ein schwerer Fehler aufgetreten. Bitte Klicke auf Abbrechen!'; break;
            case 'lang_errorDebateTitle': return 'Bitte gib einen Titel für deine Debatte an!'; break;
            case 'lang_filterSelect': return 'Filter einstellen'; break;
            case 'lang_logout': return 'Logout'; break;
            case 'lang_newDebate': return 'Neue Debatte'; break;
            case 'lang_newDebateCreate': return 'Neue Debatte erstellen'; break;
            case 'lang_noArgPro': return 'Noch keine Argumente daf&uuml;r'; break;
            case 'lang_noArgNeut': return 'Noch keine Antworten'; break;
            case 'lang_noArgCon': return 'Noch keine Argumente dagegen'; break;
            case 'lang_ok': return 'OK'; break;
            case 'lang_newSolution': return 'Neue L&ouml;sung'; break;
            case 'lang_solutionDescription': return 'Bitte beschreibe deine L&ouml;sung in einigen Sätzen!'; break;
            case 'lang_solutionAdd': return 'L&ouml;sung hinzuf&uuml;gen'; break;
            case 'lang_title': return 'Titel'; break;
            case 'lang_topic': return 'Thema'; break;
            case 'lang_multiFilter': return 'Dr&uuml;cke Strg um mehr als einen Filter auszuw&auml;hlen.<br>Achtung: &Auml;nderungen sind sofort wirksam!'; break;
            case 'lang_allFilter': return 'Beitrag erf&uuml;llt alle hier ausgew&auml;hlten Filter:'; break;
            case 'lang_minFilter': return 'Beitrag erf&uuml;llt mindestens einen hier ausgew&auml;hlten Filter:'; break;
            case 'lang_filter': return 'W&auml;hle die gew&uuml;nschten Filter aus:'; break;
            case 'lang_yArg': return 'dein Argument'; break;
            case 'lang_yAnsw': return 'deine Antwort'; break;
            case 'lang_helpText': return 'Hier k&ouml;nnte ihr Hilfetext stehen!'; break;
            default: return 'undefined';
        }; break;
    case 'en_GB':
        switch ( lang ) {
            case 'lang_author': return 'Author'; break;
            case 'lang_answer': return 'Answer'; break;
            case 'lang_argPro': return 'Add pro argument'; break;
            case 'lang_argNeut': return 'Add new answer'; break;
            case 'lang_argCon': return 'Add contra argument'; break;
            case 'lang_back': return 'back'; break;
            case 'lang_cancel': return 'cancel'; break;
            case 'lang_createArgumentPro': return 'Create new pro argument:'; break;
            case 'lang_createArgumentNeut': return 'Create new answer:'; break;
            case 'lang_createArgumentCon': return 'Create new contra argument:'; break;
            case 'lang_createcomment': return 'Create comment'; break;
            case 'lang_createsolution': return 'Create Solution'; break;
            case 'lang_debate': return 'Debate'; break;
            case 'lang_description': return 'Description'; break;
            case 'lang_errorPartent':
            case 'lang_errorLayer': return 'An fatal error occured. Please press cancelEs ist ein schwerer Fehler aufgetreten. Bitte Klicke auf Abbrechen!'; break;
            case 'lang_errorDebateTitle': return 'Please enter a title for your debate!'; break;
            case 'lang_filterSelect': return 'select filters'; break;
            case 'lang_logout': return 'Logout'; break;
            case 'lang_newDebate': return 'new Debate'; break;
            case 'lang_newDebateCreate': return 'Create new debate'; break;
            case 'lang_noArgPro': return 'No pro arguments'; break;
            case 'lang_noArgNeut': return 'No answers'; break;
            case 'lang_noArgCon': return 'No contra arguments'; break;
            case 'lang_ok': return 'OK'; break;
            case 'lang_newSolution': return 'new Solution'; break;
            case 'lang_solutionDescription': return 'Please descripe your solution'; break;
            case 'lang_solutionAdd': return 'Add solution'; break;
            case 'lang_title': return 'Title'; break;
            case 'lang_topic': return 'Topic'; break;
            case 'lang_multiFilter': return 'Press ctrl to select multiple filters.<br>Caution: Changes are in effect immediately'; break;
            case 'lang_allFilter': return 'Contribution satisfies all selected filters:'; break;
            case 'lang_minFilter': return 'Cntribution satisfies at least on of the selected filters:'; break;
            case 'lang_filter': return 'Select the desired filter:'; break;
            case 'lang_yArg': return 'your argument'; break;
            case 'lang_yAnsw': return 'your answer'; break;
            case 'lang_helpText': return 'Supporttext!'; break;
            default: return 'undefined';
        }; break;
    }
};
}
