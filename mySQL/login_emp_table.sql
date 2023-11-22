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
-- Table structure for table `emp_table`
--

DROP TABLE IF EXISTS `emp_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emp_table` (
  `emp_id` varchar(10) NOT NULL,
  `emp_username` varchar(45) DEFAULT NULL,
  `emp_password` varchar(255) DEFAULT NULL,
  `emp_name` varchar(45) DEFAULT NULL,
  `emp_point` int DEFAULT NULL,
  `emp_group` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emp_table`
--

LOCK TABLES `emp_table` WRITE;
/*!40000 ALTER TABLE `emp_table` DISABLE KEYS */;
INSERT INTO `emp_table` VALUES ('E1','emilyGJ','$2b$10$fL7QrmV8y8a1PDwkw0rDue8j3yw.7QxMPMTKwV2VSyIFbJaKYr/nq','Emily Grace Johnson',NULL,'Programming'),('E2','oliviaRW','$2b$10$uYGj7H348AAaR4Pa6t48UOCjjApoqSBH7P5tsTbDeUrd64T5xz1nC','Olivia Rose Williams',NULL,'Programming'),('E3','christopherTB','$2b$10$yDd7iF9c5RpUEQ6hKdrKSu8ELJM.e3fE60i0HDMBmGv4tDPfuC4GS','Christopher Thomas Brown',NULL,'Programming'),('E4','sophiaET','$2b$10$EFRFAfollT7QI71pgJZkweDOQBGs9hWqSJxu/ytUPBENACXH9w7rW','Sophia Elizabeth Taylor',NULL,'Testing'),('E5','williamJA','$2b$10$KmltMMyOudt1RV4hbWceFOXH2FjMZhRDLEZS7j8/jwgIcIdSikAeq','William Joseph Anderson',NULL,'Testing'),('E6','avaMW','$2b$10$nPV9xiA6UGyuRfQPhKP24u0jpj8fFwML1UVigLfYYlaJYolT/E3J2','Ava Marie White',NULL,'Testing');
/*!40000 ALTER TABLE `emp_table` ENABLE KEYS */;
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
