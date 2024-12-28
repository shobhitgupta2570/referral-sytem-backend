import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  purchaseAmount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now }
},
{
   timestamps: true,
}
);

purchaseSchema.plugin(mongoosePaginate);

const Purchase = mongoose.model('Purchase', purchaseSchema);

export { Purchase };


