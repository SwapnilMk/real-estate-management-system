import mongoose, { Document, Schema } from "mongoose";

export interface ISearch extends Document {
  name: string;
  filters: {
    type?: string;
    priceRange?: string;
    beds?: string;
    baths?: string;
    propertyType?: string;
  };
  user: mongoose.Types.ObjectId;
}

const SearchSchema = new Schema<ISearch>(
  {
    name: { type: String, required: true },
    filters: {
      type: { type: String },
      priceRange: { type: String },
      beds: { type: String },
      baths: { type: String },
      propertyType: { type: String },
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Search = mongoose.model<ISearch>("Search", SearchSchema);
export default Search;
