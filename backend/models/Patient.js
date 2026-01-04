const { Schema, model } = require("mongoose");

const EmergencyContactSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
},{ _id: false });


const MedicalHistorySchema = new Schema({
  allergies: {
    type: String,
  },
  currentMedications: {
    type: String,
  },
  chronicConditions: {
    type: String,
  },
},{ _id: false });


const PatientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePic: {
    type: String,
  },
  phone: {
    type: String,
  },
  dob: {
    type: Date,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  bloodGrp: {
    type: String,
    enums: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "RARE"],
  },
  emergencyContact : EmergencyContactSchema,
  medicalHistory : MedicalHistorySchema

},{timestamps : true});


// compute age using DOB and add to db
PatientSchema.pre('save',(next) => {
  if(this.dob && this.isModified('dob')){
    const birthDate = new Date(this.dob);
    const diff = Date.now() - birthDate.getTime();
    this.age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  next();
})

module.exports = model('patient' ,PatientSchema);
