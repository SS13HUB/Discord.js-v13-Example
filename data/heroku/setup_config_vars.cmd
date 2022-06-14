
@REM https://devcenter.heroku.com/articles/config-vars

heroku -v
heroku status

heroku login
heroku config

heroku config:set TOKEN=bot_token
heroku config:set OWNER_ID=user_id
heroku config:set MASTER_SERVER=server_id
heroku config:set MASTER_CHX_DEBUG_LOG=lchannel_id
heroku config:set MASTER_CHX_POSTING=lchannel_id
heroku config:set MASTER_CHX_POSTING_LOG=channel_id
heroku config:set MASTER_CHX_POSTING_WANTED=channel_id
heroku config:set MASTER_LIBRARIANS_ROLE=role_id

PAUSE
