create type "public"."target_role" as enum ('all', 'account_owner', 'admin', 'organizer', 'assistant', 'referee', 'coach', 'parent', 'player');

create type "public"."user_role" as enum ('account_owner', 'admin', 'organizer', 'assistant', 'referee', 'coach', 'parent', 'player');

drop policy "delete_own_announcements" on "public"."announcements";

drop policy "insert_own_announcements" on "public"."announcements";

drop policy "select_own_announcements" on "public"."announcements";

drop policy "update_own_announcements" on "public"."announcements";

drop policy "delete_venues" on "public"."venues";

drop policy "insert_venues" on "public"."venues";

drop policy "update_venues" on "public"."venues";

alter table "public"."announcements" drop constraint "announcements_target_role_check";

alter table "public"."users" drop constraint "users_role_check";

alter table "public"."announcements" alter column "target_role" set data type target_role using "target_role"::target_role;

alter table "public"."users" drop column "role";

alter table "public"."users" add column "roles" user_role[] not null;

create policy "delete_own_announcements"
on "public"."announcements"
as permissive
for delete
to public
using ((('admin'::text IN ( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid()))) OR ('organizer'::text IN ( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid())))));


create policy "insert_own_announcements"
on "public"."announcements"
as permissive
for insert
to public
with check ((('admin'::text IN ( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid()))) OR ('organizer'::text IN ( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid())))));


create policy "select_own_announcements"
on "public"."announcements"
as permissive
for select
to public
using (((target_role = 'all'::target_role) OR ((target_role)::text IN ( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid())))));


create policy "update_own_announcements"
on "public"."announcements"
as permissive
for update
to public
using ((('admin'::text IN ( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid()))) OR ('organizer'::text IN ( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid())))))
with check ((('admin'::text IN ( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid()))) OR ('organizer'::text IN ( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid())))));


create policy "delete_venues"
on "public"."venues"
as permissive
for delete
to public
using ((( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid())) = ANY (ARRAY['admin'::text, 'organizer'::text])));


create policy "insert_venues"
on "public"."venues"
as permissive
for insert
to public
with check ((( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid())) = ANY (ARRAY['admin'::text, 'organizer'::text])));


create policy "update_venues"
on "public"."venues"
as permissive
for update
to public
using ((( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid())) = ANY (ARRAY['admin'::text, 'organizer'::text])))
with check ((( SELECT (unnest(users.roles))::text AS unnest
   FROM users
  WHERE (users.id = auth.uid())) = ANY (ARRAY['admin'::text, 'organizer'::text])));



