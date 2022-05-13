
-- DROP TABLE IF EXISTS public."Guilds";

CREATE TABLE IF NOT EXISTS public."Guilds"
(
    id bigint unsigned NOT NULL,
    name character(102) COLLATE pg_catalog."default",
    icon character(255) COLLATE pg_catalog."default",
    splash character(255) COLLATE pg_catalog."default",
    discovery_splash character(255) COLLATE pg_catalog."default",
    owner boolean,
    owner_id bigint COLLATE pg_catalog."default",
    permissions character(255) COLLATE pg_catalog."default",
    --region character(255) COLLATE pg_catalog."default",
    afk_channel_id bigint COLLATE pg_catalog."default",
    afk_timeout int COLLATE pg_catalog."default",
    widget_enabled boolean,
    widget_channel_id bigint COLLATE pg_catalog."default",
    verification_level int COLLATE pg_catalog."default",
    default_message_notifications int COLLATE pg_catalog."default",
    explicit_content_filter int COLLATE pg_catalog."default",
    roles text[] COLLATE pg_catalog."default",
    emojis character(255)[] COLLATE pg_catalog."default",
    features character(255)[] COLLATE pg_catalog."default",
    mfa_level int COLLATE pg_catalog."default",
    application_id bigint COLLATE pg_catalog."default", --is created by bot?
    system_channel_id bigint COLLATE pg_catalog."default",
    system_channel_flags int COLLATE pg_catalog."default",
    rules_channel_id bigint COLLATE pg_catalog."default",
    max_presences int COLLATE pg_catalog."default",
    max_members int COLLATE pg_catalog."default",
    vanity_url_code character(255) COLLATE pg_catalog."default",
    description character(255) COLLATE pg_catalog."default",
    banner character(255) COLLATE pg_catalog."default",
    premium_tier int COLLATE pg_catalog."default",
    premium_subscription_count int COLLATE pg_catalog."default",
    preferred_locale character(255) COLLATE pg_catalog."default",
    public_updates_channel_id bigint COLLATE pg_catalog."default",
    max_video_channel_users int COLLATE pg_catalog."default",
    approximate_member_count int COLLATE pg_catalog."default",
    approximate_presence_count int COLLATE pg_catalog."default",
    welcome_screen text COLLATE pg_catalog."default",
    nsfw_level int COLLATE pg_catalog."default",
    stickers character(255)[] COLLATE pg_catalog."default",
    premium_progress_bar_enabled boolean,

    was_alive_on_update boolean,
    last_update timestamp with time zone,
    invite_link character(20) COLLATE pg_catalog."default",
    CONSTRAINT "Discord_servers_meta_pkey" PRIMARY KEY (id),
    CONSTRAINT valid_server_id CHECK (
        id::numeric >= 0::numeric AND
        id::numeric <= '9223372036854775808'::numeric
    ) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Guilds"
    OWNER to current_user;

COMMENT ON CONSTRAINT valid_server_id ON public."Guilds"
    IS 'snowflake value should be greater than or equal to 0 AND should be less than or equal to 9223372036854775807.';

