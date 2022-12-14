const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const SensorData = sequelize.define('sensor-data', {
    serial: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
})

const app = express();
app.use(express.json());

const dataList = [];

app.get('/data', async (req, res) => {
    try{
        const allData = await SensorData.findAll();  
        res.status(200).send(allData);
        return;
    }
    catch(e) {
        return;
    }
    
});

app.post('/data', async (req, res) => {
    try {
        const data = req.body;
        const sensorData = await SensorData.create(data);  
        res.status(201).send(sensorData);
        return;
    }
    catch(e) {
        return;
    }
    
});

app.listen({ port: 8080 }, () => {
    try {
        sequelize.authenticate();
        console.log('Connected to the database');

        sequelize.sync({ alter: true });
        console.log('Sync to database');
    } catch(e) {
        console.log("Coudn't connect to the database ", e);
    }
    console.log('Server is running');
});