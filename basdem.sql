-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 22, 2012 at 11:06 AM
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=10 ;

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`id`, `userid`) VALUES
(1, 1);

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

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
CREATE TABLE IF NOT EXISTS `favorite` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  UNIQUE KEY `id` (`id`,`user`),
  KEY `id_2` (`id`)
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=10 ;

--
-- Dumping data for table `memplex`
--

INSERT INTO `memplex` (`id`, `layer`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `moderation`
--

DROP TABLE IF EXISTS `moderation`;
CREATE TABLE IF NOT EXISTS `moderation` (
  `id` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL,
  KEY `state` (`state`),
  KEY `id` (`id`)
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=60 ;

--
-- Dumping data for table `texts`
--

INSERT INTO `texts` (`id`, `content`) VALUES
(1, 'System');

-- --------------------------------------------------------

--
-- Table structure for table `titles`
--

DROP TABLE IF EXISTS `titles`;
CREATE TABLE IF NOT EXISTS `titles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=60 ;

--
-- Dumping data for table `titles`
--

INSERT INTO `titles` (`id`, `content`) VALUES
(1, 'System');

-- --------------------------------------------------------

--
-- Table structure for table `userrights`
--

DROP TABLE IF EXISTS `userrights`;
CREATE TABLE IF NOT EXISTS `userrights` (
  `id` int(11) NOT NULL,
  `moderator` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `moderator` (`moderator`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
  `verified` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `email`, `nickname`, `verified`) VALUES
(1, '', 'System', 'System', '');

-- --------------------------------------------------------

--
-- Table structure for table `version`
--

DROP TABLE IF EXISTS `version`;
CREATE TABLE IF NOT EXISTS `version` (
  `primary` int(2) NOT NULL,
  `secondary` int(2) NOT NULL,
  `tertiary` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `version`
--

INSERT INTO `version` (`primary`, `secondary`, `tertiary`) VALUES
(0, 0, 91);

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
  ADD CONSTRAINT `children_ibfk_2` FOREIGN KEY (`child`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `children_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `memplex` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

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
