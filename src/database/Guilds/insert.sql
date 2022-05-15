
INSERT
    INTO public."Guilds"
        (key, last_update)
    VALUES
        (value, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE
    SET key = value, last_update = CURRENT_TIMESTAMP
    WHERE "Guilds".id = id;
    -- RETURNING *;
