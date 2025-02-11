import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { removeFieldsPlugin } from './plugins';
import { MESSAGES } from '../constants';
import { userInterface } from '../interfaces';

const userSchema: Schema<userInterface.IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: MESSAGES.ENTER_VALID_EMAIL,
      },
      index: true, // Add index for faster queries
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Do not return password by default
      validate: {
        validator: function (value: string) {
          // Regular expression to check if the password contains at least one letter and one number
          const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
          return passwordRegex.test(value);
        },
        message: MESSAGES.PASSWORD_REQUIREMENTS,
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(removeFieldsPlugin, ['__v', 'password', 'createdAt', 'updatedAt', 'passwordChangedAt']);

// Middleware to hash the password before saving
userSchema.pre<userInterface.IUser>('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.passwordChangedAt = new Date();
  }
  next();
});

// Method to compare hashed passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add a virtual or instance method to check if the password has been changed after a token was issued
userSchema.methods.hasPasswordChangedAfter = function (JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User: Model<userInterface.IUser> = mongoose.model<userInterface.IUser>('User', userSchema);

export default User;
