import { Database } from "./supabase";

export type Leagues = "leagues";
export type LeagueSchema = Database["public"]["Tables"]["leagues"];
export type League = Database["public"]["Tables"]["leagues"]["Row"];

export type Teams = "teams";
export type TeamSchema = Database["public"]["Tables"]["teams"];
export type Team = Database["public"]["Tables"]["teams"]["Row"];

export type Players = "players";
export type PlayerSchema = Database["public"]["Tables"]["players"];
export type Player = Database["public"]["Tables"]["players"]["Row"];

export type Events = "events";
export type EventSchema = Database["public"]["Tables"]["events"];
export type Event = Database["public"]["Tables"]["events"]["Row"];

export type Registrations = "registrations";
export type RegistrationSchema = Database["public"]["Tables"]["registrations"];
export type Registration = Database["public"]["Tables"]["registrations"]["Row"];

export type Users = "users";
export type UserSchema = Database["public"]["Tables"]["users"];
export type User = Database["public"]["Tables"]["users"]["Row"];

export type Messages = "messages";
export type MessageSchema = Database["public"]["Tables"]["messages"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
