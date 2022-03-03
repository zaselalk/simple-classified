<div align="center">
  <h1>Simple Classified</h1>
   <img
      src="https://pbs.twimg.com/media/FM4wCJ0VEAAsOT0?format=jpg&name=large"
      alt="Simple Classified Landing Page"/>
</div>

## Features
 - User can Register and Login
 - User can submit their Ad with images,Location, price and description.
 - User can edit or delete their own ad after posting.
 
 ## Requirements
  - Nodejs installed
  - Mongo db connection
  -  <a href= "https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/dl7ux4wyyctegpw106ox?t=default">Cloudinary Account</a>

## Setup guide
  - Clone Project
     - `git clone git@github.com:zaselalk/simple-classified.git`
 - Copy rename .env.example file as .env
 - Complete following deatils on renamed file
     - SECRET=Some Random Secret
     - CLOUDINARY_CLOUD_NAME= Clodinary cloud name
     - CLOUDINARY_KEY= Clodinary API key
     - CLOUDINARY_SECRET= Clodinary API secret
     - DB_URL = Mongo DB url - Default : mongodb://localhost:27017/classified
  - Install dependencies with `npm install`
  - start application with `npm run dev` or `npm start`

### Need more updated or help ? connect with me <a href= "https://twitter.com/zaselalk">on Twiiter</a>
