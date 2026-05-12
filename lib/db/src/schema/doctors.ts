import { pgTable, serial, text, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const doctorsTable = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  experience: integer("experience").notNull().default(1),
  fee: real("fee").notNull().default(100),
  available: boolean("available").notNull().default(true),
  imageUrl: text("image_url").notNull().default(""),
  bio: text("bio").notNull().default(""),
  location: text("location").notNull().default(""),
});

export const insertDoctorSchema = createInsertSchema(doctorsTable).omit({ id: true });
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctorsTable.$inferSelect;
