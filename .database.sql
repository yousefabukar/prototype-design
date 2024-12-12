CREATE DATABASE  IF NOT EXISTS `submissions_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `submissions_management`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: submissions_management
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `assignment_title` varchar(255) NOT NULL,
  `module_name` varchar(255) NOT NULL,
  `due_date` date NOT NULL,
  `image_filepath` varchar(255) DEFAULT NULL,
  `vcpu_value` int NOT NULL,
  `memory_value` int NOT NULL,
  PRIMARY KEY (`assignment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,'Advanced Advanced Advanced News Classifier','OOP','2024-12-15','test/path',1,256000000),(2,'Firewall.c','OSSP','2024-12-20','test/path',2,512000000),(3,'Snake Game','OOP','2024-12-31','test/path',2,256000000),(4,'Test 1','FP','2024-12-31','test/path',5,512000000),(5,'Test 2','FP','2024-11-29','test/path',3,256000000),(6,'Homework','FP','2024-12-31','test/path',7,512000000),(9,'New','FP','2024-12-31',NULL,1,1);
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observability`
--

DROP TABLE IF EXISTS `observability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observability` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `type` enum('error','info') DEFAULT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observability`
--

LOCK TABLES `observability` WRITE;
/*!40000 ALTER TABLE `observability` DISABLE KEYS */;
INSERT INTO `observability` VALUES (1,'info','Successfully retrieved 6 assignments','2024-12-12 11:15:24'),(2,'info','Retrieved 0 submissions for assignment 5','2024-12-12 11:15:31'),(3,'info','Retrieved 2 submissions for assignment 1','2024-12-12 11:15:34'),(4,'info','Retrieved 1 submissions for assignment 3','2024-12-12 11:15:37'),(5,'info','Retrieved 2 submissions for assignment 2','2024-12-12 11:15:55'),(6,'info','Retrieved 1 submissions for assignment 4','2024-12-12 11:15:57'),(7,'info','Assignment created successfully: ID 9','2024-12-12 11:17:08'),(8,'info','Successfully retrieved 7 assignments','2024-12-12 11:17:08');
/*!40000 ALTER TABLE `observability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_submissions`
--

DROP TABLE IF EXISTS `student_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_submissions` (
  `submission_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `submission_date` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `result_files` json DEFAULT NULL,
  `mark` int DEFAULT NULL,
  `feedback` text,
  `assignment_id` int DEFAULT NULL,
  `logs` text,
  `submission_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`submission_id`),
  KEY `idx_submission_date` (`submission_date`),
  KEY `idx_submission_id` (`submission_id`),
  KEY `fk_submission_assignment` (`assignment_id`),
  CONSTRAINT `fk_submission_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`assignment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24021 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_submissions`
--

LOCK TABLES `student_submissions` WRITE;
/*!40000 ALTER TABLE `student_submissions` DISABLE KEYS */;
INSERT INTO `student_submissions` VALUES (23982,'Sam','2024-02-12','Ready to be marked','2024-12-11 01:04:27',NULL,NULL,NULL,1,NULL,NULL),(24015,'Matt','2024-02-11','Ready to be marked','2024-12-11 01:04:27',NULL,NULL,NULL,1,NULL,NULL),(24016,'Sarah','2024-12-11','Ready to be marked','2024-12-11 21:27:37',NULL,NULL,NULL,2,NULL,NULL),(24018,'John','2024-12-11','Ready to be marked','2024-12-11 21:28:22',NULL,NULL,NULL,2,NULL,NULL),(24019,'Amy','2024-12-11','Ready to be marked','2024-12-11 21:28:32',NULL,NULL,NULL,3,NULL,NULL),(24020,'Louisa','2024-01-01','Ready to be marked','2024-12-11 21:28:40',NULL,NULL,NULL,4,NULL,NULL);
/*!40000 ALTER TABLE `student_submissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-12 12:15:36
