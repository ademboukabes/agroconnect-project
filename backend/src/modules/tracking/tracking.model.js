import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shipment",
        required: [true, "L'expédition est requise"],
        unique: true,
    },

    // Historique des positions GPS
    locations: [{
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        speed: {
            type: Number, // en km/h
            default: 0,
        },
        heading: {
            type: Number, // direction en degrés (0-360)
            default: 0,
        },
    }],

    // Événements importants
    events: [{
        type: {
            type: String,
            enum: ["pickup", "in_transit", "stop", "delivered", "issue"],
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
            },
        },
        note: {
            type: String,
        },
    }],

}, {
    timestamps: true,
});

// Index pour recherche rapide
trackingSchema.index({ "events.timestamp": -1 });

export default mongoose.model("Tracking", trackingSchema);
