
INSERT
    INTO public."Invites"
        (key)
    VALUES
        (value)
    ON CONFLICT (id) DO UPDATE SET
        last_update = CURRENT_TIMESTAMP,
        invite_link = 'Data';
    -- RETURNING *;
