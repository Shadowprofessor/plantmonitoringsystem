create database iothub;
CREATE TABLE IF NOT EXISTS iothub.MQTTNodered (
    id INT AUTO_INCREMENT PRIMARY KEY,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT,
    humidity FLOAT,
    moisture INT,
    voltage FLOAT

);

select * from iothub.MQTTNodered