-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 25, 2012 at 03:52 PM
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

CREATE TABLE IF NOT EXISTS `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=46 ;

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`id`, `content`) VALUES
(1, 'System'),
(2, 'System'),
(3, 'System'),
(4, 'Justus'),
(5, 'Justus'),
(6, 'Justus'),
(7, 'Alexander Morlang'),
(8, 'Justus'),
(9, 'Justus'),
(10, 'ä'),
(11, 'b'),
(12, 'a'),
(13, 'ä'),
(14, 'äää'),
(15, 'ds'),
(16, 'ds'),
(17, 'ds'),
(18, 'ds'),
(19, 'ds'),
(20, 'ds'),
(21, 'ds'),
(22, 'dasd'),
(23, 'asdasdas'),
(24, 'Justus'),
(25, 'System'),
(26, 'System'),
(27, 'System'),
(28, 'System'),
(29, 'System'),
(30, 'System'),
(31, 'System'),
(32, 'System'),
(33, 'System'),
(34, 'System'),
(35, 'System'),
(36, 'System'),
(37, 'System'),
(38, 'System'),
(39, 'System'),
(40, 'System'),
(41, 'System'),
(42, 'System'),
(43, 'System'),
(44, 'author'),
(45, 'author');

-- --------------------------------------------------------

--
-- Table structure for table `children`
--

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
(3, 4),
(4, 5),
(5, 6),
(5, 7),
(7, 8),
(5, 9),
(5, 10),
(9, 11),
(8, 12),
(11, 13),
(13, 14),
(7, 15),
(15, 16),
(16, 17),
(17, 18),
(18, 19),
(19, 20),
(20, 21),
(14, 22),
(22, 23),
(4, 24),
(2, 30),
(3, 30),
(2, 31),
(2, 32),
(3, 33),
(3, 34),
(31, 35),
(30, 36),
(36, 37),
(37, 38),
(36, 40),
(38, 41),
(41, 42),
(36, 43),
(3, 45);

-- --------------------------------------------------------

--
-- Table structure for table `memplex`
--

CREATE TABLE IF NOT EXISTS `memplex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layer` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `layer` (`layer`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=46 ;

--
-- Dumping data for table `memplex`
--

INSERT INTO `memplex` (`id`, `layer`) VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 3),
(25, 3),
(26, 3),
(27, 3),
(28, 3),
(29, 3),
(30, 3),
(31, 3),
(32, 3),
(33, 3),
(34, 3),
(5, 4),
(24, 4),
(35, 4),
(36, 4),
(44, 4),
(45, 4),
(6, 5),
(10, 5),
(37, 5),
(40, 5),
(43, 5),
(7, 6),
(9, 6),
(8, 8),
(11, 8),
(12, 8),
(13, 8),
(14, 8),
(15, 8),
(16, 8),
(17, 8),
(18, 8),
(19, 8),
(20, 8),
(21, 8),
(22, 8),
(23, 8),
(38, 8),
(39, 8),
(41, 8),
(42, 8);

-- --------------------------------------------------------

--
-- Table structure for table `texts`
--

CREATE TABLE IF NOT EXISTS `texts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` mediumtext CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=46 ;

--
-- Dumping data for table `texts`
--

INSERT INTO `texts` (`id`, `content`) VALUES
(1, 'Dies ist eine Übersicht über alle Themenbereiche.'),
(2, 'Themenbereich für die Themen Innenpolitik und Sicherheitspolitik.'),
(3, 'Themenbereich für alle Probleme rund um den Parteialltag.'),
(4, 'Die Kommunikation vom Vorstand zur Basis ist zu schwierig.'),
(5, 'BasDeM bietet eine einfache Möglichkeit Argumente für Themen zu sammeln und Lösungsorientiert über Probleme zu diskutieren.'),
(6, 'Viel zu sagen gibt es da nicht, so toll wie es ist!'),
(7, 'Es gibt leider keine echte Möglichkeit Dinge vor einem BPT schonmal abzustimmen um zu sehen ob das Thema überhaupt Sinn macht.'),
(8, 'Eigentlich ist dieses Feature auch nicht notwendig, abgestimmt wird auf dem BPT, was wir vorher machen müssen ist die Diskussion führen. Denn die kostet auf dem BPT unmengen von Zeit!'),
(9, 'Leider erfordert BasDeM wie alle anderen solchen Tools einen verbindlichen Internetzugang, sonst kann man nicht mitmachen.'),
(10, 'ä'),
(11, 'b'),
(12, 'a'),
(13, 'ä'),
(14, 'äää'),
(15, 'sd'),
(16, 'sd'),
(17, 'sd'),
(18, 'sd'),
(19, 'sd'),
(20, 'sd'),
(21, 'sd'),
(22, 'asdasd'),
(23, 'dasdasdasd'),
(24, 'test'),
(25, 'Viel intelligentes zum Bahnhof...'),
(26, 'Viel intelligentes zum Bahnhof...'),
(27, 'Viel intelligentes zum Bahnhof...'),
(28, 'Viel intelligentes zum Bahnhof...'),
(29, 'Viel intelligentes zum Bahnhof...'),
(30, 'Viel intelligentes zum Bahnhof...'),
(31, 'Der ESM ist so übel kompliziert, was soll man damit tun? Kann man etwas dagegen tun?'),
(32, 'Der ESM ist so übel kompliziert, was soll man damit tun? Kann man etwas dagegen tun?'),
(33, 'Der gehört eigentlich auch abgeschafft.'),
(34, 'Immer noch abschaffen!'),
(35, 'Einfach alle halbwegs passabel aussehenden PolitikerInnen zum Schlammcatchen zwingen. Der Gewinner bestimmt wie es weitergeht!'),
(36, 'Ist doch klar!'),
(37, 'Die Kosten sind doch völlig am aus dem Ruder laufen.'),
(38, 'Wenn wir das machen haben wir wenigstens nen Bahnhof, wenn wir aussteigen nur Mehrkosten.'),
(39, 'äöü'),
(40, 'äöü'),
(41, 'äöü'),
(42, 'öäü'),
(43, 'Öbür vüll!'),
(44, 'text'),
(45, 'text');

-- --------------------------------------------------------

--
-- Table structure for table `titles`
--

CREATE TABLE IF NOT EXISTS `titles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=46 ;

