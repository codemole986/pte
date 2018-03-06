/*
SQLyog Enterprise - MySQL GUI v6.11
MySQL - 5.6.21 : Database - quizdb
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

create database if not exists `quizdb`;

USE `quizdb`;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*Table structure for table `migrations` */

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `migrations` */

insert  into `migrations`(`id`,`migration`,`batch`) values (7,'2014_10_12_000000_create_users_table',1),(8,'2014_10_12_100000_create_password_resets_table',1),(9,'2017_12_12_095516_quiz_problems',1),(10,'2017_12_16_143104_quiz_answer',1),(11,'2018_01_13_004541_quiz_test',1),(12,'2018_01_20_040718_quiz_testevent',1),(13,'2018_02_21_062555_quiz_profile',1);

/*Table structure for table `password_resets` */

DROP TABLE IF EXISTS `password_resets`;

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `password_resets` */

/*Table structure for table `profiles` */

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

/*Data for the table `profiles` */

insert  into `profiles`(`id`,`user_id`,`photo`,`phone`,`interest`,`occupation`,`summary`,`website_url`,`created_at`,`updated_at`) values (1,1,'img101.png','23123','sdsf, dsdf','sdfsdff','fsafsdsaf','',NULL,NULL),(2,2,NULL,'45345','sfsf','','','',NULL,NULL);

/*Table structure for table `quiz_answer` */

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
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `quiz_answer` */

insert  into `quiz_answer`(`id`,`testevent_id`,`quiz_id`,`answer`,`examine_uptime`,`evaluate_mark`,`uid`,`start_time`,`end_time`,`checker_id`,`check_time`,`status`,`remember_token`,`created_at`,`updated_at`) values (1,0,5,'{\"optionno\":null}',2,0.00,1,NULL,'2018-02-26 08:58:21',NULL,NULL,0,NULL,'2018-02-26 08:58:21',NULL),(2,0,6,'{\"optionno\":[0,1]}',3,0.00,1,NULL,'2018-02-26 14:06:30',NULL,NULL,0,NULL,'2018-02-26 14:06:30',NULL),(3,0,7,'[]',6,0.00,1,NULL,'2018-02-26 09:24:00',NULL,NULL,0,NULL,'2018-02-26 09:24:00',NULL),(4,0,8,'{\"optionno\":[null]}',10,0.00,1,NULL,'2018-02-26 09:41:03',NULL,NULL,0,NULL,'2018-02-26 09:41:03',NULL),(5,0,9,'{\"optionno\":[[]]}',3,0.00,1,NULL,'2018-02-26 09:45:07',NULL,NULL,0,NULL,'2018-02-26 09:45:07',NULL),(6,0,10,'{\"text\":null,\"audio\":null}',4,0.00,1,NULL,'2018-02-26 09:47:25',NULL,NULL,0,NULL,'2018-02-26 09:47:25',NULL),(7,0,14,'{\"text\":null,\"audio\":null}',1,0.00,1,NULL,'2018-02-26 10:00:29',NULL,NULL,0,NULL,'2018-02-26 10:00:29',NULL),(8,0,13,'{\"audio\":null}',3,0.00,1,NULL,'2018-02-26 10:01:56',NULL,NULL,0,NULL,'2018-02-26 10:01:56',NULL),(9,0,1,'{\"text\":null}',6,0.00,2,NULL,'2018-02-26 13:14:21',NULL,NULL,0,NULL,'2018-02-26 13:14:21',NULL),(10,0,2,'{\"text\":null}',2,0.00,2,NULL,'2018-02-26 13:14:28',NULL,NULL,0,NULL,'2018-02-26 13:14:28',NULL),(11,0,3,'{\"text\":null}',33,0.00,2,NULL,'2018-02-26 13:20:26',NULL,NULL,0,NULL,'2018-02-26 13:20:26',NULL),(12,0,5,'{\"optionno\":1}',4,0.00,2,NULL,'2018-02-26 13:15:01',NULL,NULL,0,NULL,'2018-02-26 13:15:01',NULL),(13,0,10,'{\"text\":null,\"audio\":null}',4,0.00,2,NULL,'2018-02-26 13:15:12',NULL,NULL,0,NULL,'2018-02-26 13:15:12',NULL),(14,0,8,'{\"optionno\":[null]}',5,0.00,2,NULL,'2018-02-26 13:17:17',NULL,NULL,0,NULL,'2018-02-26 13:17:17',NULL),(15,0,9,'{\"optionno\":[[]]}',35,0.00,2,NULL,'2018-02-26 13:17:55',NULL,NULL,0,NULL,'2018-02-26 13:17:55',NULL),(16,0,3,'{\"text\":null}',2,0.00,1,NULL,'2018-02-27 03:17:18',NULL,NULL,0,NULL,'2018-02-27 03:17:18',NULL),(17,0,16,'{\"text\":null}',1,0.00,1,NULL,'2018-02-26 13:23:16',NULL,NULL,0,NULL,'2018-02-26 13:23:16',NULL),(18,0,34,'{\"text\":null}',2,0.00,1,NULL,'2018-02-26 13:23:26',NULL,NULL,0,NULL,'2018-02-26 13:23:26',NULL),(19,0,4,'{\"audio\":null}',33,0.00,1,NULL,'2018-02-26 13:24:08',NULL,NULL,0,NULL,'2018-02-26 13:24:08',NULL),(20,0,35,'{\"optionno\":[1]}',3,0.00,1,NULL,'2018-02-26 14:06:33',NULL,NULL,0,NULL,'2018-02-26 14:06:33',NULL),(21,0,39,'{\"text\":null}',22,0.00,1,NULL,'2018-02-27 07:08:27',NULL,NULL,0,NULL,'2018-02-27 07:08:27',NULL);

