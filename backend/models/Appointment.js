const { Schema , model } = require("mongoose");


const PrescriptionSchema = new Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["image", "pdf"],
      required: true,
    },
    fileName: String,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);


const PaymentDetailSchema = new Schema({
    doctorFees : {
        type : Number,
        required : true
    },
    platformFees : {
        type : Number,
        required : true
    },
    totalFees : {
        type : Number,
        required : true
    },
    paymentStatus : {
        type : String,
        enum : ['Pending', 'Paid', 'Refunded', 'Failed'],
        default : 'Pending'
    },

},
{ _id: false, timestamps: true })



const AppointmentSchema = new Schema({
    patientID : {
        type : Schema.Types.ObjectId,
        ref : 'Patient',
        required : true
    },
    doctorID : {
        type : Schema.Types.ObjectId,
        ref : "Doctor",
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    slotStart : {
        type : Date,
        required : true
    },
    slotEnd : {
        type : Date,
        required : true
    },
    consultationType : {
        type : String,
        enum : ['video', 'audio'],
        default : 'video'
    },
    status : {
        type : String,
        enum : ['Scheduled', 'Completed', 'Cancelled', 'Progress'],
        default : 'Scheduled'
    },
    symptoms : {
        type : String,
        default : ''
    },
    medicalHistory : {
        type : String,
        default : ''
    },
    zegocloudRoomID : {
        type : String,
        default : ''
    },
    pescription : PrescriptionSchema,
    notes : {
        type : String,
        default : ''
    },
    isFollowUp : {
        type : Boolean,
        default : false
    },
    paymentDetails : PaymentDetailSchema,
    payoutDetails : {
        payoutStatus : {
            type : String,
            enum : ['Pending', 'Paid', 'Cancelled'],
            default : 'Pending'
        },
        payoutDate : Date
    },
    razorpayOrderID : {
        type : String
    },
    razorpayPaymentID : {
        type : String
    },
    razorpaySignature : {
        type : String
    },
    paymentDate : {
        type : Date
    },
    paymentExpiresAt : {
        type : Date,
        default: null
    },
    cancelledReason : {
        type : String,
        enum : ['UserCancellation', 'NoShow', 'PaymentFailed'],
        default: null
    }

}, { timestamps : true })

AppointmentSchema.index({ doctorID : 1, date : 1, slotStart : 1}, { unique : true })

module.exports = model('Appointment', AppointmentSchema)