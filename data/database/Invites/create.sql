
-- Table: public.Invites

-- DROP TABLE IF EXISTS public."Invites";

CREATE TABLE IF NOT EXISTS public."Invites"
(
    code character(102) NOT NULL COLLATE pg_catalog."default",
    guild_id bigint,
    ---
    channel_id bigint,
    inviter_id bigint,
    target_type integer,
    target_user bigint,
    target_application text COLLATE pg_catalog."default",
    approximate_presence_count integer,
    approximate_member_count integer,
    expires_at timestamp,
    stage_instance text COLLATE pg_catalog."default",
    guild_scheduled_event text COLLATE pg_catalog."default",
    ---
    --- https://youtu.be/vK_n9apIOlM
    discoverer_id bigint,
    discovery_date timestamp with time zone,
    was_revoked boolean,
    revoker_id bigint,
    revoke_date timestamp with time zone,
    updater_id bigint,
    updated timestamp with time zone,
    ---
    CONSTRAINT "Invites_pkey" PRIMARY KEY (code),
    CONSTRAINT code UNIQUE (code),
    CONSTRAINT snowflake_check CHECK (
        guild_id::numeric >= 0::numeric AND
        guild_id::numeric <= 9223372036854775808::numeric
    ) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Invites"
    OWNER to current_user;

COMMENT ON TABLE public."Invites"
    IS 'To write...';

COMMENT ON CONSTRAINT snowflake_check ON public."Invites"
    IS 'Snowflake value should be greater than or equal to 0 AND should be less than or equal to 9223372036854775807.';

