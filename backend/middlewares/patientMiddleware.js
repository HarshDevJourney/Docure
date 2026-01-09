const Patient = require("../models/Patient");

exports.getPatientProfile = async (req, res, next) => {
    try{
        const patient = Patient.findById(req.user._id).select('-password -googleId');
        res.ok(patient, "Patient Profile Fetched Successful");
    }
    catch(err){
        res.serverError("Patient Profile Fetch Failed");
    }
}

exports.updatePatientProfile = async (req, res, next) => {
    try{
        const updated = { ...req.body };
        delete updated.password;
        updated.isVerified = true;

        if(updated.dob){
            const birthDate = new Date(updated.dob);
            const diff = Date.now() - birthDate.getTime();
            updated.age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }
    
        const updatedPatient = await Patient.findByIdAndUpdate(req.user._id, updated, { new : true }).select('-password -googleId');
        
        res.ok(updatedPatient, "Patient Profile Updated Successfully");
    }
    catch(err){
        res.serverError("Patient Profile Update Failed", [err.message]);
    }
}