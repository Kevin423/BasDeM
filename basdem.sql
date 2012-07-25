-- phpMyAdmin SQL Dump
-- version 3.3.7deb7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 25, 2012 at 04:24 PM
-- Server version: 5.1.61
-- PHP Version: 5.3.3-7+squeeze8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `basdem`
--

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
(4, 'System'),
(5, 'System'),
(6, 'System'),
(7, 'System'),
(8, 'System'),
(9, 'System'),
(10, 'System'),
(11, 'System'),
(12, 'System'),
(13, 'System'),
(14, 'System'),
(15, 'System'),
(16, 'System'),
(17, 'System'),
(18, 'System'),
(19, 'System');

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
(1, 19);

-- --------------------------------------------------------

--
-- Table structure for table `memplex`
--

CREATE TABLE IF NOT EXISTS `memplex` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `layer` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `layer` (`layer`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=20 ;

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
(19, 2);

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
(19, 'Bundesverband');

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
(19, 'Bundesverband');

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
