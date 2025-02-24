const express = require('express');
const { resolve } = require('path');
const menuModel = require('./menuModel')
require('dotenv').config()
const connectToDb = require('./db');
const { connection } = require('mongoose');
const db = process.env.DB_URI

const app = express();
app.use(express.json())
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/menu', async(req,res)=>{
  try {
    const {name, description, price} = req.body
    const newItem = new menuModel({name,description,price})
    await newItem.save()
    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      Item: newItem

    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error in adding the product to menu'
    })
  }
})

app.get('/menu', async (req,res) => {
  try {
    const menus = await menuModel.find()
    res.status(200).json({menus})
      
  } catch (error) {
    res.status(400).json({
      succes: false,
      message: 'Failed in fetching data'
    })
  }
})

app.listen(port, async() => {
  try {
    connectToDb(db)
    console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.log(error)
  }
});