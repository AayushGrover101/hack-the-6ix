import mongoose from "mongoose";
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const configMongoose = async () => {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hack-the-6ix')
    .then(() => {
      console.log('Connected to MongoDB');
    }).catch(err => {
      console.error('Error connecting to MongoDB:', err);
    }); 
}
