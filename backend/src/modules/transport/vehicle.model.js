import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Le transporteur est requis"],
    },
    vehicleType: {
        type: String,
        required: [true, "Le type de véhicule est requis"],
        enum: ["camion", "semi-remorque", "camionnette", "fourgon"],
    },
    capacity: {
        type: Number,
        required: [true, "La capacité est requise"],
        min: [0.5, "La capacité minimale est 0.5 tonne"],
    },
    licensePlate: {
        type: String,
        required: [true, "La plaque d'immatriculation est requise"],
        unique: true,
        uppercase: true,
    },
    model: {
        type: String,
        required: [true, "Le modèle est requis"],
    },
    year: {
        type: Number,
        required: [true, "L'année est requise"],
        min: [1990, "L'année doit être supérieure à 1990"],
        max: [new Date().getFullYear() + 1, "L'année ne peut pas être dans le futur"],
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    currentLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
    },
}, {
    timestamps: true,
});

// Index géospatial pour recherche par proximité
vehicleSchema.index({ currentLocation: "2dsphere" });

export default mongoose.model("Vehicle", vehicleSchema);
