-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 21, 2012 at 02:24 AM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `basdem`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `storeMemplex`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `storeMemplex`(
        IN layer TINYINT(8),
        IN parent INT(11),
        IN author VARCHAR(255),
        IN title VARCHAR(255),
        IN text MEDIUMTEXT
    )
BEGIN
            INSERT INTO memplex SET `layer` = layer;
            INSERT INTO authors SET `content` = author, `id` = LAST_INSERT_ID();
            INSERT INTO titles SET `content` = title, `id` = LAST_INSERT_ID();
            INSERT INTO texts SET `content` = text, `id` = LAST_INSERT_ID();
            INSERT INTO children SET `parent` = parent, `child` = LAST_INSERT_ID();
        END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
CREATE TABLE IF NOT EXISTS `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `content` (`userid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=46 ;

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`id`, `userid`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1);

-- --------------------------------------------------------

--
-- Table structure for table `children`
--

DROP TABLE IF EXISTS `children`;
CREATE TABLE IF NOT EXISTS `children` (
  `parent` int(11) NOT NULL,
  `child` int(11) NOT NULL,
  PRIMARY KEY (`parent`,`child`),
  KEY `child` (`child`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `children`
--

INSERT INTO `children` (`parent`, `child`) VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(9, 20),
(10, 20),
(16, 20),
(17, 20),
(18, 20),
(19, 20),
(20, 21),
(21, 22),
(20, 23),
(20, 24),
(24, 25),
(23, 26),
(21, 27),
(10, 28),
(28, 29),
(29, 30),
(29, 31),
(29, 32),
(29, 33),
(29, 34),
(28, 35),
(35, 36),
(29, 37),
(37, 38),
(29, 39),
(36, 40);

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
CREATE TABLE IF NOT EXISTS `favorite` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`,`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `memplex`
--

DROP TABLE IF EXISTS `memplex`;
CREATE TABLE IF NOT EXISTS `memplex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layer` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `layer` (`layer`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=54 ;

--
-- Dumping data for table `memplex`
--

INSERT INTO `memplex` (`id`, `layer`) VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(15, 2),
(16, 2),
(17, 2),
(18, 2),
(19, 2),
(20, 3),
(28, 3),
(21, 4),
(23, 4),
(24, 4),
(29, 4),
(35, 4),
(22, 5),
(30, 5),
(31, 5),
(36, 5),
(39, 5),
(26, 6),
(32, 6),
(33, 6),
(25, 7),
(27, 7),
(34, 7),
(37, 7),
(38, 8),
(40, 8);

-- --------------------------------------------------------

--
-- Table structure for table `moderation`
--

DROP TABLE IF EXISTS `moderation`;
CREATE TABLE IF NOT EXISTS `moderation` (
  `id` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `state` (`state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `texts`
--

DROP TABLE IF EXISTS `texts`;
CREATE TABLE IF NOT EXISTS `texts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` mediumtext CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=54 ;

--
-- Dumping data for table `texts`
--

INSERT INTO `texts` (`id`, `content`) VALUES
(1, 'Dies ist eine Übersicht über alle Themenbereiche.'),
(2, 'Innen, Recht, Demokratie, Sicherheit'),
(3, 'Wirtschaft, Soziales'),
(4, 'Umwelt, Verkehr, Energie'),
(5, 'Kinder, Jugend, Familie und Bildung'),
(6, 'Digitales, Urheber-/Patentrecht, Datenschutz'),
(7, 'Außen, Internationales, Frieden'),
(8, 'Gesundheit und Drogen/Suchtpolitik'),
(9, 'Satzung und Parteistruktur'),
(10, 'Sonstige innerparteiliche Angelegenheiten'),
(11, 'Sonstige politische Themen'),
(12, 'Sandkasten/Spielwiese'),
(13, 'Veröffentlichungen'),
(14, 'Vorstandssitzungen'),
(15, 'Wissenschaft und Forschung'),
(16, 'Alles zum Bundesparteitag 2012.2'),
(17, 'Alles zum Landesparteitag Baden Württemberg 2012.2'),
(18, 'Landesverband Baden-Württemberg'),
(19, 'Bundesverband'),
(20, 'Bei Parteitagen wird immer ewig diskutiert und wir kommen kaum zum abstimmen. Viele Argumente werden doppelt und dreifach gebracht und keiner kann wirklich etwas dagegen tun. Bei den vielen Doppelnennungen gehen die wichtigen Argumente dann teilweise unter.'),
(21, 'BasDeM, das BasisDemokratische Meinungsbildungstool, ist die Antwort auf überlange Diskussionen und ausufernde Debatten.\nEs bietet eine einfache Übersicht über Argumente und eine angegliederte Diskussionsplattform um über die Argumente zu diskutieren.\n\nDebatten werden mit BasDeM gekürzt, da jeder anhand der offen verfügbaren Liste prüfen kann ob sein Argument bereits genannt wurde oder nicht.'),
(22, 'Mit BasDeM hat man eine schnelle und einfache Möglichkeit sich einen Überblick über eine Debatte zu verschaffen und konkurrierende Lösungsvorschläge zu vergleichen.'),
(23, 'Hier können Anträge im Vorfeld schonmal abgestimmt werden um herauszufinden wieviele überhaupt von der Idee überzeugt sind. So vermeidet man eventuell unnötige Anträge zu stellen.'),
(24, 'Mit Urabstimmungen könnte man Parteitage entlasten.'),
(25, 'Man kann die Meinungsbildung und Diskussions in BasDeM durchführen und das Ergebnis dann mit einer Urabstimmung ermitteln!'),
(26, 'Leider ist die Programmiersprache in der LQFB entwickelt wurde so wenig verbreitet, dass es keine Programmierer gibt die es übernehmen können oder auch nur daran mitarbeiten können.'),
(27, 'kt'),
(28, 'Wir müssen entscheiden, was gekocht und gegessen werden soll.'),
(29, 'Svens legendäres Chili.'),
(30, 'sehr lecker ^^'),
(31, 'Eintopf kann man ewig köcheln lassen.'),
(32, 'Für Vegetarier wäre das nichts.'),
(33, 'Jedes Böhnchen gibt ein Tönchen....'),
(34, 'Die Schärfe muss für alle Teilnehmer abgestimmt werden. Das ist sicher möglich, aber nicht leicht.'),
(35, 'Ein schöner Topf mit viiiiiiiiel FLOISCH!'),
(36, 'kann man ewig köcheln lassen'),
(37, 'Sind nicht definiert. Reis? Nudeln? Keine?'),
(38, 'Ganz klar, was sonst?'),
(39, 'Und DAS ist ein gutes Argument. ^^'),
(40, '... desto besser schmeckt es am Ende!');

-- --------------------------------------------------------

--
-- Table structure for table `titles`
--

DROP TABLE IF EXISTS `titles`;
CREATE TABLE IF NOT EXISTS `titles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=54 ;

--
-- Dumping data for table `titles`
--

INSERT INTO `titles` (`id`, `content`) VALUES
(1, 'Themenbereichsübersicht'),
(2, 'Innen, Recht, Demokratie, Sicherheit'),
(3, 'Wirtschaft, Soziales'),
(4, 'Umwelt, Verkehr, Energie'),
(5, 'Kinder, Jugend, Familie und Bildung'),
(6, 'Digitales, Urheber-/Patentrecht, Datenschutz'),
(7, 'Außen, Internationales, Frieden'),
(8, 'Gesundheit und Drogen/Suchtpolitik'),
(9, 'Satzung und Parteistruktur'),
(10, 'Sonstige innerparteiliche Angelegenheiten'),
(11, 'Sonstige politische Themen'),
(12, 'Sandkasten/Spielwiese'),
(13, 'Veröffentlichungen'),
(14, 'Vorstandssitzungen'),
(15, 'Wissenschaft und Forschung'),
(16, 'BPT 2012.2'),
(17, 'Landesparteitag 2012.2 BW'),
(18, 'Landesverband Baden-Württemberg'),
(19, 'Bundesverband'),
(20, 'Zu lange Diskussionen bei Parteitagen'),
(21, 'BasDeM'),
(22, 'Gute Übersicht über Debatten'),
(23, 'LQFB'),
(24, 'Urabstimmung'),
(25, 'Lässt sich mit BasDeM kombinieren'),
(26, 'Totes Projekt'),
(27, 'Lässt sich mit Urabstimmung kombinieren (kT)'),
(28, 'Essen beim KOM-Arbeitstreffen'),
(29, 'Chili Con Carne'),
(30, 'lecker'),
(31, 'leicht warmzuhalten'),
(32, 'nicht vegetarisch'),
(33, 'Blähungen'),
(34, 'Schärfe'),
(35, 'Gulasch'),
(36, 'leicht warmzuhalten'),
(37, 'Beilagen?'),
(38, 'Reis!'),
(39, 'enthält Fleisch'),
(40, 'Je länger es kocht...');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(120) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `email`, `nickname`) VALUES
(1, '', 'System', 'System'),
(2, '$6$rounds=50000$This is my salt.$Ep8bSDwz18eVJiceUYBip2kKh5Mj56TN0omwDuABPhNXsuAxtHlW7RpHrzw1ospPDAS1eZ8tdyRA2Ij5ZG9GE.', 'justus@abi007.info', '');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `moderation`
--
ALTER TABLE `moderation`
  ADD CONSTRAINT `moderation_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `texts`
--
ALTER TABLE `texts`
  ADD CONSTRAINT `texts_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `titles`
--
ALTER TABLE `titles`
  ADD CONSTRAINT `titles_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
