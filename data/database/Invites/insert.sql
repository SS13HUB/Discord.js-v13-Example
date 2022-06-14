
INSERT
    INTO public."Invites" (
        code,
        discovery_date,
        updated
    ) VALUES (
        '__REPLACE_ME__',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (code) DO UPDATE SET
        -- code = '__REPLACE_ME__', 
        updated = CURRENT_TIMESTAMP
    -- WHERE "Invites".code = '__REPLACE_ME__'
    ;
    -- RETURNING *;
