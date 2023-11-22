-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: login
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Programming`
--

DROP TABLE IF EXISTS `Programming`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Programming` (
  `task_id` varchar(10) NOT NULL,
  `task_name` varchar(45) DEFAULT NULL,
  `task_description` longtext,
  `created_time` datetime DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `assign_to` varchar(45) DEFAULT NULL,
  `is_complete` tinyint DEFAULT '0',
  `review_text` varchar(255) DEFAULT NULL,
  `review_date` datetime DEFAULT NULL,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Programming`
--

LOCK TABLES `Programming` WRITE;
/*!40000 ALTER TABLE `Programming` DISABLE KEYS */;
INSERT INTO `Programming` VALUES ('T1','Adding product ','Implement adding functions for the product page','2023-11-15 12:11:00','2023-11-23 23:59:00','E2',4,'Please complete this task on time','2023-11-21 12:10:29'),('T2','Edit product','Implement edit functions for product page','2023-11-09 12:00:00','2023-11-15 23:59:00','E2',3,'Please finished by 12 today','2023-11-22 13:06:43'),('T3','Delete product','Implement delete function for product page','2023-11-08 12:00:00','2023-11-13 23:59:00','E3',0,NULL,NULL),('T4','HTML for Cart Page','Implement the UI/UX for the cart page','2023-11-15 12:00:00','2023-11-30 23:59:00','E2',0,NULL,NULL),('T5','Connect DB to server','Connect the database to the server side for the Product data','2023-11-18 12:00:00','2023-11-30 23:59:00','E3',0,NULL,NULL);
/*!40000 ALTER TABLE `Programming` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-22 14:18:27
