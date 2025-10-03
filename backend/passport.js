const passport = require('passport');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use('google', new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : process.env.GOOGLE_CALLBACK_URL

}, async(req, accessToken, refreshToken, profile, done) => {
    try{
        const userType = req.query.state || 'patient';
        const { emails, displayName, photos } = profile;

        const email = emails?.[0]?.value;
        const photo = photos?.[0]?.value;

        if(userType === 'doctor'){
            let user = await Doctor.findOne({ email });
            if(!user){
                user = await Doctor.create({
                    googleId : profile.id,
                    name : displayName,
                    profilePic : photo,
                    isVerified : true
                })
            }
            else{
                if(!user.googleId){
                    user.googleId = profile.id
                    user.profilePic = photo
                    await user.save()
                }
            }

            return done(null, { user, type : 'doctor' })
        }
        else if(userType === 'patient'){
            let user = await Patient.findOne({ email });
            if (!user) {
              user = await Patient.create({
                googleId: profile.id,
                name: displayName,
                profilePic: photo,
                isVerified: true,
              });
            } else {
              if (!user.googleId) {
                user.googleId = profile.id;
                user.profilePic = photo;
                await user.save();
              }
            }

            return done(null, { user, type: "patient" });
        }

    }
    catch(err){
        return done(err);
    }
}))


module.exports = passport;