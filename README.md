## Supabase

### Commands

#### Basic Commands

`supabase start` - Start the Supabase server
`supabase stop` - Stop the Supabase server
`supabase status` - Check the status of the Supabase server

#### Migration and DB Commands

`supabase db pull --linked` - Pull the latest database schema from the Supabase server
`supabase db push --linked` - Push the latest database schema to the Supabase server
`supabase migration up` - Run all pending migrations

#### Code Generation Commands

`supabase gen types typescript --linked` - Generate TypeScript types for the database schema
`npx supabase gen types typescript --linked > ../../shared/src/supabase.ts`