/*Table structure for table `quiz_problems` */

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
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `quiz_problems` */

insert  into `quiz_problems`(`id`,`category`,`type`,`degree`,`title`,`guide`,`content`,`solution`,`limit_time`,`evaluate_mode`,`points`,`uid`,`status`,`remember_token`,`created_at`,`updated_at`) values (1,'Writing','WSM','Easy','jsdhjksjk s;ldkjfksdj','fdlkjdklfjfklsjdkl fssfllklkj lsjdfsj dfkljdsfkljdskljdskl','{\"text\":\"dfssdfsaf f safsadf safdsadfa dfsa sadf\"}','{\"text\":\"dfa dasfas fsa fsadf\"}',35,'Auto',34,1,1,NULL,'2018-02-26 07:24:09',NULL),(2,'Writing','WSM','Medium','lkjkldjsjd sksd','dfsdfsdfsfd','{\"text\":\"sfsdfsdf\"}','{\"text\":\"sfsdfsdf\"}',34,'Auto',23,1,1,NULL,'2018-02-26 07:28:33',NULL),(3,'Listening','LWS','Easy','dfdgdfgdf','bvccxvb','{\"text\":null,\"audio\":\"Sleep Away.mp3\"}','{\"text\":\"cbcvbcvbcvbvbcbcx\"}',34,'Auto',34,1,1,NULL,'2018-02-26 07:30:34',NULL),(4,'Listening','LTW','Easy','lkjkldjsjd sksd','sfdfs','{\"audio\":\"Sleep Away.mp3\",\"text\":\"<p>{{}}{{}}\\u200bdfgdfgdfgdg{{}}\\u200b<\\/p>\",\"select\":{\"options\":[\"fsfddsf\",\"sfsdfs\",\"fdgdfdfgdg\"]}}','{\"audio\":null}',34,'Auto',34,1,1,NULL,'2018-02-26 07:35:14','2018-02-26 07:40:03'),(5,'Reading','RSA','Easy','ssdfsfsd','sdfdsf','{\"text\":\"dfsdf\",\"picture\":\"Lighthouse.jpg\",\"select\":{\"guide\":\"sdfsdfsf\",\"options\":[\"sdfsf\",\"sdfsfsdf\",\"sdf\"]}}','{\"optionno\":2}',342,'Auto',324,1,1,NULL,'2018-02-26 07:42:54',NULL),(6,'Reading','RMA','Easy','dssadsa','ASDFSADFA','{\"text\":\"SDFADSFASFSAFS\",\"picture\":\"Desert.jpg\",\"select\":{\"guide\":\"ASDFASDF\",\"options\":[\"sdfsdfs\",\"sdfsfsdf\",\"sdfsdfsdf\",\"dfsfsfsfsfs\"]}}','{\"optionno\":[1,2]}',23,'Auto',23,1,1,NULL,'2018-02-26 09:00:04',NULL),(7,'Reading','RRO','Easy','sdafsdfasd','dsfsdfa','{\"select\":{\"options\":[\"sdfasfaf\",\"bbbbbbbbbb\",\"eeeeeeeeee\",\"ddddddddddddddd\",\"ffffffffffffffffffffff\",\"eeeeeeeeeeeeeeee\"]}}','[]',23,'Auto',23,1,1,NULL,'2018-02-26 09:17:59',NULL),(8,'Reading','RFB','Easy','sdfadfdsaf','asdfasfasd','{\"text\":\"<p>sdfasdffsafda&nbsp;{{}}\\u200b sdfasdfasdf&nbsp;{{}}\\u200b dsfas {{}}\\u200b dfasf<\\/p>\",\"select\":{\"options\":[\"aaa\",\"bbb\",\"vcv\"]}}','{\"optionno\":[0,1,2]}',23,'Auto',23,1,1,NULL,'2018-02-26 09:27:38',NULL),(9,'Reading','RAN','Easy','dsfasdf','dsfdsfsaf','{\"text\":\"<p>asdfsfsd dfd&nbsp;{{}}&nbsp;jkl jljkljlkl&nbsp;{{}}<\\/p>\",\"selectlist\":[{\"options\":[\"a\",\"b\",\"c\",\"d\"]},{\"options\":[\"g\",\"ddd\"]}]}','{\"optionno\":[{\"id\":0,\"option\":1},{\"id\":1,\"option\":1}]}',23,'Auto',23,1,1,NULL,'2018-02-26 09:44:11',NULL),(10,'Speaking','SAL','Easy','fdsafdfsa','sadfa','{\"text\":\"sadfadsfsafdsfasdfsafd\"}','{\"text\":null,\"audio\":\"Arsenal.mp3\"}',232,'Auto',232,1,1,NULL,'2018-02-26 09:46:44','2018-02-26 09:49:02'),(11,'Speaking','SRS','Easy','dsafdsfasdf','sdfsadfsa','{\"text\":null,\"audio\":\"Arsenal.mp3\"}','{\"text\":null,\"audio\":\"Arsenal.mp3\"}',23,'Auto',23,1,1,NULL,'2018-02-26 09:52:25',NULL),(12,'Speaking','SPI','Easy','sdafsdfasd','safsdfa','{\"text\":null,\"picture\":\"Chrysanthemum.jpg\"}','{\"text\":null,\"audio\":\"Arsenal.mp3\"}',23,'Auto',23,1,1,NULL,'2018-02-26 09:55:56',NULL),(13,'Speaking','SRL','Easy','afdfasdf','asdfsafs','{\"text\":\"asdfsafsaf\",\"list\":[{\"audio\":\"Arsenal.mp3\",\"title\":\"asdfsafsafs\"},{\"audio\":\"Arsenal.mp3\",\"title\":\"sdfasfsaf\"},{\"audio\":\"Arsenal.mp3\",\"title\":\"asdfsafsfsafasf\"},{\"audio\":\"Arsenal.mp3\",\"title\":\"asdfasfsadf\"},{\"audio\":\"Arsenal.mp3\",\"title\":\"asdfsafsdf\"}]}','{\"audio\":\"Arsenal.mp3\"}',232,'Auto',2323,1,1,NULL,'2018-02-26 09:57:24',NULL),(14,'Speaking','SSA','Easy','dsafsaf','safdsafs','{\"text\":null,\"audio\":\"Arsenal.mp3\"}','{\"text\":null,\"audio\":\"Arsenal.mp3\"}',232,'Auto',232,1,1,NULL,'2018-02-26 09:59:58',NULL),(15,'Listening','LCD','Easy','dsgfgs','dfgsdgd','{\"audio\":\"voip_outgoing_ring.mp3\",\"text\":\"<p>ffasdfasdfs&nbsp;{{}}&nbsp;sdfsdfsdf&nbsp;{{}}&nbsp;<\\/p>\",\"select\":{\"options\":[\"aaa\",\"bbb\"]}}','{\"audio\":null}',23,'Auto',23,1,1,NULL,'2018-02-26 10:27:37',NULL),(16,'Listening','LWS','Medium','dfsadf','234234','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdfasdf\"}',234,'Auto',234,1,1,NULL,'2018-02-26 10:43:27',NULL),(17,'Listening','LWS','Easy','safsaf','sdfdads','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sadfsafdaf\"}',34,'Auto',34,1,1,NULL,'2018-02-26 10:49:10',NULL),(18,'Listening','LWS','Medium','asdfsdf','dfsdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdfsdfasdf\"}',34,'Auto',34,1,1,NULL,'2018-02-26 10:53:14',NULL),(19,'Listening','LSB','Easy','sfsadf','sadfsadf','{\"audio\":\"voip_outgoing_ring.mp3\",\"select\":{\"guide\":\"sdfsdf\",\"options\":[\"sdfsdaf\"]}}','{\"optionno\":0}',34,'Auto',34,1,1,NULL,'2018-02-26 10:59:13',NULL),(20,'Listening','LTS','Medium','sdasdaf','fdsdfs','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdfsdffdfafd\"}',34,'Auto',34,1,1,NULL,'2018-02-26 11:00:16',NULL),(21,'Listening','LWS','Easy','sdfsdf','fsdfasdfsdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdfsdfsadf\"}',34,'Auto',34,1,1,NULL,'2018-02-26 11:02:31',NULL),(22,'Listening','LWS','Easy','gsdasfd','dfasdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdfsdfsadf\"}',34,'Auto',34,1,1,NULL,'2018-02-26 11:09:18',NULL),(23,'Listening','LWS','Easy','sdfsadf','sdfasdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdfsdf\"}',34,'Auto',34,1,1,NULL,'2018-02-26 11:11:17',NULL),(24,'Listening','LWS','Easy','fsadf','fsdfsafd','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdfsdf\"}',34,'Auto',34,1,1,NULL,'2018-02-26 11:16:59',NULL),(25,'Listening','LWS','Easy','asdfasd','safsdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"asdfasfsda\"}',23,'Auto',23,1,1,NULL,'2018-02-26 11:23:44',NULL),(26,'Listening','LWS','Easy','sadfsadf','asdfasdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"asdfasdfsdafsdf\"}',23,'Auto',23,1,1,NULL,'2018-02-26 11:25:29',NULL),(27,'Listening','LWS','Easy','a','asdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdfasfsaf\"}',21,'Auto',32,1,1,NULL,'2018-02-26 11:27:08',NULL),(28,'Listening','LWS','Easy','sd','sdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdf\"}',23,'Auto',23,1,1,NULL,'2018-02-26 11:28:21',NULL),(29,'Listening','LWS','Easy','adf','sdfas','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdf\"}',23,'Auto',23,1,1,NULL,'2018-02-26 11:30:52',NULL),(30,'Listening','LWS','Easy','sadf','sdfasdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdf\"}',23,'Auto',23,1,1,NULL,'2018-02-26 11:32:13',NULL),(31,'Listening','LWS','Easy','sdfs','sdaf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sdfsfds\"}',232,'Auto',232,1,1,NULL,'2018-02-26 11:32:27',NULL),(32,'Listening','LWS','Easy','asdfsa','sdfasdf','{\"text\":null,\"audio\":\"voip_outgoing_ring.mp3\"}','{\"text\":\"sadfa\"}',232,'Auto',232,1,1,NULL,'2018-02-26 11:33:34',NULL),(33,'Listening','LSA','Easy','sdfasf','sdafasf','{\"audio\":\"voip_outgoing_ring.mp3\",\"select\":{\"guide\":\"asdfasf\",\"options\":[\"asdfas\",\"sdfasf\"]}}','{\"optionno\":[0]}',232,'Auto',23,1,1,NULL,'2018-02-26 11:33:53',NULL),(34,'Listening','LWS','Easy','adfasdfasd','sdfasdf234242342342342323423afasdff423423','{\"text\":null,\"audio\":null}','{\"text\":\"fdfaafadfdsf\"}',3,'Auto',3,2,1,NULL,'2018-02-26 13:22:09','2018-02-26 13:22:29'),(35,'Reading','RMA','Easy','erfefsdf','sdfdfsdfsdfsfsd','{\"text\":null,\"picture\":\"capture_05.png\",\"select\":{\"guide\":\"afdafasdf\",\"options\":[\"adfasdfafasd\",\"afadfdas\",\"afdfasf\"]}}','{\"optionno\":[null]}',2343,'Auto',2334,1,1,NULL,'2018-02-26 13:24:57',NULL),(36,'Listening','LWS','Easy','sdfsdf','saf','{\"text\":null,\"audio\":null}','{\"text\":\"asdf\"}',23,'Auto',23,1,1,NULL,'2018-02-26 13:53:50',NULL),(37,'Listening','LWS','Easy','asdfas','saf','{\"text\":null,\"audio\":null}','{\"text\":\"asdfasf\"}',23,'Auto',23,1,1,NULL,'2018-02-26 13:54:43',NULL),(38,'Listening','LWS','Easy','asdfasdf','asdfaf','{\"text\":null,\"audio\":null}','{\"text\":\"asdfasdfasd\"}',23,'Auto',23,1,1,NULL,'2018-02-26 14:04:21',NULL),(39,'Listening','LWS','Easy','asdfa','sadf','{\"text\":null,\"audio\":null}','{\"text\":\"asdfasdf\"}',23,'Auto',23,1,1,NULL,'2018-02-26 14:05:09',NULL);

/*Table structure for table `quiz_test` */

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

/*Data for the table `quiz_test` */

/*Table structure for table `quiz_testevent` */

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

/*Data for the table `quiz_testevent` */

/*Table structure for table `users` */

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

/*Data for the table `users` */

insert  into `users`(`id`,`first_name`,`last_name`,`email`,`address`,`password`,`permission`,`class`,`verification_code`,`visited_count`,`remember_token`,`created_at`,`updated_at`,`deleted_at`) values (1,'John','Doe','admin@quiz.com','admin\'s addresss','21232f297a57a5a743894a0e4a801fc3','A','Basic','cy5obDM4RJL6P2lmcAJB',25,NULL,'2018-02-25 18:34:43','2018-02-26 13:13:05',NULL),(2,'ana','titi','st1@quiz.com','my address','25f9e794323b453885f5181f1b624d0b','B','Basic','Pj1GqoiH8v5WobcWYTCw',5,NULL,'2018-02-25 18:42:58','2018-02-26 13:18:23',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
