import { Book } from "@/types/interfaces";
import * as SQLite from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

const DB_NAME = "favourites.db";

export function useFavourites() {
  const [favourites, setFavourites] = useState<Book[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  // Initialize DB
  useEffect(() => {
    async function initDb() {
      const database = await SQLite.openDatabaseAsync(DB_NAME);
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS favourites (key TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL);
      `);
      setDb(database);
    }
    initDb();
  }, []);

  // Load from storage when DB is ready
  useEffect(() => {
    if (!db) return;

    async function loadFavourites(database: SQLite.SQLiteDatabase) {
      const allRows = await database.getAllAsync<{ key: string; data: string }>(
        "SELECT * FROM favourites"
      );
      const books: Book[] = allRows.map((row) => JSON.parse(row.data));
      setFavourites(books);
    }

    loadFavourites(db);
  }, [db]);

  const isFavourite = useCallback(
    (key: string) => favourites.some((b) => b.key === key),
    [favourites]
  );

  const addFavourite = useCallback(
    async (book: Book) => {
      if (!db || isFavourite(book.key)) return;

      try {
        await db.runAsync(
          "INSERT INTO favourites (key, data) VALUES (?, ?)",
          book.key,
          JSON.stringify(book)
        );
        setFavourites((prev) => [...prev, book]);
      } catch (error) {
        console.error("Error adding favourite:", error);
      }
    },
    [db, isFavourite]
  );

  const removeFavourite = useCallback(
    async (key: string) => {
      if (!db) return;

      try {
        await db.runAsync("DELETE FROM favourites WHERE key = ?", key);
        setFavourites((prev) => prev.filter((b) => b.key !== key));
      } catch (error) {
        console.error("Error removing favourite:", error);
      }
    },
    [db]
  );

  const toggleFavourite = useCallback(
    async (book: Book) => {
      if (isFavourite(book.key)) {
        await removeFavourite(book.key);
      } else {
        await addFavourite(book);
      }
    },
    [isFavourite, addFavourite, removeFavourite]
  );

  return {
    favourites,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
  };
}
