# 🧠 PriceCast

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?logo=tensorflow&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?logo=pandas)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright)
![BeautifulSoup](https://img.shields.io/badge/BeautifulSoup-4B8BBE)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react)
![RabbitMQ](https://img.shields.io/badge/-RabbitMQ-FF6600?style=flat&logo=rabbitmq&logoColor=white)

---

## 📦 Overview

**PriceCast** is an AI-powered platform that monitors product prices across e-commerce websites, analyzes historical data, and predicts future price trends.  
It combines **web scraping**, **data processing**, and **machine learning** to help users make smarter purchasing or business decisions.

---


## ⚙️ Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, TailwindCSS |
| **Backend** | FastAPI, Redis |
| **Scraping** | Playwright, BeautifulSoup, AsyncIO |
| **Data Processing** | Pandas, NumPy |
| **Machine Learning** | TensorFlow (LSTM) |
| **Database** | MongoDB |
| **Deployment** | Docker, Nginx (optional) |

---

## 🚀 Features

- 🔍 **Smart scraping** with Playwright + BeautifulSoup  
- 🧠 **AI price forecasting** using TensorFlow LSTMs  
- ⚡ **FastAPI backend** with async endpoints and Redis caching  
- 📊 **Interactive dashboard** built with React  
- 🗃️ **MongoDB data layer** for scalable historical storage  

---

## 🧠 Future Ideas

- Integrate sentiment analysis from reviews  
- Add alert system for price drops  
- Build API marketplace for 3rd-party integrations  

## Setup RabbitMQ

``` sudo apt update
sudo apt install rabbitmq-server -y
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
sudo rabbitmq-plugins enable rabbitmq_management
```