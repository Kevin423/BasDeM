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
            case 'lang_contra': return 'Contra'; break;
            case 'lang_createargument': return 'Argument anlegen'; break;
            case 'lang_createcomment': return 'Kommentar anlegen'; break;
            case 'lang_createissue': return 'Problem anlegen'; break;
            case 'lang_createsolution': return 'L&ouml;sung anlegen'; break;
            case 'lang_createtopic': return 'Thema anlegen'; break;
            case 'lang_debate': return 'Debatten'; break;
            case 'lang_description': return 'Beschreibung'; break;
            case 'lang_filterSelect': return 'Filter einstellen'; break;
            case 'lang_issue': return 'Problem'; break;
            case 'lang_logout': return 'Logout'; break;
            case 'lang_neutral': return 'Neutral'; break;
            case 'lang_newDebate': return 'Neue Debatte'; break;
            case 'lang_noArgPro': return 'Noch keine Argumente daf&uuml;r'; break;
            case 'lang_noArgNeut': return 'Noch keine Antworten'; break;
            case 'lang_noArgCon': return 'Noch keine Argumente dagegen'; break;
            case 'lang_solution': return 'L&ouml;sung'; break;
            case 'lang_solutionAdd': return 'L&ouml;sung hinzuf&uuml;gen'; break;
            case 'lang_title': return 'Titel'; break;
            case 'lang_topic': return 'Thema'; break;
            case 'lang_multiFilter': return 'Dr&uuml;cke Strg um mehr als einen Filter auszuw&auml;hlen.<br>Achtung: &Auml;nderungen sind sofort wirksam!'; break;
            case 'lang_allFilter': return 'Beitrag erf&uuml;llt alle hier ausgew&auml;hlten Filter:'; break;
            case 'lang_minFilter': return 'Beitrag erf&uuml;llt mindestens einen hier ausgew&auml;hlten Filter:'; break;
            case 'lang_filter': return 'W&auml;hle die gew&uuml;nschten Filter aus:'; break;
            default: return 'undefined';
        }; break;
    case 'en_GB':
        switch ( target.toLowerCase() ) {
            case 'lang_author': return 'Author'; break;
            case 'lang_back': return 'back'; break;
            case 'lang_cancel': return 'Cancel'; break;
            case 'lang_contra': return 'Contra'; break;
            case 'lang_createargument': return 'Add Argument'; break;
            case 'lang_createcomment': return 'Add Comment'; break;
            case 'lang_createissue': return 'Add Problem'; break;
            case 'lang_createsolution': return 'Add Solution'; break;
            case 'lang_createtopic': return 'Add Topic'; break;
            case 'lang_description': return 'Description'; break;
            case 'lang_issue': return 'Problem'; break;
            case 'lang_neutral': return 'Neutral'; break;
            case 'lang_pro': return 'Pro'; break;
            case 'lang_solution': return 'Solution'; break;
            case 'lang_title': return 'Title'; break;
            case 'lang_topic': return 'Topic'; break;
            default: return 'undefined';
        }; break;
    }
};
}
