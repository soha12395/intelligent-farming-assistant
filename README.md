# intelligent-farming-assistant
 Intelligent Farming Assistant (IFA)
A web-based AI-powered platform designed to help Lebanese farmers make better agricultural decisions.

# Project Overview:
IFA addresses three core problems faced by Lebanese farmers:

Difficulty identifying plant diseases without hiring an expert
Lack of guidance on which crops suit their land and season
Improper use of fertilizers and pesticides

# Features

Disease Detection — Upload a plant photo and get instant AI-powered disease identification with treatment and chemical advice
Crop Recommendation — Enter your farm details and get crop suggestions matched to your region, soil, season, and water availability
Farm Profile Management — Save and manage your farm details for personalized recommendations
Detection & Recommendation History — View all past scans and recommendations

# Screenshots
## 1. Home Page
<img width="1347" height="633" alt="Screenshot (104)" src="https://github.com/user-attachments/assets/784aced2-69a6-4855-be08-247f3db92694" />

## 2. Login & Signup Pages
<img width="1283" height="610" alt="Screenshot (105)" src="https://github.com/user-attachments/assets/14340d13-79c6-4c95-90ec-54457fee9ab3" />
<img width="1298" height="580" alt="Screenshot (106)" src="https://github.com/user-attachments/assets/4904672a-82a3-4c1e-9af9-7ec0afd214c1" />

## 3.Dashboard
<img width="1291" height="603" alt="Screenshot (107)" src="https://github.com/user-attachments/assets/9d3dec16-02cd-4a68-abc1-16a9e4387e71" />

## 4.Farm Profile
<img width="1286" height="607" alt="Screenshot (108)" src="https://github.com/user-attachments/assets/0725d4c8-1cce-481b-a6c2-3f6cd4474eef" />

## 5.Crop Recommendation Page

<img width="1338" height="595" alt="Screenshot (110)" src="https://github.com/user-attachments/assets/e8c087be-b947-4b4b-9fa8-36ae07bf9402" />

## 6.Disease Detection Page

<img width="1330" height="618" alt="Screenshot (109)" src="https://github.com/user-attachments/assets/d8eb8dcd-ad55-4c26-b238-edc13ea3abcb" />

## 7.Crop Recommendation History
 
 <img width="1317" height="637" alt="Screenshot (111)" src="https://github.com/user-attachments/assets/7326a164-b8cc-409f-ab50-d113d7348600" />

## 8.Disease Detection history
<img width="1311" height="626" alt="Screenshot (112)" src="https://github.com/user-attachments/assets/37e587ec-fa4d-4acf-ac73-bdfe74f37f86" />


## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Database:** MySQL hosted on Railway
- **AI Model:** Hugging Face — MobileNetV2 trained on PlantVillage dataset
- **Authentication:** JWT (JSON Web Tokens) + bcrypt
- **Image Upload:** Multer
- **Hosting:** Render (backend) + Vercel (frontend)
- **website link:** https://intelligent-farming-assistant.vercel.app/

## AI Model
Disease detection uses the `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification` 
model from Hugging Face, trained on the PlantVillage dataset covering 38 disease classes 
across 14 plants including Tomato, Potato, Apple, Grape, Corn, Pepper, Cherry, and Peach.

## Crop Matching
Crop recommendations use a rule-based matching algorithm that scores each of 22 Lebanese 
crops against 5 criteria: region, soil type, season, water availability, and farm size. 
Crops scoring 40% or higher are returned sorted by best match.

## Data Sources
- Wikipedia — Agriculture in Lebanon
- IDAL Agriculture Sector in Lebanon Factbook 2020
- FAO Lebanon National Agriculture Strategy 2020–2025
- University agricultural extension publications (WVU, NC State, Colorado State, Penn State)

## Disclaimer
Disease treatment information is intended as general guidance only. Farmers should consult 
a certified agronomist before applying any chemicals.

## Authors
Soha Halawi & Adib Hasbany
Lebanese International University
CSCI490 Information Systems Development — Spring 2025–2026



