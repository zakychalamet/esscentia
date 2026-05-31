import mysql from 'mysql2/promise';
import { journalArticles } from './lib/journal-articles';

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'parfum',
  });

  await connection.query('DELETE FROM journal_articles');

  for (let i = 0; i < journalArticles.length; i++) {
    const article = journalArticles[i];
    await connection.query(
      `INSERT INTO journal_articles
        (slug, title, excerpt, content, category, published_date, read_time, image, author, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        article.slug,
        article.title,
        article.excerpt,
        JSON.stringify(article.content),
        article.category,
        article.date,
        article.readTime,
        article.image,
        article.author,
        i === 0,
      ]
    );
  }

  console.log(`Seeded ${journalArticles.length} journal articles`);
  await connection.end();
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
