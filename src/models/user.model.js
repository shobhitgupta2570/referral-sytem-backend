import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    referralCode: {
      type: String,
      unique: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre('save', async function (next) { 
  if (!this.referralCode) {
     const generateReadableReferralCode = async () => { 
      const adjectives = ["Cool", "Fast", "Smart", "Happy", "Lucky"]; 
      const nouns = ["Tiger", "Eagle", "Ninja", "Wizard", "Racer"];
      let code; 
      let user; 
      do { 
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]; 
        const noun = nouns[Math.floor(Math.random() * nouns.length)]; 
        const number = Math.floor(1000 + Math.random() * 9000); // random 4-digit number 
        code = `${adjective}${noun}${number}`; 
        user = await mongoose.model('User').findOne({ referralCode: code });
       } while (user);
        return code; 
      }; 
      this.referralCode = await generateReadableReferralCode();
     }
      next(); 
    });

// Check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Check if the user is a descendant of another user
userSchema.methods.isDescendantOf = async function (ancestorId) {
  let currentParentId = this.parentId;

  while (currentParentId) {
    if (currentParentId.equals(ancestorId)) {
      return true;
    }
    const parentUser = await mongoose.model('User').findById(currentParentId);
    if (!parentUser) break;
    currentParentId = parentUser.parentId;
  }

  return false;
};

export const User = mongoose.model('User', userSchema);
