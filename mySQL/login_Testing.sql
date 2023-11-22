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
-- Table structure for table `Testing`
--

DROP TABLE IF EXISTS `Testing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Testing` (
  `task_id` varchar(10) NOT NULL,
  `task_name` varchar(45) DEFAULT NULL,
  `task_description` longtext,
  `created_time` varchar(45) DEFAULT NULL,
  `due_date` varchar(45) DEFAULT NULL,
  `assign_to` varchar(45) DEFAULT NULL,
  `is_complete` tinyint DEFAULT NULL,
  `review_text` varchar(255) DEFAULT NULL,
  `review_date` datetime DEFAULT NULL,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Testing`
--

LOCK TABLES `Testing` WRITE;
/*!40000 ALTER TABLE `Testing` DISABLE KEYS */;
INSERT INTO `Testing` VALUES ('T1','Check Product page code','Do testing and debugging for the Product page','2023-11-08T13:01','2023-11-19T23:59','E5',0,'ddada','2023-11-22 13:02:13'),('T2','Check Cart Page code','Do testing and debugging for the Cart Page','2023-11-17T12:00','2023-11-27T23:59','E5',4,'please finished on time\n','2023-11-21 12:21:22'),('T3','Check Payment Page Code','Do testing and debugging for the Payment Page','2023-11-22T12:00','2023-11-29T23:59','E6',0,NULL,NULL),('T4','Check Account Page','Do testing and debugging for the Account Page','2023-11-23T12:00','2023-12-05T23:59','E5',0,NULL,NULL);
/*!40000 ALTER TABLE `Testing` ENABLE KEYS */;
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
