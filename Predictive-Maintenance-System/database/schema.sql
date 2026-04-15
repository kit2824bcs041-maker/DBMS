-- database/schema.sql
-- Predictive Maintenance System Database Schema

CREATE DATABASE IF NOT EXISTS predictive_maintenance;
USE predictive_maintenance;

-- Devices Table: Represents industrial equipment/machines
CREATE TABLE IF NOT EXISTS Devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    location VARCHAR(255),
    installation_date DATE,
    status ENUM('Active', 'Maintenance', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensors Table: Sensors attached to a specific device
CREATE TABLE IF NOT EXISTS Sensors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., 'Temperature', 'Vibration', 'Pressure'
    unit VARCHAR(20) NOT NULL,
    min_threshold FLOAT,
    max_threshold FLOAT,
    FOREIGN KEY (device_id) REFERENCES Devices(id) ON DELETE CASCADE
);

-- Readings Table: High-frequency IoT data
CREATE TABLE IF NOT EXISTS Readings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sensor_id INT NOT NULL,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES Sensors(id) ON DELETE CASCADE
);
CREATE INDEX idx_sensor_timestamp ON Readings(sensor_id, timestamp);

-- Maintenance Logs Table: Tracks issues, anomalies, and successful repairs
CREATE TABLE IF NOT EXISTS MaintenanceLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    issue_description TEXT NOT NULL,
    log_type ENUM('Routine', 'Anomaly Detect', 'Repair') DEFAULT 'Routine',
    is_resolved BOOLEAN DEFAULT FALSE,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES Devices(id) ON DELETE CASCADE
);
