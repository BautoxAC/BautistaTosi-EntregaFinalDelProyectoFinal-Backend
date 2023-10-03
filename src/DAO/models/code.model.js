import { Schema, model } from 'mongoose'

const schema = new Schema({
  email: { type: String, required: true },
  stringCode: { type: String, required: true, unique: true },
  expire: { type: Number, required: true }
})

export const codeModel = model('recover-codes', schema)
