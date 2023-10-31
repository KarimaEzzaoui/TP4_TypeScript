// src/models/Book.ts
import { Schema, model, Document } from 'mongoose';

enum Status {
  Read = 'Read',
  ReRead = 'Re-read',
  DNF = 'DNF',
  CurrentlyReading = 'Currently reading',
  ReturnedUnread = 'Returned Unread',
  WantToRead = 'Want to read',
}

enum Format {
  Print = 'Print',
  PDF = 'PDF',
  Ebook = 'Ebook',
  AudioBook = 'AudioBook',
}

interface IBook extends Document {
  title: string;
  author: string;
  numberOfPages: number;
  status: Status;
  price: number;
  numberOfPagesRead: number;
  format: Format;
  suggestedBy: string;
  finished: boolean;
  currentlyAt(pages: number): Promise<void>;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  numberOfPages: { type: Number, required: true },
  status: { type: String, enum: Object.values(Status), required: true },
  price: { type: Number, required: true },
  numberOfPagesRead: { type: Number, default: 0 },
  format: { type: String, enum: Object.values(Format), required: true },
  suggestedBy: { type: String, required: true },
  finished: { type: Boolean, default: false },
});

bookSchema.methods.currentlyAt = async function(pages: number): Promise<void> {
  if (pages >= 0 && pages <= this.numberOfPages) {
    this.numberOfPagesRead = pages;
    // Check if numberOfPagesRead is equal to numberOfPages 
    if (this.numberOfPagesRead === this.numberOfPages) {
        this.finished = true;
        this.status = Status.Read;
    }
    await this.save();
    console.log(pages);
  } else {
    console.log(pages);
    throw new Error('Invalid number of pages');
  }
};

const Book = model<IBook>('Book', bookSchema);

export default Book;
