
@REM https://devcenter.heroku.com/articles/config-vars

heroku -v
heroku status

heroku login
heroku config

heroku config:set TOKEN=bot_token
heroku config:set MASTER_SERVER=server_id
heroku config:set MASTER_LOG=lchannel_id
heroku config:set MASTER_POSTING=lchannel_id
heroku config:set LIBRARIANS=role_id

PAUSE
