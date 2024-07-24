drop policy "delete_own_announcements" on "public"."announcements";

drop policy "insert_own_announcements" on "public"."announcements";

drop policy "update_own_announcements" on "public"."announcements";

drop policy "delete_venues" on "public"."venues";

drop policy "insert_venues" on "public"."venues";

drop policy "update_venues" on "public"."venues";

alter table "public"."announcements" drop constraint "announcements_target_role_check";

alter table "public"."users" drop constraint "users_role_check";

alter table "public"."announcements" add constraint "announcements_target_role_check" CHECK (((target_role)::text = ANY ((ARRAY['all'::character varying, 'admin'::character varying, 'organizer'::character varying, 'assistant'::character varying, 'referee'::character varying, 'coach'::character varying, 'parent'::character varying, 'player'::character varying])::text[]))) not valid;

alter table "public"."announcements" validate constraint "announcements_target_role_check";

alter table "public"."users" add constraint "users_role_check" CHECK (((role)::text = ANY ((ARRAY['account_owner'::character varying, 'admin'::character varying, 'organizer'::character varying, 'assistant'::character varying, 'referee'::character varying, 'coach'::character varying, 'parent'::character varying, 'player'::character varying])::text[]))) not valid;

alter table "public"."users" validate constraint "users_role_check";

create policy "delete_own_announcements"
on "public"."announcements"
as permissive
for delete
to public
using (((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = ANY ((ARRAY['admin'::character varying, 'organizer'::character varying])::text[])));


create policy "insert_own_announcements"
on "public"."announcements"
as permissive
for insert
to public
with check (((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = ANY ((ARRAY['admin'::character varying, 'organizer'::character varying])::text[])));


create policy "update_own_announcements"
on "public"."announcements"
as permissive
for update
to public
using (((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = ANY ((ARRAY['admin'::character varying, 'organizer'::character varying])::text[])))
with check (((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = ANY ((ARRAY['admin'::character varying, 'organizer'::character varying])::text[])));


create policy "delete_venues"
on "public"."venues"
as permissive
for delete
to public
using (((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = ANY ((ARRAY['admin'::character varying, 'organizer'::character varying])::text[])));


create policy "insert_venues"
on "public"."venues"
as permissive
for insert
to public
with check (((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = ANY ((ARRAY['admin'::character varying, 'organizer'::character varying])::text[])));


create policy "update_venues"
on "public"."venues"
as permissive
for update
to public
using (((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = ANY ((ARRAY['admin'::character varying, 'organizer'::character varying])::text[])))
with check (((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = ANY ((ARRAY['admin'::character varying, 'organizer'::character varying])::text[])));



