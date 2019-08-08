import * as mongoose from "mongoose";
import Counter from "./counter";

export interface ArticleModel extends mongoose.Document {
  id: number;
  title: string;
  alias: string;
  authorId: number;
  abstract?: string;
  image?: string;
  content: string;
  views: number;
  likers: number[];
  tags: string[];
  visible: boolean;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}

const articleSchema = new mongoose.Schema<ArticleModel>(
  {
    id: { type: Number, unique: true }, // use auto-increment id, instead of _id generated by database
    title: { type: String, required: true }, // “TensorFlow 初探”
    alias: { type: String, required: true }, // for SEO and URL, “tensor-flow-first-look”
    authorId: { type: Number, required: true },
    abstract: String, // used for preview
    image: String, // title image
    content: { type: String, required: true }, // markdown string
    views: { type: Number, default: 0 },
    likers: [Number], // likers' ids
    tags: [String],
    visible: { type: Boolean, default: false }, // used for review
    createdAt: { type: Date, default: Date.now },
    createdBy: Number,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: Number
  },
  {
    collection: "articles"
  }
);

articleSchema.pre<ArticleModel>("save", function(next) {
  Counter.findByIdAndUpdate(
    "article",
    { $inc: { count: 1 } },
    { rawResult: true, new: true, upsert: true },
    (err, counter) => {
      if (err) {
        return next(err);
      }
      this.id = counter.count;
      next();
    }
  );
});

export default mongoose.model<ArticleModel>("Article", articleSchema);
