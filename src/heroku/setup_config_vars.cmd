
@REM https://devcenter.heroku.com/articles/config-vars

heroku -v
heroku status

heroku login
heroku config

heroku config:set TOKEN=bot_token
heroku config:set LOG_SERVER_ID=server_id
heroku config:set LOG_CHANNEL_ID=lchannel_id

PAUSE
