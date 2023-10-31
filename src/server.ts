// src/server.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from './models/Book';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connection --------------
mongoose.connect('mongodb://127.0.0.1:27017/bookTracker').then(() => {
  console.log('connected successfully');
}).catch((error) => {
  console.log(error);
});

// -----------Manage views ----------
app.get('/book-list', async (req: Request, res: Response) => {
    try {
      const books = await Book.find();
  
      // Calculate percentage
      const booksWithPercentage = books.map(book => {
        const percentage = (book.numberOfPagesRead / book.numberOfPages) * 100 || 0;
        return {
          ...book.toObject(),
          percentage,
        };
      });
  
      res.render('book-listt', { books: booksWithPercentage });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/update-pages/:id', async (req: Request, res: Response) => {
    try {
      const book = await Book.findById(req.params.id);
      console.log(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      console.log(req.body.newPages);
      const newPages = parseInt(req.body.newPages, 10);
      await book.currentlyAt(newPages);
  
      res.redirect('/book-list');
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/add-book', async (req: Request, res: Response) => {
    res.render('add-book');
});

app.post('/add-book', async (req: Request, res: Response) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.redirect('/book-list');
      } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('src/views'));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
