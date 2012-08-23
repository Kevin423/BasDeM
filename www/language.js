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
 
/****************************************************************************************
 * This Source Code Form is subject to the terms of the Mozilla Public                  *
 * License, v. 2.0. If a copy of the MPL was not distributed with this                  *
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.                             *
 ****************************************************************************************/

 /* Important: de_DE is the default language, add there under all circumstances! */

var Language = new function() {
this.get = function(target,lang) {
switch ( target ) {
    case 'de_DE':
        switch ( lang ) {
            case 'lang_allFilter': return 'Verfügbare Filterkategorien:';
            case 'lang_answer': return 'Erg&auml;nzen';
            case 'lang_argPro': return 'Best&auml;rken';
            case 'lang_argNeut': return 'Erg&auml;nzen';
            case 'lang_argCon': return 'Entgegnen';
            case 'lang_author': return 'Autor';
            case 'lang_back': return 'zur&uuml;ck';
            case 'lang_confirm': return 'Bestätigen';
            case 'lang_cancel': return 'Abbrechen';
            case 'lang_createsolution': return 'L&ouml;sung anlegen';
            case 'lang_debate': return 'Debatten';
            case 'lang_description': return 'Beschreibung';
            case 'lang_errorDebateDescription': return 'Bitte gib die Beschreibung der neuen Debatte an.';
            case 'lang_errorDebateFilter': return 'Bitte ordne der neuen Debatte mindestens einer Filterkategorie zu.';
            case 'lang_errorDebateTitle': return 'Bitte gib einen Titel f&uuml;r deine Debatte an.';
            case 'lang_errorFilterDescription': return 'Bitte gib eine Beschreibung der neuen Filterkategorie an.';
            case 'lang_errorFilterTitle': return 'Bitte gib einen Titel f&uuml;r deine neue Filterkategorie an..';
            case 'lang_errorLayer': return 'Es ist ein schwerer Fehler aufgetreten. Bitte klicke auf Abbrechen.';
            case 'lang_errorDebateTitle': return 'Bitte gib einen Titel f&uuml;r deine Debatte an.';
            case 'lang_errorSolutionDescription': return 'Bitte beschreibe deine L&ouml;sung in einigen S&auml;tzen.';
            case 'lang_errorSolutionTitle': return 'Bitte gib einen Titel f&uuml;r deine Lösung an.';
            case 'lang_favoriteDescription': return 'Zu Favoriten hinzuf&uuml;gen';
            case 'lang_filter': return 'W&auml;hle die gew&uuml;nschten Filter aus';
            case 'lang_filterAdd': return 'Filter hinzuf&uuml;gen';
            case 'lang_filterAnd': return 'müssen alle erfüllt sein (UND)';
            case 'lang_filterOr': return 'eins muss erfüllt sein (ODER)';
            case 'lang_filterAndShort': return 'Und Filter:';
            case 'lang_filterOrShort': return 'Oder Filter:';
            case 'lang_helpNewComment': return '<p>Bitte beschreibe dein neues Argument sachlich und verst&auml;ndlich und wiederhole keine Punkte, die bereits genannt wurden.</p><p>Der <b>Titel</b> ist die Kurzfassung deines Argumentes in wenigen Worten. Details und Quellen kannst du in der <b>Beschreibung</b> erl&auml;utern. Du kannst auch Argumente hinzuf&uuml;gen, die nicht deine pers&ouml;nliche Meinung st&uuml;tzen.</p>';
            case 'lang_helpNewDebate': return '<p>Bitte beschreibe deine neue Debatte sachlich, neutral und verst&auml;ndlich und stelle sicher, dass diese Debatte nicht bereits gef&uuml;hrt wird.</p><p>Der <b>Titel</b> ist die Kurzfassung der Debatte in wenigen Worten. Details und Quellen kannst du in der <b>Beschreibung</b> erl&auml;utern. Bitte f&uuml;ge die Debatte auch einem oder mehreren <b>Themenbereichen</b> hinzu, sodass sie leicht gefunden werden kann.</p>';
            case 'lang_helpNewFilter': return '<p>Bitte beschreibe deine neue Filterkategorie sachlich, neutral und verst&auml;ndlich und stelle sicher, dass diese Filterkategorie nicht bereits vorhanden ist.</p><p>Der <b>Titel</b> ist die Kurzfassung der Filterkategorie in wenigen Worten. Details und Quellen kannst du in der <b>Beschreibung</b> erl&auml;utern.<p>';
            case 'lang_helpNewSolution': return '<p>Bitte beschreibe deine neue L&ouml;sung sachlich, neutral und verst&auml;ndlich und wiederhole keine L&ouml;sungen, die bereits genannt wurden.</p><p>Der <b>Titel</b> ist die Kurzbeschreibung deiner L&ouml;sung in wenigen Worten. Details und Quellen kannst du in der <b>Beschreibung</b> erl&auml;utern. Du kannst auch L&ouml;sungen hinzuf&uuml;gen, die du pers&ouml;nlich nicht unterst&uuml;tzt.</p>';
            case 'lang_listNew': return 'Neu';
            case 'lang_listLatest': return 'Aktuell';
            case 'lang_listUnsolved': return 'Ungel&ouml;st';
            case 'lang_listOwn': return 'Eigene';
            case 'lang_logout': return 'Logout';
            case 'lang_minFilter': return 'Beitrag erf&uuml;llt mindestens einen hier ausgew&auml;hlten Filter:';
            case 'lang_missingVerification': return 'Du musst erst deine E-Mail Adresse verifizieren bevor du posten kannst!';
            case 'lang_moderate': return 'Moderieren';
            case 'lang_moderateInactive': return 'Inaktiv';
            case 'lang_moderateInappropriate': return 'Unangemessen';
            case 'lang_moderateExplanation': return 'W&auml;hle was du mit dem Beitrag machen m&ouml;chtest.<br><br> "Inaktiv" markiert den Beitrag als abgelaufen oder veraltet. Er kann weiterhin von Usern eingesehen werden.<br><br> "Unangemessen" markiert den Beitrag als nicht gem&auml;&szlig; den Richtlinien der Netiquette, er kann dann nichtmehr von normalen Usern eingesehen werden.';
            case 'lang_multiFilter': return '<p>Filter erlauben, nur für dich interessante Debatten anzuzeigen. Du kannst die Ansicht auf Debatten einschränken, die in mehreren Kategorien gleichzeitig sind (z.B.: "Bundesparteitag" UND "Umwelt") oder Debatten aus mehreren Kategorien zusammenführen (z.B.: "Soziales" ODER "Gesundheit"). Dr&uuml;cke Strg um mehr als einen Filter auszuw&auml;hlen.</p>';
            case 'lang_newDebate': return 'Neue Debatte';
            case 'lang_newDebateCreate': return 'Neue Debatte erstellen';
            case 'lang_newFilter': return 'Neue Filterkategorie';
            case 'lang_newFilterCreate': return 'Neue Filterkategorie erstellen';
            case 'lang_newSolution': return 'Neue L&ouml;sung erstellen';
            case 'lang_noArgPro': return 'Noch keine Best&auml;rkungen';
            case 'lang_noArgNeut': return 'Noch keine Erg&auml;nzungen';
            case 'lang_noArgCon': return 'Noch keine Entgegnungen';
            case 'lang_ok': return 'OK';
            case 'lang_settings': return 'Einstellungen';
            case 'lang_solutionAdd': return 'L&ouml;sung hinzuf&uuml;gen';
            case 'lang_textComment': return 'Beschreibung der Erg&auml;nzung: ';
            case 'lang_textDebate': return 'Beschreibung der Debatte: ';
            case 'lang_textFilter': return 'Beschreibung der Filterkategorie: ';
            case 'lang_textSolution': return 'Beschreibung der L&ouml;sung: ';
            case 'lang_titleComment': return 'Titel der Erg&auml;nzung: ';
            case 'lang_titleDebate': return 'Titel der Debatte: ';
            case 'lang_titleFilter': return 'Titel der Filterkategorie: ';
            case 'lang_titleSolution': return 'Titel der L&ouml;sung: ';
            case 'lang_topics': return 'Themenbereiche: ';
            case 'lang_yArg': return 'dein Argument';
            case 'lang_yAnsw': return 'deine Erg&auml;nzung';
            default: return 'undefined';
        };
        break;
    case 'en_GB':
        switch ( lang ) {
            default: return 'undefined';
        };
        break;
    }
};
}
