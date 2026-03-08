const passport = require('passport');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use('google', new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback : true

}, async(req, accessToken, refreshToken, profile, done) => {
    try{
        // Decode state parameter which is in format "userType:intent"
        const stateData = (req.query.state || 'patient:signup').split(':');
        const userType = stateData[0] || 'patient';
        const intent = stateData[1] || 'signup';
        
        const { emails, displayName, photos } = profile;

        const email = emails?.[0]?.value;
        const photo = photos?.[0]?.value;

        if(userType === 'doctor'){
            let user = await Doctor.findOne({ email });
            let isNewUser = false;
            
            if(!user){
                // If login intent and user doesn't exist, return error
                if (intent === 'login') {
                    return done(new Error('USER_NOT_FOUND'));
                }
                
                isNewUser = true;
                user = await Doctor.create({
                    googleId : profile.id,
                    email,
                    name : displayName,
                    profilePic : photo,
                    isVerified : false  // New users need to complete onboarding
                })
            }
            else{
                if(!user.googleId){
                    user.googleId = profile.id
                    user.profilePic = photo
                    await user.save()
                }
            }

            return done(null, { user, type : 'doctor', isNewUser })
        }
        else if(userType === 'patient'){
            let user = await Patient.findOne({ email });
            let isNewUser = false;
            
            if (!user) {
              // If login intent and user doesn't exist, return error
              if (intent === 'login') {
                  return done(new Error('USER_NOT_FOUND'));
              }
              
              isNewUser = true;
              user = await Patient.create({
                googleId: profile.id,
                email,
                name: displayName,
                profilePic: photo,
                isVerified: false,  // New users don't need onboarding
              });
            } else {
              if (!user.googleId) {
                user.googleId = profile.id;
                user.profilePic = photo;
                await user.save();
              }
            }

            return done(null, { user, type: "patient", isNewUser });
        }

    }
    catch(err){
        return done(err);
    }
}))


module.exports = passport;