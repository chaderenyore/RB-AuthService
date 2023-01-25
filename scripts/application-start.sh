#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export HOME="/home/ubuntu/"
sudo PM2_HOME=/home/ubuntu/services/.pm2 pm2 list
cd /home/ubuntu/services/Auth
# pm2 delete 
# pm2 --name 
pm2 restart AuthService
