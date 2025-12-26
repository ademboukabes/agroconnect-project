import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Le client est requis"],
    },
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
    },

    // Détails du chargement
    productType: {
        type: String,
        required: [true, "Le type de produit est requis"],
    },
    quantity: {
        type: Number,
        required: [true, "La quantité est requise"],
        min: [1, "La quantité minimale est 1"],
    },
    weight: {
        type: Number,
        required: [true, "Le poids est requis"],
        min: [0.1, "Le poids minimal est 0.1 tonne"],
    },

    // Itinéraire
    pickup: {
        address: {
            type: String,
            required: [true, "L'adresse de ramassage est requise"],
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },
        date: {
            type: Date,
            required: [true, "La date de ramassage est requise"],
        },
    },
    delivery: {
        address: {
            type: String,
            required: [true, "L'adresse de livraison est requise"],
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },
        date: {
            type: Date,
        },
    },

    // Trajet optimisé
    route: {
        distance: {
            type: Number, // en km
        },
        duration: {
            type: Number, // en minutes
        },
        polyline: {
            type: String, // encodé pour affichage sur carte
        },
    },

    // Statut
    status: {
        type: String,
        enum: ["pending", "accepted", "in_transit", "delivered", "cancelled"],
        default: "pending",
    },

    // Prix
    price: {
        type: Number,
        required: [true, "Le prix est requis"],
        min: [1, "Le prix doit être supérieur à 0"],
    },
    priceStatus: {
        type: String,
        enum: ["proposed", "negotiating", "agreed"],
        default: "proposed",
    },
    negotiatedPrice: {
        type: Number,
        min: [0, "Le prix ne peut pas être négatif"],
    },

    // Tracking en temps réel
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

    // Notes et commentaires
    notes: {
        type: String,
    },

}, {
    timestamps: true,
});

// Index géospatial
shipmentSchema.index({ "pickup.location": "2dsphere" });
shipmentSchema.index({ "delivery.location": "2dsphere" });
shipmentSchema.index({ currentLocation: "2dsphere" });

// Index pour recherches fréquentes
shipmentSchema.index({ client: 1, status: 1 });
shipmentSchema.index({ transporter: 1, status: 1 });
shipmentSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Shipment", shipmentSchema);
