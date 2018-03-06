/*
Navicat MySQL Data Transfer

Source Server         : local-mysql
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : quizdb

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2018-02-26 20:40:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES ('7', '2014_10_12_000000_create_users_table', '1');
INSERT INTO `migrations` VALUES ('8', '2014_10_12_100000_create_password_resets_table', '1');
INSERT INTO `migrations` VALUES ('9', '2017_12_12_095516_quiz_problems', '1');
INSERT INTO `migrations` VALUES ('10', '2017_12_16_143104_quiz_answer', '1');
INSERT INTO `migrations` VALUES ('11', '2018_01_13_004541_quiz_test', '1');
INSERT INTO `migrations` VALUES ('12', '2018_01_20_040718_quiz_testevent', '1');
INSERT INTO `migrations` VALUES ('13', '2018_02_21_062555_quiz_profile', '1');

-- ----------------------------
-- Table structure for password_resets
-- ----------------------------
DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of password_resets
-- ----------------------------

-- ----------------------------
-- Table structure for profiles
-- ----------------------------
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `photo` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `interest` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `occupation` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `summary` text COLLATE utf8_unicode_ci,
  `website_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`,`user_id`),
  KEY `profiles_user_id_index` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of profiles
-- ----------------------------
INSERT INTO `profiles` VALUES ('1', '1', 'img101.png', '23123', 'sdsf, dsdf', 'sdfsdff', 'fsafsdsaf', '', null, null);
INSERT INTO `profiles` VALUES ('2', '2', null, '45345', 'sfsf', '', '', '', null, null);

-- ----------------------------
-- Table structure for quiz_answer
-- ----------------------------
DROP TABLE IF EXISTS `quiz_answer`;
CREATE TABLE `quiz_answer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `testevent_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `answer` text COLLATE utf8_unicode_ci NOT NULL,
  `examine_uptime` int(10) unsigned DEFAULT NULL,
  `evaluate_mark` double(10,2) NOT NULL,
  `uid` int(11) NOT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `checker_id` int(11) DEFAULT NULL,
  `check_time` timestamp NULL DEFAULT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_answer_testevent_id_index` (`testevent_id`),
  KEY `quiz_answer_quiz_id_index` (`quiz_id`),
  KEY `quiz_answer_uid_index` (`uid`),
  KEY `quiz_answer_checker_id_index` (`checker_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of quiz_answer
-- ----------------------------
INSERT INTO `quiz_answer` VALUES ('1', '0', '5', '{\"optionno\":null}', '2', '0.00', '1', null, '2018-02-26 08:58:21', null, null, '0', null, '2018-02-26 08:58:21', null);
INSERT INTO `quiz_answer` VALUES ('2', '0', '6', '{\"optionno\":[null]}', '22', '0.00', '1', null, '2018-02-26 09:16:53', null, null, '0', null, '2018-02-26 09:16:53', null);
INSERT INTO `quiz_answer` VALUES ('3', '0', '7', '[]', '6', '0.00', '1', null, '2018-02-26 09:24:00', null, null, '0', null, '2018-02-26 09:24:00', null);
INSERT INTO `quiz_answer` VALUES ('4', '0', '8', '{\"optionno\":[null]}', '10', '0.00', '1', null, '2018-02-26 09:41:03', null, null, '0', null, '2018-02-26 09:41:03', null);
INSERT INTO `quiz_answer` VALUES ('5', '0', '9', '{\"optionno\":[[]]}', '3', '0.00', '1', null, '2018-02-26 09:45:07', null, null, '0', null, '2018-02-26 09:45:07', null);
INSERT INTO `quiz_answer` VALUES ('6', '0', '10', '{\"text\":null,\"audio\":null}', '4', '0.00', '1', null, '2018-02-26 09:47:25', null, null, '0', null, '2018-02-26 09:47:25', null);
INSERT INTO `quiz_answer` VALUES ('7', '0', '14', '{\"text\":null,\"audio\":null}', '1', '0.00', '1', null, '2018-02-26 10:00:29', null, null, '0', null, '2018-02-26 10:00:29', null);
INSERT INTO `quiz_answer` VALUES ('8', '0', '13', '{\"audio\":null}', '3', '0.00', '1', null, '2018-02-26 10:01:56', null, null, '0', null, '2018-02-26 10:01:56', null);

-- ----------------------------
-- Table structure for quiz_problems
-- ----------------------------
DROP TABLE IF EXISTS `quiz_problems`;
CREATE TABLE `quiz_problems` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category` enum('Writing','Reading','Speaking','Listening') COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `degree` enum('Easy','Medium','Hard') COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `guide` text COLLATE utf8_unicode_ci NOT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `solution` text COLLATE utf8_unicode_ci NOT NULL,
  `limit_time` int(11) NOT NULL,
  `evaluate_mode` enum('Auto','Manual') COLLATE utf8_unicode_ci NOT NULL,
  `points` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_problems_category_index` (`category`),
  KEY `quiz_problems_type_index` (`type`),
  KEY `quiz_problems_degree_index` (`degree`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of quiz_problems
-- ----------------------------
INSERT INTO `quiz_problems` VALUES ('1', 'Writing', 'WSM', 'Easy', 'jsdhjksjk s;ldkjfksdj', 'fdlkjdklfjfklsjdkl fssfllklkj lsjdfsj dfkljdsfkljdskljdskl', '{\"text\":\"dfssdfsaf f safsadf safdsadfa dfsa sadf\"}', '{\"text\":\"dfa dasfas fsa fsadf\"}', '35', 'Auto', '34', '1', '1', null, '2018-02-26 07:24:09', null);
INSERT INTO `quiz_problems` VALUES ('2', 'Writing', 'WSM', 'Medium', 'lkjkldjsjd sksd', 'dfsdfsdfsfd', '{\"text\":\"sfsdfsdf\"}', '{\"text\":\"sfsdfsdf\"}', '34', 'Auto', '23', '1', '1', null, '2018-02-26 07:28:33', null);
INSERT INTO `quiz_problems` VALUES ('3', 'Listening', 'LWS', 'Easy', 'dfdgdfgdf', 'bvccxvb', '{\"text\":null,\"audio\":\"Sleep Away.mp3\"}', '{\"text\":\"cbcvbcvbcvbvbcbcx\"}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 07:30:34', null);
INSERT INTO `quiz_problems` VALUES ('4', 'Listening', 'LTW', 'Easy', 'lkjkldjsjd sksd', 'sfdfs', '{\"audio\":\"Sleep Away.mp3\",\"text\":\"<p>{{}}{{}}\\u200bdfgdfgdfgdg{{}}\\u200b<\\/p>\",\"select\":{\"options\":[\"fsfddsf\",\"sfsdfs\",\"fdgdfdfgdg\"]}}', '{\"audio\":null}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 07:35:14', '2018-02-26 07:40:03');
INSERT INTO `quiz_problems` VALUES ('5', 'Reading', 'RSA', 'Easy', 'ssdfsfsd', 'sdfdsf', '{\"text\":\"dfsdf\",\"picture\":\"Lighthouse.jpg\",\"select\":{\"guide\":\"sdfsdfsf\",\"options\":[\"sdfsf\",\"sdfsfsdf\",\"sdf\"]}}', '{\"optionno\":2}', '342', 'Auto', '324', '1', '1', null, '2018-02-26 07:42:54', null);
INSERT INTO `quiz_problems` VALUES ('6', 'Reading', 'RMA', 'Easy', 'dssadsa', 'ASDFSADFA', '{\"text\":\"SDFADSFASFSAFS\",\"picture\":\"Desert.jpg\",\"select\":{\"guide\":\"ASDFASDF\",\"options\":[\"sdfsdfs\",\"sdfsfsdf\",\"sdfsdfsdf\",\"dfsfsfsfsfs\"]}}', '{\"optionno\":[1,2]}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 09:00:04', null);
INSERT INTO `quiz_problems` VALUES ('7', 'Reading', 'RRO', 'Easy', 'sdafsdfasd', 'dsfsdfa', '{\"select\":{\"options\":[\"sdfasfaf\",\"bbbbbbbbbb\",\"eeeeeeeeee\",\"ddddddddddddddd\",\"ffffffffffffffffffffff\",\"eeeeeeeeeeeeeeee\"]}}', '[]', '23', 'Auto', '23', '1', '1', null, '2018-02-26 09:17:59', null);
INSERT INTO `quiz_problems` VALUES ('8', 'Reading', 'RFB', 'Easy', 'sdfadfdsaf', 'asdfasfasd', '{\"text\":\"<p>sdfasdffsafda&nbsp;{{}}\\u200b sdfasdfasdf&nbsp;{{}}\\u200b dsfas {{}}\\u200b dfasf<\\/p>\",\"select\":{\"options\":[\"aaa\",\"bbb\",\"vcv\"]}}', '{\"optionno\":[0,1,2]}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 09:27:38', null);
INSERT INTO `quiz_problems` VALUES ('9', 'Reading', 'RAN', 'Easy', 'dsfasdf', 'dsfdsfsaf', '{\"text\":\"<p>asdfsfsd dfd&nbsp;{{}}&nbsp;jkl jljkljlkl&nbsp;{{}}<\\/p>\",\"selectlist\":[{\"options\":[\"a\",\"b\",\"c\",\"d\"]},{\"options\":[\"g\",\"ddd\"]}]}', '{\"optionno\":[{\"id\":0,\"option\":1},{\"id\":1,\"option\":1}]}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 09:44:11', null);
INSERT INTO `quiz_problems` VALUES ('10', 'Speaking', 'SAL', 'Easy', 'fdsafdfsa', 'sadfa', '{\"text\":\"sadfadsfsafdsfasdfsafd\"}', '{\"text\":null,\"audio\":\"Arsenal.mp3\"}', '232', 'Auto', '232', '1', '1', null, '2018-02-26 09:46:44', '2018-02-26 09:49:02');
INSERT INTO `quiz_problems` VALUES ('11', 'Speaking', 'SRS', 'Easy', 'dsafdsfasdf', 'sdfsadfsa', '{\"text\":null,\"audio\":\"Arsenal.mp3\"}', '{\"text\":null,\"audio\":\"Arsenal.mp3\"}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 09:52:25', null);
INSERT INTO `quiz_problems` VALUES ('12', 'Speaking', 'SPI', 'Easy', 'sdafsdfasd', 'safsdfa', '{\"text\":null,\"picture\":\"Chrysanthemum.jpg\"}', '{\"text\":null,\"audio\":\"Arsenal.mp3\"}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 09:55:56', null);
INSERT INTO `quiz_problems` VALUES ('13', 'Speaking', 'SRL', 'Easy', 'afdfasdf', 'asdfsafs', '{\"text\":\"asdfsafsaf\",\"list\":[{\"audio\":\"Arsenal.mp3\",\"title\":\"asdfsafsafs\"},{\"audio\":\"Arsenal.mp3\",\"title\":\"sdfasfsaf\"},{\"audio\":\"Arsenal.mp3\",\"title\":\"asdfsafsfsafasf\"},{\"audio\":\"Arsenal.mp3\",\"title\":\"asdfasfsadf\"},{\"audio\":\"Arsenal.mp3\",\"title\":\"asdfsafsdf\"}]}', '{\"audio\":\"Arsenal.mp3\"}', '232', 'Auto', '2323', '1', '1', null, '2018-02-26 09:57:24', null);
INSERT INTO `quiz_problems` VALUES ('14', 'Speaking', 'SSA', 'Easy', 'dsafsaf', 'safdsafs', '{\"text\":null,\"audio\":\"Arsenal.mp3\"}', '{\"text\":null,\"audio\":\"Arsenal.mp3\"}', '232', 'Auto', '232', '1', '1', null, '2018-02-26 09:59:58', null);
INSERT INTO `quiz_problems` VALUES ('15', 'Listening', 'LCD', 'Easy', 'dsgfgs', 'dfgsdgd', '{\"audio\":\"voip_outgoing_ring.mp3\",\"text\":\"<p>ffasdfasdfs&nbsp;{{}}&nbsp;sdfsdfsdf&nbsp;{{}}&nbsp;<\\/p>\",\"select\":{\"options\":[\"aaa\",\"bbb\"]}}', '{\"audio\":null}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 10:27:37', null);
INSERT INTO `quiz_problems` VALUES ('16', 'Listening', 'LWS', 'Medium', 'dfsadf', '234234', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdfasdf\"}', '234', 'Auto', '234', '1', '1', null, '2018-02-26 10:43:27', null);
INSERT INTO `quiz_problems` VALUES ('17', 'Listening', 'LWS', 'Easy', 'safsaf', 'sdfdads', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sadfsafdaf\"}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 10:49:10', null);
INSERT INTO `quiz_problems` VALUES ('18', 'Listening', 'LWS', 'Medium', 'asdfsdf', 'dfsdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdfsdfasdf\"}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 10:53:14', null);
INSERT INTO `quiz_problems` VALUES ('19', 'Listening', 'LSB', 'Easy', 'sfsadf', 'sadfsadf', '{\"audio\":\"voip_outgoing_ring.mp3\",\"select\":{\"guide\":\"sdfsdf\",\"options\":[\"sdfsdaf\"]}}', '{\"optionno\":0}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 10:59:13', null);
INSERT INTO `quiz_problems` VALUES ('20', 'Listening', 'LTS', 'Medium', 'sdasdaf', 'fdsdfs', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdfsdffdfafd\"}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 11:00:16', null);
INSERT INTO `quiz_problems` VALUES ('21', 'Listening', 'LWS', 'Easy', 'sdfsdf', 'fsdfasdfsdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdfsdfsadf\"}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 11:02:31', null);
INSERT INTO `quiz_problems` VALUES ('22', 'Listening', 'LWS', 'Easy', 'gsdasfd', 'dfasdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdfsdfsadf\"}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 11:09:18', null);
INSERT INTO `quiz_problems` VALUES ('23', 'Listening', 'LWS', 'Easy', 'sdfsadf', 'sdfasdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdfsdf\"}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 11:11:17', null);
INSERT INTO `quiz_problems` VALUES ('24', 'Listening', 'LWS', 'Easy', 'fsadf', 'fsdfsafd', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdfsdf\"}', '34', 'Auto', '34', '1', '1', null, '2018-02-26 11:16:59', null);
INSERT INTO `quiz_problems` VALUES ('25', 'Listening', 'LWS', 'Easy', 'asdfasd', 'safsdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"asdfasfsda\"}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 11:23:44', null);
INSERT INTO `quiz_problems` VALUES ('26', 'Listening', 'LWS', 'Easy', 'sadfsadf', 'asdfasdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"asdfasdfsdafsdf\"}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 11:25:29', null);
INSERT INTO `quiz_problems` VALUES ('27', 'Listening', 'LWS', 'Easy', 'a', 'asdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdfasfsaf\"}', '21', 'Auto', '32', '1', '1', null, '2018-02-26 11:27:08', null);
INSERT INTO `quiz_problems` VALUES ('28', 'Listening', 'LWS', 'Easy', 'sd', 'sdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdf\"}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 11:28:21', null);
INSERT INTO `quiz_problems` VALUES ('29', 'Listening', 'LWS', 'Easy', 'adf', 'sdfas', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdf\"}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 11:30:52', null);
INSERT INTO `quiz_problems` VALUES ('30', 'Listening', 'LWS', 'Easy', 'sadf', 'sdfasdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdf\"}', '23', 'Auto', '23', '1', '1', null, '2018-02-26 11:32:13', null);
INSERT INTO `quiz_problems` VALUES ('31', 'Listening', 'LWS', 'Easy', 'sdfs', 'sdaf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sdfsfds\"}', '232', 'Auto', '232', '1', '1', null, '2018-02-26 11:32:27', null);
INSERT INTO `quiz_problems` VALUES ('32', 'Listening', 'LWS', 'Easy', 'asdfsa', 'sdfasdf', '{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}', '{\"text\":\"sadfa\"}', '232', 'Auto', '232', '1', '1', null, '2018-02-26 11:33:34', null);
INSERT INTO `quiz_problems` VALUES ('33', 'Listening', 'LSA', 'Easy', 'sdfasf', 'sdafasf', '{\"audio\":\"voip_outgoing_ring.mp3\",\"select\":{\"guide\":\"asdfasf\",\"options\":[\"asdfas\",\"sdfasf\"]}}', '{\"optionno\":[0]}', '232', 'Auto', '23', '1', '1', null, '2018-02-26 11:33:53', null);

-- ----------------------------
-- Table structure for quiz_test
-- ----------------------------
DROP TABLE IF EXISTS `quiz_test`;
CREATE TABLE `quiz_test` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `testname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `testclass` enum('Basic','Bronze','Silver','Gold') COLLATE utf8_unicode_ci NOT NULL,
  `testdegree` enum('Easy','Medium','Hard') COLLATE utf8_unicode_ci NOT NULL,
  `totalmarks` int(10) unsigned NOT NULL,
  `limit_time` int(10) unsigned NOT NULL,
  `count` int(10) unsigned NOT NULL,
  `preset` text COLLATE utf8_unicode_ci,
  `uid` int(11) NOT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_test_testname_index` (`testname`),
  KEY `quiz_test_testclass_index` (`testclass`),
  KEY `quiz_test_testdegree_index` (`testdegree`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of quiz_test
-- ----------------------------

-- ----------------------------
-- Table structure for quiz_testevent
-- ----------------------------
DROP TABLE IF EXISTS `quiz_testevent`;
CREATE TABLE `quiz_testevent` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `start_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `uid` int(11) NOT NULL,
  `test_id` int(11) NOT NULL,
  `problem_list` text COLLATE utf8_unicode_ci,
  `test_status` tinyint(3) unsigned NOT NULL,
  `end_at` timestamp NULL DEFAULT NULL,
  `evaluate_status` tinyint(3) unsigned NOT NULL,
  `evalallow_at` timestamp NULL DEFAULT NULL,
  `evalstart_at` timestamp NULL DEFAULT NULL,
  `evalend_at` timestamp NULL DEFAULT NULL,
  `evaluator_id` int(11) DEFAULT NULL,
  `marks` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_testevent_uid_index` (`uid`),
  KEY `quiz_testevent_test_id_index` (`test_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of quiz_testevent
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `permission` varchar(4) COLLATE utf8_unicode_ci DEFAULT NULL,
  `class` enum('Basic','Bronze','Silver','Gold') COLLATE utf8_unicode_ci NOT NULL,
  `verification_code` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `visited_count` int(11) NOT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_class_index` (`class`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'John', 'Doe', 'admin@quiz.com', 'admin', '21232f297a57a5a743894a0e4a801fc3', 'A', 'Basic', 'cy5obDM4RJL6P2lmcAJB', '12', null, '2018-02-25 18:34:43', null, null);
INSERT INTO `users` VALUES ('2', 'ana', 'titi', 'st1@quiz.com', null, 'eab22f241cfc05ef126bbeb2b301fb70', 'D', 'Basic', 'Pj1GqoiH8v5WobcWYTCw', '2', null, '2018-02-25 18:42:58', '2018-02-25 18:42:58', null);
