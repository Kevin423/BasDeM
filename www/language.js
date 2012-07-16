var Language = new function() {
this.get = function(target,lang) {
switch ( lang ) {
    case 'de_DE':
        switch ( target.toLowerCase() ) {
            case 'lang_author': return 'Autor'; break;
            case 'lang_back': return 'zur&uuml;ck'; break;
            case 'lang_cancel': return 'Abbrechen'; break;
            case 'lang_contra': return 'Contra'; break;
            case 'lang_createargument': return 'Argument anlegen'; break;
            case 'lang_createcomment': return 'Kommentar anlegen'; break;
            case 'lang_createissue': return 'Problem anlegen'; break;
            case 'lang_createsolution': return 'L&ouml;sung anlegen'; break;
            case 'lang_createtopic': return 'Thema anlegen'; break;
            case 'lang_description': return 'Beschreibung'; break;
            case 'lang_issue': return 'Problem'; break;
            case 'lang_neutral': return 'Neutral'; break;
            case 'lang_pro': return 'Pro'; break;
            case 'lang_solution': return 'L&ouml;sung'; break;
            case 'lang_title': return 'Titel'; break;
            case 'lang_topic': return 'Thema'; break;
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
        }; break;
    }
};
}
