const { model, Schema } = require("mongoose");

const healthcareCategoriesList = [
  "Primary Care",
  "Manage Your Condition",
  "Mental & Behavioral Health",
  "Sexual Health",
  "Children's Health",
  "Senior Health",
  "Women's Health",
  "Men's Health",
  "Wellness",
];

const dailyTimeStrapSchema = new Schema({
    start: {
      type: String,
    },
    end: {
      type: String,
    },
},{ _id: false });

const avaliabilityRangeSchema = new Schema({
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    excludedWeekdays: {
      type: [String],
      default: [],
    },
},{ _id: false });

const DoctorSchema = new Schema({
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
  specialization: {
    type: String,
    enum: [
      "Cardiologist",
      "Dermatologist",
      "Orthopedic",
      "Pediatrician",
      "Neurologist",
      "Gynecologist",
      "General Physician",
      "ENT Specialist",
      "Psychiatrist",
      "Ophthalmologist",
    ],
  },
  category: {
    type: [String],
    enum: healthcareCategoriesList,
    required: false,
  },
  qualification: {
    type: String,
    required: false,
  },
  experience: {
    type: Number,
  },
  about: {
    type: String,
  },
  fees: {
    type: Number,
  },
  hospitalInfo: {
    name: String,
    address: String,
    city: String,
  },
  avaliabiltyRange : avaliabilityRangeSchema,
  dailyTimeSlot : dailyTimeStrapSchema,
  slotDurationMinutes : {
    type : Number,
    default : 30
  },
  isVerified : {
    type : Boolean,
    default : false
  }
});



module.exports = model('Doctor', DoctorSchema);