--
-- Dumping data for table `titles`
--

INSERT INTO `titles` (`id`, `content`) VALUES
(1, 'Themenbereichsübersicht'),
(2, 'Inneres & Sicherheit'),
(3, 'Parteiinternas'),
(4, 'Kommunikation Vorstand Basis'),
(5, 'BasDeM'),
(6, 'Gute Übersicht über Argumente'),
(7, 'Keine Abstimmungsmöglichkeit'),
(8, 'Nicht notwendig'),
(9, 'Erfordert einen Internetzugang'),
(10, 'ö'),
(11, 'b'),
(12, 'a'),
(13, 'ä'),
(14, 'äää'),
(15, 'sd'),
(16, 'sd'),
(17, 'sd'),
(18, 'sd'),
(19, 'sd'),
(20, 'sd'),
(21, 'sd'),
(22, 'ssdasd'),
(23, 'dasdasdas'),
(24, 'test'),
(25, 'S21'),
(26, 'S21'),
(27, 'S21'),
(28, 'S21'),
(29, 'S21'),
(30, 'S21'),
(31, 'ESM'),
(32, 'ESM'),
(33, 'ESC'),
(34, 'ESC'),
(35, 'Politik via Schlammcatchen!'),
(36, 'Oben bleiben!'),
(37, 'Kostet Millionen, spart Milliarden!'),
(38, 'Wirklich sicher?'),
(39, 'äöü'),
(40, 'äöü'),
(41, 'äöü'),
(42, 'öäü'),
(43, 'Für immer tolle Argümente!'),
(44, 'title'),
(45, 'title');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authors`
--
ALTER TABLE `authors`
  ADD CONSTRAINT `authors_ibfk_1` FOREIGN KEY (`id`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `children`
--
ALTER TABLE `children`
  ADD CONSTRAINT `children_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `children_ibfk_2` FOREIGN KEY (`child`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

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
