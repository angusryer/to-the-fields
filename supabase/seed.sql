-- Seed data for Users
INSERT INTO
    Users (
        id,
        name,
        email,
        contact_info,
        roles,
        created_at,
        updated_at
    )
VALUES
    (
        gen_random_uuid(),
        'John Doe',
        'john.doe@example.com',
        '{"phone": "123-456-7890"}',
        ARRAY ['account_owner'] :: user_role [],
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        'Jane Smith',
        'jane.smith@example.com',
        '{"phone": "987-654-3210"}',
        ARRAY ['admin'] :: user_role [],
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid(),
        'Bob Johnson',
        'bob.johnson@example.com',
        '{"phone": "555-555-5555"}',
        ARRAY ['coach'] :: user_role [],
        NOW(),
        NOW()
    );

-- Seed data for Leagues
INSERT INTO
    Leagues (
        id,
        name,
        account_owner_id,
        created_at,
        updated_at
    )
VALUES
    (
        gen_random_uuid(),
        'Youth Soccer League',
        (
            SELECT
                id
            FROM
                Users
            WHERE
                name = 'John Doe'
        ),
        NOW(),
        NOW()
    );

-- Seed data for Teams
INSERT INTO
    Teams (
        id,
        name,
        league_id,
        coach_id,
        created_at,
        updated_at
    )
VALUES
    (
        gen_random_uuid(),
        'Anytown Soccer Team',
        (
            SELECT
                id
            FROM
                Leagues
            WHERE
                name = 'Youth Soccer League'
        ),
        (
            SELECT
                id
            FROM
                Users
            WHERE
                name = 'Bob Johnson'
        ),
        NOW(),
        NOW()
    );

-- Seed data for Players
INSERT INTO
    Players (
        id,
        user_id,
        team_id,
        performance_stats,
        created_at,
        updated_at
    )
VALUES
    (
        gen_random_uuid(),
        (
            SELECT
                id
            FROM
                Users
            WHERE
                name = 'John Doe'
        ),
        (
            SELECT
                id
            FROM
                Teams
            WHERE
                name = 'Anytown Soccer Team'
        ),
        '{"goals": 10, "assists": 5}',
        NOW(),
        NOW()
    );

-- Seed data for Venues
INSERT INTO
    Venues (
        id,
        name,
        address,
        city,
        province,
        post_code,
        country,
        geo_location,
        field_info,
        created_at,
        updated_at
    )
VALUES
    (
        gen_random_uuid(),
        'Central Park Field',
        '123 Main St',
        'Anytown',
        'CA',
        '12345',
        'USA',
        ST_GeogFromText('SRID=4326;POINT(-73.961452 40.785091)'),
        '{"type": "soccer", "surface": "grass", "capacity": 200}',
        NOW(),
        NOW()
    );

-- Seed data for Events
INSERT INTO
    Events (
        id,
        name,
        date,
        venue_id,
        team_id,
        created_at,
        updated_at
    )
VALUES
    (
        gen_random_uuid(),
        'Soccer Match',
        '2024-07-01T10:00:00Z',
        (
            SELECT
                id
            FROM
                Venues
            WHERE
                name = 'Central Park Field'
        ),
        (
            SELECT
                id
            FROM
                Teams
            WHERE
                name = 'Anytown Soccer Team'
        ),
        NOW(),
        NOW()
    );

-- Seed data for Registrations
INSERT INTO
    Registrations (
        id,
        parent_id,
        player_id,
        payment_token,
        payment_status,
        created_at,
        updated_at
    )
VALUES
    (
        gen_random_uuid(),
        (
            SELECT
                id
            FROM
                Users
            WHERE
                name = 'John Doe'
        ),
        (
            SELECT
                id
            FROM
                Players
            WHERE
                user_id = (
                    SELECT
                        id
                    FROM
                        Users
                    WHERE
                        name = 'John Doe'
                )
        ),
        'tok_visa',
        'succeeded',
        NOW(),
        NOW()
    );

-- Seed data for Announcements
INSERT INTO
    Announcements (
        id,
        title,
        message,
        target_role,
        created_at,
        updated_at
    )
VALUES
    (
        gen_random_uuid(),
        'Welcome',
        'Welcome to the Youth Soccer League!',
        'all' :: target_role,
        NOW(),
        NOW()
    );