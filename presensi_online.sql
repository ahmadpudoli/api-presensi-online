/*
 Navicat Premium Data Transfer

 Source Server         : MySQL LOCALHOST
 Source Server Type    : MySQL
 Source Server Version : 50620
 Source Host           : localhost:3306
 Source Schema         : presensi_online

 Target Server Type    : MySQL
 Target Server Version : 50620
 File Encoding         : 65001

 Date: 12/12/2021 20:20:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for mst_karyawan
-- ----------------------------
DROP TABLE IF EXISTS `mst_karyawan`;
CREATE TABLE `mst_karyawan`  (
  `id_karyawan` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nip` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nama_karyawan` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `alamat_karyawan` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `no_hp` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `jenis_kelamin` char(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'L = Laki-laki, W=Wanita',
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `jabatan` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_karyawan`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of mst_karyawan
-- ----------------------------
INSERT INTO `mst_karyawan` VALUES ('280cd30295bc20f70f564b4384c39f36', '167762', 'Imam Zamakhsari', 'Jl. Maulana Hasanudin', '09090923', 'L', 'imam@gmail.com', 'Kepala Divisi IT');
INSERT INTO `mst_karyawan` VALUES ('32532d70b3519bcfdab2f79452688b13', '109245', 'Andizar', 'Jl. Mungil', '089767672', 'L', 'andizar@gmail.com', '');
INSERT INTO `mst_karyawan` VALUES ('5365976f1a522db86d07cb807fc99c54', '160037', 'Aldi Taher', 'Jl. Kiyai Maja', '08787834', 'L', 'aldi@gmail.com', '');
INSERT INTO `mst_karyawan` VALUES ('a7ef8e9a968560432cf4392e57a3c536', '123456', 'Ahmad Pudoli', 'Jl. Maulana', '098030943', 'L', 'a_achoel@yahoo.co.id', NULL);
INSERT INTO `mst_karyawan` VALUES ('adfb746ea1820b34e4249faa25275c29', '178823', 'Ikhsan', 'Jl. Kemanggisan', '0896565634', 'L', 'ikhsan@gmail.com', '');
INSERT INTO `mst_karyawan` VALUES ('c85f5248cf6f16f385cfe129f9574a88', '140900', 'Zianisaa', 'Jl. Maulana', '089898923', 'W', 'zianisa@gmail.com', 'IT Manager');

-- ----------------------------
-- Table structure for mst_role
-- ----------------------------
DROP TABLE IF EXISTS `mst_role`;
CREATE TABLE `mst_role`  (
  `role_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `role_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of mst_role
-- ----------------------------
INSERT INTO `mst_role` VALUES ('hrd', 'HRD');
INSERT INTO `mst_role` VALUES ('pegawai', 'Pegawai');
INSERT INTO `mst_role` VALUES ('super_admin', 'Super Admin');

-- ----------------------------
-- Table structure for mst_user
-- ----------------------------
DROP TABLE IF EXISTS `mst_user`;
CREATE TABLE `mst_user`  (
  `id_user` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `username` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `salt` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `id_karyawan` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `role` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'admin, user-biasa',
  PRIMARY KEY (`id_user`) USING BTREE,
  INDEX `id_karyawan`(`id_karyawan`) USING BTREE,
  CONSTRAINT `mst_user_ibfk_1` FOREIGN KEY (`id_karyawan`) REFERENCES `mst_karyawan` (`id_karyawan`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of mst_user
-- ----------------------------
INSERT INTO `mst_user` VALUES ('3bf191d093978bac30070a7bba228b24', 'andizar', '$2a$10$UyHh6l5M7oSBVB0c28KXfuc6bF4J8IzP5vaidrly7emLmySWVXH06', '$2a$10$UyHh6l5M7oSBVB0c28KXfu', '32532d70b3519bcfdab2f79452688b13', 'user-biasa');
INSERT INTO `mst_user` VALUES ('4a73c2ccefd2006a53161c0d0aa721b6', 'user1', '$2a$10$BaX5AkWQf7RjUfxRyMQfuu78qCQZkfFmYkESS3NJB//aFnxfJ4nHS', '$2a$10$BaX5AkWQf7RjUfxRyMQfuu', 'a7ef8e9a968560432cf4392e57a3c536', 'user-biasa');
INSERT INTO `mst_user` VALUES ('8d86b5e39ffd94e4751d16a64eb8d409', 'aldi', '$2a$10$kxVM59qAx93blo0W4oPp7O5fz6x9lP8cUvoeVZ/rU7COeZnqTbi12', '$2a$10$kxVM59qAx93blo0W4oPp7O', '5365976f1a522db86d07cb807fc99c54', 'user-biasa');
INSERT INTO `mst_user` VALUES ('edeaa3718573f13778793be02316745d', 'imam', '$2a$10$n9MNXbvGVtwC7mOv3BaSEOBK4LGSL2F45SbINhKOI0kqLE.Vuf.Ga', '$2a$10$n9MNXbvGVtwC7mOv3BaSEO', '280cd30295bc20f70f564b4384c39f36', 'user-biasa');
INSERT INTO `mst_user` VALUES ('f86c8f8aa2777a24097a3b063df10715', 'ikhsan', '$2a$10$/7j04IuOp8ZiakbTBOai3.U51LXrVcPccI2lfBaeDmU/HHNDei2Iy', '$2a$10$/7j04IuOp8ZiakbTBOai3.', 'adfb746ea1820b34e4249faa25275c29', 'user-biasa');
INSERT INTO `mst_user` VALUES ('fb6dbecc44863c99fa841cadb6a76150', 'zianisa', '$2a$10$CA5kCNCYEfqxGlSbCBCPGeQisU0RFUBnQdFDRE7cOKquH.rwjUERG', '$2a$10$CA5kCNCYEfqxGlSbCBCPGe', 'c85f5248cf6f16f385cfe129f9574a88', 'admin');
INSERT INTO `mst_user` VALUES ('fdd3c3882b94aed42f1fb8961d92f751', 'super_admin', '$2a$10$HEQ.5YU1qIpPKMebuhdO1ucMeFb2kN/h3hLrO5EABnRFMAKBBpLYa', '$2a$10$HEQ.5YU1qIpPKMebuhdO1u', NULL, 'admin');

-- ----------------------------
-- Table structure for trs_presensi
-- ----------------------------
DROP TABLE IF EXISTS `trs_presensi`;
CREATE TABLE `trs_presensi`  (
  `id_presensi` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `id_karyawan` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tgl_presensi` date NOT NULL,
  `checkin` datetime(0) NULL DEFAULT NULL,
  `checkin_file_folder` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `checkin_file_nama` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `checkin_file_meta` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `checkout` datetime(0) NULL DEFAULT NULL,
  `checkout_file_folder` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `checkout_file_nama` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `checkout_file_meta` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` char(1) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'C = Cuti, S = Sakit, H = Hadir, A = Alpa',
  `created_by` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` datetime(0) NULL DEFAULT NULL,
  `updated_at` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_presensi`) USING BTREE,
  INDEX `id_karyawan`(`id_karyawan`) USING BTREE,
  CONSTRAINT `trs_presensi_ibfk_1` FOREIGN KEY (`id_karyawan`) REFERENCES `mst_karyawan` (`id_karyawan`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of trs_presensi
-- ----------------------------
INSERT INTO `trs_presensi` VALUES ('058de62c640e5a2b02cb5da889ae45', 'a7ef8e9a968560432cf4392e57a3c536', '2021-12-08', '2021-12-09 15:02:25', 'checkin/', '{\"lat\":\"1000\",\"lang\":\"2000\"}', NULL, '2021-12-08 15:02:34', 'checkout/', '2021-12-10a7ef8e9a968560432cf4392e57a3c536.jpeg', NULL, 'H', NULL, NULL, NULL);
INSERT INTO `trs_presensi` VALUES ('058de62c640e5a2b02cb5da889ae4534', 'a7ef8e9a968560432cf4392e57a3c536', '2021-12-09', '2021-12-09 15:02:25', 'checkin/', '{\"lat\":\"1000\",\"lang\":\"2000\"}', NULL, '2021-12-09 15:02:34', 'checkout/', '2021-12-10a7ef8e9a968560432cf4392e57a3c536.jpeg', NULL, 'H', NULL, NULL, NULL);
INSERT INTO `trs_presensi` VALUES ('e4392933135b1cb04538c3df90fa503e', 'a7ef8e9a968560432cf4392e57a3c536', '2021-12-12', '2021-12-12 13:01:39', 'checkin/', '{\"lat\":\"100\",\"lang\":\"200\"}', NULL, '2021-12-12 13:04:27', 'checkout/', '2021-12-12a7ef8e9a968560432cf4392e57a3c536.jpg', NULL, 'H', NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
