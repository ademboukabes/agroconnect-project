import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Veuillez ajouter un nom"],
    },
    email: {
        type: String,
        required: [true, "Veuillez ajouter un email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Veuillez ajouter un email valide",
        ],
    },
    password: {
        type: String,
        required: [true, "Veuillez ajouter un mot de passe"],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "transporter", "admin"],
        default: "user",
    },
    phone: {
        type: String,
        match: [/^[0-9]{10}$/, "Veuillez ajouter un numéro de téléphone valide (10 chiffres)"],
    },
    address: {
        street: String,
        city: String,
        wilaya: String,
        postalCode: String,
    },
    // Profil Client (agriculteur)
    clientProfile: {
        name: String,
        businessType: {
            type: String,
            enum: ["agriculteur", "coopérative", "entreprise", "autre"],
        },
    },
    // Profil Transporteur
    transporterProfile: {
        name: String,
        licenseNumber: String,
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalDeliveries: {
            type: Number,
            default: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
