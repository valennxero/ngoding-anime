import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { WatchStatus } from "../types/mylist";

export const mylistEntries = sqliteTable(
  "mylist_entries",
  {
    userId: text("user_id").notNull(),
    animeId: integer("anime_id").notNull(),
    title: text("title").notNull(),
    imageUrl: text("image_url"),
    status: text("status").$type<WatchStatus>().notNull(),
    rating: integer("rating"),
    comments: text("comments").notNull().default(""),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.animeId] })]
);